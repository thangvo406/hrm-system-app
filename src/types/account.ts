import type { AddressSuggestion } from '@services/request/account';

import type { AppCallback, ListApiResponse } from './common';

export interface IRequestAutoCompleteAddress
  extends AppCallback<AddressSuggestion[]> {
  readonly query: string;
}

export interface IRequestUpdatePassword extends AppCallback {
  currentPassword: string;
  newPassword: string;
}
export interface IRequestUpdateMembership extends AppCallback {
  membershipType: string;
}

// Fire-and-forget: action này không có callback.
export interface IRequestUpdatePushId {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
}

export interface IUpdateProfileInfoRequest extends AppCallback {
  name?: string;
  fullName?: string;
}
export interface IUpdateAvatarRequest extends AppCallback {
  avatarPath?: string;
  file?: any;
}

export type VoucherStatus = 'AVAILABLE' | 'EXPIRED' | 'USED';

export interface IRequestGetVouchers
  extends AppCallback<ListApiResponse<IVoucher[]>> {
  status: VoucherStatus;
  code?: string;
  page: number;
  size: number;
  orderAmount?: number;
  storeId?: number;
}

export type IStoreVoucher = {
  storeId: number;
  storeName: string;
};
export type IVoucher = {
  readonly stores?: IStoreVoucher[];
  readonly daysRemaining: number;
  readonly name: string;
  readonly id: string;
  readonly minOrderAmount?: number;
  readonly expiredTo: string;
  readonly code: string;
  readonly type: string;
  readonly discountRate: number;
  readonly discountAmount: number;
};
