import type { RootState } from '@services/common/store';

const getCounter = (state: RootState): number => state.app.counter;

export const AppSelector = {
  getCounter,
};
