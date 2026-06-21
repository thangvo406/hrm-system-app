export type Wallet = {
  id: number;
  userId: number;
  balance: number;
  pointBalance: number;
  status: string;
};

export type WalletCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (wallet: Wallet) => void;
};

export type GetCurrentWalletPayload = WalletCallback;
