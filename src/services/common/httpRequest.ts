import type { AxiosRequestConfig } from 'axios';
import type { ZodType } from 'zod';

import { instance } from '@services/common/instance';
import axios from 'axios';

type RequestOptions<T> = {
  // Số lần thử lại khi gặp lỗi network. 0 = không retry.
  retry?: number;
  // Khoảng cách giữa các lần retry (ms).
  retryDelay?: number;
  schema?: ZodType<T>;
} & AxiosRequestConfig;

const DEFAULT_RETRY = 0;
const DEFAULT_RETRY_DELAY = 500;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Network error: request đã gửi nhưng không nhận được response
// (mất mạng, timeout, DNS...). Không retry với lỗi HTTP (4xx/5xx).
const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response === undefined;

const parse = <T>(data: unknown, schema?: ZodType<T>): T =>
  schema ? schema.parse(data) : (data as T);

const request = async <T>(
  config: AxiosRequestConfig,
  options: { retry: number; retryDelay: number; schema?: ZodType<T> },
): Promise<T> => {
  const { retry, retryDelay, schema } = options;

  let attempt = 0;
  for (;;) {
    try {
      const response = await instance.request<unknown>(config);
      return parse(response.data, schema);
    } catch (error) {
      if (attempt >= retry || !isNetworkError(error)) {
        throw error;
      }
      attempt += 1;
      await delay(retryDelay);
    }
  }
};

const buildOptions = <T>(options: RequestOptions<T>) => {
  const {
    retry = DEFAULT_RETRY,
    retryDelay = DEFAULT_RETRY_DELAY,
    schema,
    ...config
  } = options;
  return { config, retry, retryDelay, schema };
};

export const httpRequest = {
  delete: <T = unknown>(url: string, options: RequestOptions<T> = {}) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, method: 'DELETE', url }, rest);
  },

  get: <T = unknown>(url: string, options: RequestOptions<T> = {}) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, method: 'GET', url }, rest);
  },

  patch: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions<T> = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'PATCH', url }, rest);
  },

  post: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions<T> = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'POST', url }, rest);
  },

  put: <T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions<T> = {},
  ) => {
    const { config, ...rest } = buildOptions(options);
    return request<T>({ ...config, data: body, method: 'PUT', url }, rest);
  },
};
