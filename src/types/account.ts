import type { AddressSuggestion } from '@services/request/account';

import type { AppCallback } from './common';

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

export type VoucherStatus = 'available' | 'expired' | 'used';

export interface IRequestGetVouchers extends AppCallback<IVoucher[]> {
  type: VoucherStatus;
}

export type IVoucher = {
  readonly applicableStore?: string;
  readonly daysLeft: number;
  readonly description: string;
  readonly id: string;
  readonly minPayment?: number;
  readonly status: VoucherStatus;
  readonly title: string;
  readonly validUntil: string;
};
