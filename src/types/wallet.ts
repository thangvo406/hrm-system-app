import type { AppCallback, ListApiResponse } from './common';

export type ContributeHistory = {
  id: number;
  type: string;
  displayType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: string;
  status: string;
  occurredAt: string;
};
export type IRequestGetTransactionHistories = {
  balanceAccountType: string;
  page: number;
  size: number;
};
export type Wallet = {
  id: number;
  userId: number;
  balance: number;
  pointBalance: number;
  status: string;
};

export type TransactionHistory = {
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
};

export type IRequestTopUpWallet = {
  amount: number;
  couponCode?: string;
  paymentProvider: string;
  paymentTransactionId: string;
  description: string;
};

export type GetCurrentWalletPayload = AppCallback<Wallet>;

export type GetTransactionHistoriesPayload = AppCallback<
  ListApiResponse<ContributeHistory[]>
> &
  IRequestGetTransactionHistories;

export type TopUpWalletPayload = AppCallback & IRequestTopUpWallet;
