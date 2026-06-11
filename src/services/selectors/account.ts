import type { Profile } from '@services/request/account';
import type { RootState } from '@services/common/store';

const getAccountLoading = (state: RootState): boolean => state.account.loading;

const getProfile = (state: RootState): Profile | undefined => state.account.profile;

export const AccountSelector = {
  getAccountLoading,
  getProfile,
};
