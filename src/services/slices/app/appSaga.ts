import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppCallback } from '@type/common';

import { AccountSelector, AuthSelector } from '@services/selectors';
import { delay, put, select, takeLatest } from 'redux-saga/effects';

import {
  incrementAsync,
  incrementAsyncSuccess,
  startupApp,
  updateEnablePaymentCard,
} from './appSlice';
import { getTotalItemCartRequest } from '../account/accountSlice';
import { Profile } from '@services/request/account';
import { MEMBERSHIP_TYPE } from '@constants/config';
import { logout as logoutRequest } from '../auth/authSlice';
import axios from 'axios';
import { AppConstants } from '@constants';
import i18next, {
  executeLanguageFallback,
  reloadResource,
} from '@translations';
import { SupportedLanguages } from '@hooks/language/schema';

const ASYNC_DELAY = 1000;
const STARTUP_DELAY = 1000;
const STARTUP_ERROR = 'startup_error';

export function* appSaga() {
  yield takeLatest(incrementAsync.type, incrementAsyncWorker);
  yield takeLatest(startupApp.type, startupAppWorker);
}

function* incrementAsyncWorker(action: PayloadAction<number>) {
  yield delay(ASYNC_DELAY);
  yield put(incrementAsyncSuccess(action.payload));
}

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
    yield checkNetworkTranslation();
    yield delay(STARTUP_DELAY);
    const accessToken: string | undefined = yield select(
      AuthSelector.getAccessToken,
    );
    const universityId: number | undefined = yield select(
      AuthSelector.getUniversityId,
    );
    yield put(updateEnablePaymentCard(false));
    const profile: Profile = yield select(AccountSelector.getProfile);
    let isAuthenticated = Boolean(accessToken);
    if (
      !profile ||
      (profile?.membershipType == MEMBERSHIP_TYPE.NON_MEMBER && !universityId)
    ) {
      yield put(logoutRequest());
      isAuthenticated = false;
    }
    if (isAuthenticated) {
      yield put(getTotalItemCartRequest());
    }
    action.payload.onSuccess?.(isAuthenticated);
  } catch {
    action.payload.onFailure?.(STARTUP_ERROR);
  }
}
