import type { IUniversityData } from '@type/auth';
import type { RootState } from '@services/common/store';

const EMPTY_UNIVERSITY_DATA: IUniversityData = {
  content: [],
  isLast: false,
  page: 0,
};

const getAccessToken = (state: RootState): string | undefined =>
  state.auth.accessToken;

const getIsAuthenticated = (state: RootState): boolean =>
  Boolean(state.auth.accessToken);

const getRefreshToken = (state: RootState): string | undefined =>
  state.auth.refreshToken;

// Defaults guard rehydrated state persisted before `universityData` existed.
const getUniversityData = (state: RootState): IUniversityData =>
  state.auth.universityData ?? EMPTY_UNIVERSITY_DATA;

const getUniversityId = (state: RootState): number | undefined =>
  state.auth.universityId;

export const AuthSelector = {
  getAccessToken,
  getIsAuthenticated,
  getRefreshToken,
  getUniversityData,
  getUniversityId,
};
