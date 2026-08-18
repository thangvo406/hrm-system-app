import type { RootState } from '@services/common/store';

const getCounter = (state: RootState): number => state.app.counter;
const isEnablePaymentCard = (state: RootState): boolean =>
  state.app.isEnablePaymentCard;
const isEnableAddress = (state: RootState): boolean =>
  state.app.isEnableAddress;

export const AppSelector = {
  getCounter,
  isEnablePaymentCard,
  isEnableAddress,
};
