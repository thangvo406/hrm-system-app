import type { RootState } from '@services/common/store';
import type { IAccount } from '@type/accountManagement';

const getAccountCards = (state: RootState): IAccount[] =>
  state.accountManagement.accountCards;

export const AccountManagementSelector = {
  getAccountCards,
};
