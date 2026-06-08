import type { AxiosRequestConfig } from 'axios';

import { instance } from '@services/common/instance';
import axios from 'axios';

type RequestOptions = {
  // Số lần thử lại khi gặp lỗi network. 0 = không retry.
  retry?: number;
  // Khoảng cách giữa các lần retry (ms).
  retryDelay?: number;
} & AxiosRequestConfig;

const DEFAULT_RETRY = 0;
const DEFAULT_RETRY_DELAY = 500;

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
  options: { retry: number; retryDelay: number },
): Promise<T> => {
  const { retry, retryDelay } = options;

  let attempt = 0;
  for (;;) {
    try {
      const response = await instance.request<T>(config);
      return response.data;
    } catch (error) {
      if (attempt >= retry || !isNetworkError(error)) {
        throw error;
      }
      attempt += 1;
      await delay(retryDelay);
    }
  }
};

const buildOptions = (options: RequestOptions) => {
  const {
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    ...config
  } = options;
  return { config, retry, retryDelay };
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
