import type { RootState } from '@services/common/store';
import type { Wallet } from '@type/wallet';

const getCurrentWallet = (state: RootState): Wallet | undefined =>
  state.wallet.currentWallet;

export const WalletSelector = {
  getCurrentWallet,
};
