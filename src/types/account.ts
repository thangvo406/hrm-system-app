import type { AddressSuggestion } from '@services/request/account';

import type { AppCallback, IImage, ListApiResponse } from './common';
import type { ITransactionDetail } from './payment';
import { IResponseSendOtpVerifyMembership } from './auth';

export interface IRequestAutoCompleteAddress
  extends AppCallback<AddressSuggestion[]> {
  readonly query: string;
}

export interface IRequestUpdatePassword extends AppCallback {
  currentPassword: string;
  newPassword: string;
}
export interface IRequestUpdateMembership
  extends AppCallback<IResponseSendOtpVerifyMembership> {
  membershipType: string;
  universityId: number;
  universityEmail: string;
  applicationNote?: string;
}

export interface IRequestGetTransactionMovement
  extends AppCallback<ListApiResponse<ITransactionMovement[]>> {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface IRequestGetTransactionDetail
  extends AppCallback<ITransactionDetail> {
  transactionId: number;
}

export interface ITransactionMovement {
  transactionKey: string;
  occurredAt: string;
  moneyAmount?: number;
  moneyInAmount?: number;
  moneyOutAmount?: number;
  pointAmount: number;
  pointEarnedAmount?: number;
  pointUsedAmount?: number;
  moneyBalanceBefore?: number;
  moneyBalanceAfter?: number;
  pointBalanceBefore: number;
  pointBalanceAfter: number;
  chargeBonusAmount: any;
  chargeBonusPayMoneyRate: any;
  chargeBonusBenefitRate: any;
  chargeBonusTotalRate: any;
  memberGrade: any;
  headlineAction: string;
  headlineEntryType: string;
  headlineSourceType: string;
  headlinePaymentType: any;
  storeId: number;
  storeName: string;
  orderId: number;
  orderNumber: string;
  orderTotalAmount: number;
  description: any;
  legCount: number;
}
export interface IRequestUpdatePushId {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
}

export interface IRequestWithdrawalBalance extends AppCallback {
  requestedAmount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason?: string;
}

export interface IPointPayHistory {
  id: number;
  userId: number;
  transactionType: string;
  balanceAccountType: string;
  entryType: string;
  transactionDirection: string;
  amount: number;
  bonusAmount: number;
  chargeBonusAmount: number;
  moneyBonusAmount: number;
  pointBonusAmount: number;
  totalAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: number;
  paymentProvider?: string;
  paymentTransactionId: string;
  paymentMethod: any;
  memberGrade?: string;
  storeRate: any;
  payMoneyRate?: number;
  benefitRate?: number;
  totalRate?: number;
  storeId?: number;
  storeName?: string;
  orderId?: number;
  orderNumber?: string;
  order: any;
  pointExpiresAt: string;
  pointAfter: number;
  pointRemainingAmount: number;
  status: string;
  createdDate: string;
}

export interface IResponseOrganizationInfo {
  organizationId: number;
  name: string;
  logo: IImage;
  balance: number;
  creditAllowed: boolean;
  creditLimit: number;
  spendableAmount: number;
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
  extends AppCallback<IGenerateQRCodeResponse> {
  cpn?: string[];
  paymentType?: string;
  organizationId?: number;
}
export interface IRequestGenerateQRCodeMealTicket
  extends AppCallback<IResponseGenerateQRCodeMealTicket> {
  ticketCode: string;
}

export interface IResponseGenerateQRCodeMealTicket {
  data: { ticket_code: string };
}
export interface IUpdateProfileInfoRequest extends AppCallback {
  name?: string;
  fullName?: string;
  receiptPhoneNumber?: string;
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

export interface IGenerateQRCodeResponse {
  readonly expiresIn: number;
  readonly qrImageBase64: string;
  readonly token: string;
}

export type IQRCodeViewerData = {
  readonly amountText?: string;
  readonly headerBadge?: string;
  readonly expiresIn?: number;
  readonly token?: string;
  readonly qrImageBase64?: string;
} & Partial<IVoucher>;

export type IMealTicket = {
  id: number;
  externalId: number;
  code: string;
  purchaseAt: string;
  expireAt: string;
  usedAt: string;
  status: string;
  orderId: number;
  orderNumber: string;
  productId: number;
  productName: string;
  productDescription: string;
};
