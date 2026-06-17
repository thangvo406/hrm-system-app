import type { AxiosRequestConfig } from 'axios';

import AppNavigator from '@navigation/AppNavigator';
import { instance } from '@services/common/instance';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { DeviceUtils } from '@kits/core/utils';

type RequestOptions = {
  // Số lần thử lại khi gặp lỗi network. 0 = không retry.
  retry?: number;
  // Khoảng cách giữa các lần retry (ms).
  retryDelay?: number;
  // Khi true, tự động show loading dialog trước request và hide loading
  // sau khi request hoàn tất (return hoặc throw).
  loading?: boolean;
} & AxiosRequestConfig;

const DEFAULT_RETRY = 0;
const DEFAULT_RETRY_DELAY = 500;

// Device info is fixed for the lifetime of the process, so capture it once
// and attach to every outbound request. Caller-supplied headers win on
// conflict (spread after DEVICE_HEADERS below).
const deviceManufacturerInLib = DeviceInfo.getManufacturerSync();
const deviceManufacturer =
  deviceManufacturerInLib == undefined ? '' : deviceManufacturerInLib;
const DEVICE_HEADERS = {
  'x-app-buildNumber': DeviceInfo.getBuildNumber(),
  'x-app-version': DeviceInfo.getVersion(),
  'x-device-brand': DeviceInfo.getBrand(),
  'x-device-deviceType': DeviceInfo.getDeviceType(),
  'x-device-model': DeviceInfo.getModel(),
  'x-device-systemName': DeviceInfo.getSystemName(),
  'x-device-systemVersion': DeviceInfo.getSystemVersion(),
  'x-device-deviceId': DeviceUtils.getDeviceId(),
  'x-device-manufacturer': deviceManufacturer,
};

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

// Network error: request đã gửi nhưng không nhận được response
// (mất mạng, timeout, DNS...). Không retry với lỗi HTTP (4xx/5xx).
const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response === undefined;

const request = async <T>(
  config: AxiosRequestConfig,
  options: { loading: boolean; retry: number; retryDelay: number },
): Promise<T> => {
  const { loading, retry, retryDelay } = options;
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
          ...DEVICE_HEADERS,
          ...((config.headers as
            | Record<string, string | number | boolean>
            | undefined) || {}),
        },
      });
      await dismissLoading();
      return response.data;
    } catch (error) {
      if (attempt >= retry || !isNetworkError(error)) {
        await dismissLoading();
        throw error;
      }
      attempt += 1;
      await delay(retryDelay);
    }
  }
};

const buildOptions = (options: RequestOptions) => {
  const {
    loading = true,
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...config
  } = options;
  return { config, loading, retry, retryDelay };
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
