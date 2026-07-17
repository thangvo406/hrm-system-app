import type { Profile } from '@services/request/account';
import type { RootState } from '@services/common/store';
import type { IWallet } from '@type/wallet';

const getCurrentWallet = (state: RootState): IWallet | undefined =>
  state.account.currentWallet;
const getProfile = (state: RootState): Profile | undefined =>
  state.account.profile;
const getPushId = (state: RootState): string | undefined =>
  state.account.pushId;
const getTotalItemCart = (state: RootState): number =>
  state.account.totalItemCart;

export const AccountSelector = {
  getCurrentWallet,
  getProfile,
  getPushId,
  getTotalItemCart,
};
