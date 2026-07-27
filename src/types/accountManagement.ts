import type { AppCallback } from './common';
import { IKcpInitParams } from './payment';

export interface IAccount {
  id: number | string;
  userId: number;
  type: string;
  provider: string;
  status: string;
  displayName: string;
  displayNumber: string;
  holderName: string;
  expiryMonth: any;
  expiryYear: any;
  default: boolean;
}

export interface IRequestAddAccount extends AppCallback<IKcpInitParams> {
  readonly payType: string;
}

// The list endpoint (`balance/payment-method`) takes no params, so the
// payload only carries the success/failure callbacks.
export type IRequestGetAccountCards = AppCallback<IAccount[]>;
