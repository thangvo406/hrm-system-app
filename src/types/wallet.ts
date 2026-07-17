import type { AppCallback, ListApiResponse } from './common';


export interface IContributeSummary {
  readonly currentContribution: number;
  readonly totalDividend: number;
  readonly expectedDividend: number;
  readonly expectedDividendDate: string;
}

export interface IContributeHistoryDetail {
  id: number;
  type: string;
  displayType: string;
  amount: number;
  contributionDividend?: number;
  paidAt?: number;
  totalDividend?: number;
  usageDividend?: number;
  status: string;
  paymentCompleted: boolean;
  adminApproved: boolean;
  paymentMethod: string;
  paymentType?: string;
  requestedAt: string;
  processedAt: string;
  adminNote: string;
  kcpSessionData: string;
  virtualAccount: string;
}

export interface IRequestGetContributeHistoryDetail
  extends AppCallback<IContributeHistoryDetail> {
  readonly historyId: number | string;
}

export interface IRequestGetHistoriesDividend
  extends AppCallback<ListApiResponse<IDividendHistory[]>> {
  readonly page: number;
  readonly size: number;
}

export interface IRequestGetDividendDetail
  extends AppCallback<IContributeHistoryDetail> {
  readonly dividendId: number;
}

export interface IContributeHistory {
  id: number;
  type: string;
  displayType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: string;
  status: string;
  occurredAt: string;
}

export interface IDividendHistory {
  id: number;
  fiscalYear: string;
  totalDividend: number;
  contributionDividend: number;
  usageDividend: number;
  balanceBefore: number;
  balanceAfter: number;
  paidAt: string;
}

export interface IRequestGetTransactionHistories
  extends AppCallback<ListApiResponse<IContributeHistory[]>> {
  balanceAccountType: string;
  page: number;
  size: number;
}
export interface IWallet {
  id: number;
  userId: number;
  balance: number;
  pointBalance: number;
  status: string;
}

export interface TransactionHistory {
  id: number;
  walletId: number;
  userId: number;
  transactionType: string;
  transactionDirection: string;
  amount: number;
  bonusAmount: number;
  totalAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  couponCampaignId: any;
  couponCode: any;
  description: string;
  status: string;
  createdDate: string;
}

export interface IRequestTopUpWallet extends AppCallback {
  amount: number;
  couponCode?: string;
  paymentProvider: string;
  paymentTransactionId: string;
  description: string;
}

