import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import {
  clearCredentials,
  setCredentials,
} from '@services/slices/auth/authSlice';
import { store } from '@services/common/store';
import axios from 'axios';
import Config from 'react-native-config';

// const baseURL = `${Config.API_URL}/`;
const baseURL = `http://52.79.38.251/`;

const HTTP_UNAUTHORIZED = 401;
const REQUEST_TIMEOUT_MS = 15_000;

// Bare client without auth interceptors — used for the refresh call to avoid
// recursive 401 handling.
const refreshClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: REQUEST_TIMEOUT_MS,
});

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

// Single-flight: concurrent 401s share one refresh request.
let refreshPromise: Promise<string | undefined> | undefined;

const refreshAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = store.getState().auth.refreshToken;
  if (refreshToken === undefined) {
    return undefined;
  }

  try {
    const { data } = await refreshClient.post<RefreshResponse>('auth/refresh', {
      refreshToken,
    });

    store.dispatch(setCredentials(data));
    return data.accessToken;
  } catch {
    store.dispatch(clearCredentials());
    return undefined;
  }
};

const requestRefresh = (): Promise<string | undefined> => {
  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = undefined;
  });
  return refreshPromise;
};

export const instance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
  timeout: REQUEST_TIMEOUT_MS,
});

instance.interceptors.request.use(config => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken !== undefined) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | ({ _retry?: boolean } & InternalAxiosRequestConfig)
      | undefined;

    if (
      error.response?.status !== HTTP_UNAUTHORIZED ||
      originalRequest === undefined ||
      originalRequest._retry === true
    ) {
      throw error;
    }

    originalRequest._retry = true;
    const newToken = await requestRefresh();
    if (newToken === undefined) {
      throw error;
    }

    originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
    return instance(originalRequest);
  },
);
