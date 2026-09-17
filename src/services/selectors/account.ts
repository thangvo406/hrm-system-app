import type { Profile } from '@services/request/account';
import type { RootState } from '@services/common/store';

const getProfile = (state: RootState): Profile | undefined =>
  state.account.profile;
const getPushId = (state: RootState): string | undefined =>
  state.account.pushId;

export const AccountSelector = {
  getProfile,
  getPushId,
};
