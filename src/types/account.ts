import type { AddressSuggestion } from '@services/request/account';

import type { AppCallback, ListApiResponse } from './common';
import type { IContributeHistory } from './wallet';

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
  universityId: number;
  universityEmail: string;
  applicationNote?: string;
}

// Fire-and-forget: action này không có callback.
export interface IRequestUpdatePushId {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
}

export interface IRequestWithdrawalBalance
  extends AppCallback {
    requestedAmount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    reason?: string;
}

export interface IPointPayHistory {
  id: number
  userId: number
  transactionType: string
  balanceAccountType: string
  entryType: string
  transactionDirection: string
  amount: number
  bonusAmount: number
  chargeBonusAmount: number
  moneyBonusAmount: number
  pointBonusAmount: number
  totalAmount: number
  balanceBefore: number
  balanceAfter: number
  referenceType?: string
  referenceId?: number
  paymentProvider?: string
  paymentTransactionId: string
  paymentMethod: any
  memberGrade?: string
  storeRate: any
  payMoneyRate?: number
  benefitRate?: number
  totalRate?: number
  storeId?: number
  storeName?: string
  orderId?: number
  orderNumber?: string
  order: any
  pointExpiresAt: any
  pointRemainingAmount: any
  status: string
  createdDate: string
}
export interface IRequestGetPayPointHistories
  extends AppCallback<ListApiResponse<IPointPayHistory[]>> {
    balanceAccountType: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    size: number;
}
export interface IRequestCreateQRCodeMember
  extends AppCallback<IResponseCreateQRCodeMember> {
  cpn: string[];
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

export interface IResponseCreateQRCodeMember {
  readonly expiresIn: number;
  readonly qrImageBase64: string;
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

export type IMealTicket = {
  id: number
  externalId: number
  code: string
  purchaseAt: string
  expireAt: string
  usedAt: string
  status: string
  orderId: number
  orderNumber: string
  productId: number
  productName: string
  productDescription: string
};