import type { RootState } from '@services/common/store';
import type { IAppConfig } from '@type/app';

const getConfig = (state: RootState): IAppConfig | undefined =>
  state.app.config;
const getCounter = (state: RootState): number => state.app.counter;
const isEnablePaymentCard = (state: RootState): boolean =>
  state.app.isEnablePaymentCard;
const isEnableAddress = (state: RootState): boolean =>
  state.app.isEnableAddress;

export const AppSelector = {
  getConfig,
  getCounter,
  isEnablePaymentCard,
  isEnableAddress,
};
