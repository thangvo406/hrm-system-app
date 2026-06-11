import type { RootState } from '@services/common/store';

const getAccessToken = (state: RootState): string | undefined =>
  state.auth.accessToken;

const getError = (state: RootState): string | undefined => state.auth.error;

const getIsAuthenticated = (state: RootState): boolean =>
  Boolean(state.auth.accessToken);

const getLoading = (state: RootState): boolean => state.auth.loading;

const getRefreshToken = (state: RootState): string | undefined =>
  state.auth.refreshToken;

export const AuthSelector = {
  getAccessToken,
  getError,
  getIsAuthenticated,
  getLoading,
  getRefreshToken,
};
