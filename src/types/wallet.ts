import { ListApiResponse } from './common';

export type IRequestGetTransactionHistories = {
  transactionType?: string;
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

export type WalletCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (data: ListApiResponse<TransactionHistory[]>) => void;
};

export type GetCurrentWalletPayload = WalletCallback;

export type GetTransactionHistoriesPayload = IRequestGetTransactionHistories &
  WalletCallback;
