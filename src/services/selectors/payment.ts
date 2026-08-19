import type { RootState } from '@services/common/store';
import type { IContributeSummary } from '@type/wallet';

const getContributeSummary = (
  state: RootState,
): IContributeSummary | undefined => state.payment.contributeSummary;

export const PaymentSelector = {
  getContributeSummary,
};
