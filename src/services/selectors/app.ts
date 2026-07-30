import type { RootState } from '@services/common/store';

const getCounter = (state: RootState): number => state.app.counter;
const isEnablePaymentCard = (state: RootState): boolean => state.app.isEnablePaymentCard;

export const AppSelector = {
  getCounter,
  isEnablePaymentCard
};
