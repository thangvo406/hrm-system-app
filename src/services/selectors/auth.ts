import type { RootState } from '@services/common/store';

const getAccessToken = (state: RootState): string | undefined =>
  state.auth.accessToken;

const getIsAuthenticated = (state: RootState): boolean =>
  Boolean(state.auth.accessToken);

const getRefreshToken = (state: RootState): string | undefined =>
  state.auth.refreshToken;

const getUniversityId = (state: RootState): number | undefined =>
  state.auth.universityId;

export const AuthSelector = {
  getAccessToken,
  getIsAuthenticated,
  getRefreshToken,
  getUniversityId,
};
