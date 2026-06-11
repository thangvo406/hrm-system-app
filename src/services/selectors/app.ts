import type { RootState } from '@services/common/store';

const getCounter = (state: RootState): number => state.app.counter;

const getLoading = (state: RootState): boolean => state.app.loading;

export const AppSelector = {
  getCounter,
  getLoading,
};
