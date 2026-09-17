import type { AxiosRequestConfig } from 'axios';

import AppNavigator from '@navigation/AppNavigator';
import { instance } from '@services/common/instance';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { DeviceUtils } from '@kits/core/utils';
import { ApiLanguages } from '@hooks/language/schema';
import i18next from 'i18next';

type RequestOptions = {
  // Số lần thử lại khi gặp lỗi network. 0 = không retry.
  retry?: number;
  // Khoảng cách giữa các lần retry (ms).
  retryDelay?: number;
  // Khi true, tự động show loading dialog trước request và hide loading
  // sau khi request hoàn tất (return hoặc throw).
  loading?: boolean;
  // Khi true, show popup NetworkError khi request thất bại vì lỗi mạng
  // (sau khi đã hết retry) hoặc lỗi server 5xx. User bấm Try Again → gửi
  // lại request, đóng popup → throw lỗi gốc. Pass false cho các call ngầm
  // không cần popup.
  networkErrorPopup?: boolean;
} & AxiosRequestConfig;

const DEFAULT_RETRY = 0;
const DEFAULT_RETRY_DELAY = 500;

// Device info is fixed for the lifetime of the process, so capture it once
// and attach to every outbound request. Caller-supplied headers win on
// conflict (spread after DEVICE_HEADERS below).
const deviceManufacturerInLib = DeviceInfo.getManufacturerSync();
const deviceManufacturer =
  deviceManufacturerInLib == undefined ? '' : deviceManufacturerInLib;
const getDeviceHeader = () => ({
  'app-buildNumber': DeviceInfo.getBuildNumber(),
  'app-version': DeviceInfo.getVersion(),
  'device-brand': DeviceInfo.getBrand(),
  'device-deviceType': DeviceInfo.getDeviceType(),
  'device-model': DeviceInfo.getModel(),
  'device-systemName': DeviceInfo.getSystemName(),
  'device-systemVersion': DeviceInfo.getSystemVersion(),
  'device-deviceId': DeviceUtils.getDeviceId(),
  'device-manufacturer': deviceManufacturer,
  'accept-language': ApiLanguages[i18next.language as any],
  'device-timezone': DeviceUtils.getTimeZone(),
});

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

// Network error: request đã gửi nhưng không nhận được response
// (mất mạng, timeout, DNS...). Không retry với lỗi HTTP (4xx/5xx).
const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response === undefined;

// Lỗi server (status >= 500): về mặt UX coi như lỗi kết nối — cũng show
// popup NetworkError. Chỉ ảnh hưởng việc show popup, không ảnh hưởng
// option `retry` (vẫn chỉ auto-retry lỗi network thật).
const MIN_SERVER_ERROR_STATUS = 500;
const isServerError = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  (error.response?.status ?? 0) >= MIN_SERVER_ERROR_STATUS;

// Single-flight: nhiều request cùng thất bại vì lỗi mạng chỉ show 1 popup
// NetworkError; tất cả cùng chờ chung lựa chọn của user. Resolve true khi
// user bấm Try Again, false khi popup bị đóng bằng cách khác.
let networkErrorPrompt: Promise<boolean> | undefined;

const promptNetworkRetry = (): Promise<boolean> => {
  networkErrorPrompt ??= new Promise<boolean>(resolve => {
    let shouldRetry = false;
    AppNavigator.showDialogNetworkError({
      callback: () => {
        shouldRetry = true;
      },
      onDismiss: () => {
        networkErrorPrompt = undefined;
        resolve(shouldRetry);
      },
    });
  });
  return networkErrorPrompt;
};

const request = async <T>(
  config: AxiosRequestConfig,
  options: {
    loading: boolean;
    networkErrorPopup: boolean;
    retry: number;
    retryDelay: number;
  },
): Promise<T> => {
  const { loading, networkErrorPopup, retry, retryDelay } = options;
  // Called from both the success and final-error paths so the dialog
  // dismisses BEFORE the return/throw. `hideLoading` returns a Promise
  // that resolves after the dialog system's hide-debounce; we don't await
  // it — the call itself is synchronous (it just schedules a timer), so
  // the dismissal kicks off before the response is handed to the caller.
  const dismissLoading = async () => {
    if (loading) {
      await AppNavigator.hideLoading();
    }
  };

  if (loading) {
    AppNavigator.showLoading();
  }

  let attempt = 0;
  for (;;) {
    try {
      const response = await instance.request<T>({
        ...config,
        headers: {
          ...getDeviceHeader(),
          ...(config.headers as
            | Record<string, string | number | boolean>
            | undefined),
        },
      });
      await dismissLoading();
      return response.data;
    } catch (error) {
      const networkError = isNetworkError(error);
      if (networkError && attempt < retry) {
        attempt += 1;
        await delay(retryDelay);
        continue;
      }
      await dismissLoading();
      const showPopup =
        networkErrorPopup && (networkError || isServerError(error));
      if (!showPopup || !(await promptNetworkRetry())) {
        throw error;
      }
      // User bấm Try Again: chạy lại từ đầu với đủ retry budget.
      attempt = 0;
      if (loading) {
        AppNavigator.showLoading();
      }
    }
  }
};

const buildOptions = (options: RequestOptions) => {
  const {
    loading = true,
    networkErrorPopup = true,
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...config
  } = options;
  return { config, loading, networkErrorPopup, retry, retryDelay };
};

export const httpRequest = {
  delete: <T = unknown>(url: string, options: RequestOptions = {}) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, method: 'DELETE', url }, rest);
  },

  get: <T = unknown>(url: string, options: RequestOptions = {}) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, method: 'GET', url }, rest);
  },

  patch: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'PATCH', url }, rest);
  },

  post: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'POST', url }, rest);
  },

  put: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'PUT', url }, rest);
  },
};
