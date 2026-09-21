import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAppConfig, IRequestGetAppConfig } from '@type/common';
import { SingleApiResponse, type AppCallback } from '@type/common';

import { AccountSelector, AuthSelector } from '@services/selectors';
import { delay, put, select, takeLatest } from 'redux-saga/effects';

import {
  getAppConfigRequest,
  getAppConfigSuccess,
  startupApp,
} from './appSlice';
import { getErrorMessageApi } from '@utils/common';
import { Profile } from '@services/request/account';
import { logout as logoutRequest } from '../auth/authSlice';
import axios from 'axios';
import { AppConstants } from '@constants';
import i18next, {
  executeLanguageFallback,
  reloadResource,
} from '@translations';
import { SupportedLanguages } from '@hooks/language/schema';
import DeviceInfo from 'react-native-device-info';
import AppNavigator from '@navigation/AppNavigator';
import { Globals } from '@utils';

const STARTUP_DELAY = 1000;
const STARTUP_ERROR = 'startup_error';

export function* appSaga() {
  yield takeLatest(getAppConfigRequest.type, getAppConfigWorker);
  yield takeLatest(startupApp.type, startupAppWorker);
}

function checkRequireUpdateApp(versionApp: string) {
  if (!versionApp) {
    return false;
  }
  const currentVersion = DeviceInfo.getVersion();

  const minVersions = versionApp.split('.').map((x: string) => +x);
  const currentVersions = currentVersion.split('.').map((x: string) => +x);
  if (minVersions?.length > 0) {
    const length = Math.max(currentVersions.length, minVersions.length);
    for (let index = 0; index < length; index++) {
      if (minVersions[index] > currentVersions[index]) {
        return true;
      } else if (currentVersions[index] > minVersions[index]) {
        return false;
      }
    }
    return minVersions.length > currentVersions.length;
  }
  return false;
}

function* getAppConfigWorker(
  action: PayloadAction<IRequestGetAppConfig>,
): Generator<unknown, void, IAppConfig> {
  const { onFailure } = action.payload;
  try {
    const response = yield axios.get<SingleApiResponse<IAppConfig>>(
      `${AppConstants.APP_CONFIG_URL}?_=${Date.now()}`,
      {
        timeout: 10_000,
      },
    );
    const data = response.data;
    yield put(getAppConfigSuccess(data));
    if (data?.min_version && !Globals.showingForceUpdate) {
      const isRequired = checkRequireUpdateApp(data?.min_version);
      if (isRequired) {
        Globals.showingForceUpdate = true;
        AppNavigator.showForceUpdate();
      }
    }
  } catch (error_) {
    onFailure?.(getErrorMessageApi(error_));
  }
}

// Đang parked: call site `yield checkNetworkTranslation()` trong
// startupAppWorker vẫn đang comment. Giữ lại để bật khi cần tải i18n từ CDN.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* checkNetworkTranslation() {
  try {
    const response = yield axios.get(
      AppConstants.URL_TRANSLATION.replaceAll(
        '{{lng}}',
        SupportedLanguages.KO_KR,
      ) +
        '?_=' +
        Date.now(),
      {
        timeout: 3000,
      },
    );
    executeLanguageFallback(SupportedLanguages.KO_KR, response.data?.myapp);
    const response2 = yield axios.get(
      AppConstants.URL_TRANSLATION.replaceAll(
        '{{lng}}',
        SupportedLanguages.EN_EN,
      ) +
        '?_=' +
        Date.now(),
      {
        timeout: 3000,
      },
    );
    executeLanguageFallback(SupportedLanguages.EN_EN, response2.data?.myapp);
  } catch {
    //   executeLanguageFallback(i18next.language);
  } finally {
    reloadResource(i18next.language);
  }
}

function* startupAppWorker(action: PayloadAction<AppCallback<boolean>>) {
  try {
    // Splash hold while any future bootstrap work runs (config, i18n, …).
    // yield checkNetworkTranslation();
    yield delay(STARTUP_DELAY);
    const accessToken: string | undefined = yield select(
      AuthSelector.getAccessToken,
    );
    const profile: Profile = yield select(AccountSelector.getProfile);
    let isAuthenticated = Boolean(accessToken);
    // Còn token nhưng chưa có profile thì phiên coi như không hợp lệ.
    if (!profile) {
      yield put(logoutRequest());
      isAuthenticated = false;
    }
    action.payload.onSuccess?.(isAuthenticated);
    yield put(getAppConfigRequest());
  } catch {
    action.payload.onFailure?.(STARTUP_ERROR);
  }
}
