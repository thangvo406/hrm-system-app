import type { AppCallback, ListApiResponse } from './common';

export interface ContributeHistory {
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
  extends AppCallback<ListApiResponse<ContributeHistory[]>> {
  balanceAccountType: string;
  page: number;
  size: number;
}
export interface Wallet {
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
