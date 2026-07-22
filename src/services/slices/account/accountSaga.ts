import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type { AddressSuggestion } from '@services/request/account';
import type {
  IRequestAutoCompleteAddress,
  IRequestGetVouchers,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
  IUpdateAvatarRequest,
  IUpdateProfileInfoRequest,
  IVoucher,
} from '@type/account';
import type {
  IContributeHistory,
  IRequestGetTransactionHistories,
  IRequestTopUpWallet,
  IWallet,
} from '@type/wallet';
import type { AppCallback, IImage, ListApiResponse } from '@type/common';
import type { TransactionHistory } from '@type/wallet';
import type { ITotalItemCart } from '@type/payment';
import type { IRequestDeleteAccount } from '@type/auth';

import {
  activeAccount,
  autoCompleteAddress,
  deleteAccount,
  getProfile,
  updateMembership,
  updatePassword,
  updateProfileInfo,
  updatePushId,
  uploadAvatar,
  uploadFile,
} from '@services/request/account';
import {
  getCurrentWallet,
  getContributeHistories,
  topUpWallet,
} from '@services/request/wallet';
import { getTotalItemCart } from '@services/request/payment';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { getErrorMessageApi } from '@utils/common';

import {
  activeAccountRequest,
  autoCompleteAddressRequest,
  deleteAccountRequest,
  getCurrentWalletRequest,
  getCurrentWalletSuccess,
  getProfileRequest,
  getProfileSuccess,
  getTotalItemCartRequest,
  getTotalItemCartSuccess,
  getVouchersRequest,
  getContributeHistoriesRequest,
  topUpWalletRequest,
  updateMembershipRequest,
  updatePasswordRequest,
  updateProfileInfoRequest,
  updatePushIdRequest,
  uploadAvatarRequest,
} from './accountSlice';
import { AccountSelector } from '@services/selectors';
import { refreshTokenRequest } from '../auth/authSlice';

const MOCK_VOUCHERS_DELAY_MS = 400;

// Mock data — replace with a real request function once the endpoint exists.
const MOCK_VOUCHERS: readonly IVoucher[] = [
  {
    applicableStore: '카페 COOP',
    daysLeft: 30,
    description: '카페 COOP 전 음료 1잔 무료',
    id: 'voucher-drink-free',
    status: 'available',
    title: '음료 무료 쿠폰',
    validUntil: '2026-07-31',
  },
  {
    daysLeft: 45,
    description: '매장 전체 10% 할인',
    id: 'voucher-discount-10',
    minPayment: 5000,
    status: 'available',
    title: '10% 할인 쿠폰',
    validUntil: '2026-08-15',
  },
  {
    daysLeft: 4,
    description: '스마트오더 배송비 무료',
    id: 'voucher-free-shipping',
    status: 'available',
    title: '무료배송 쿠폰',
    validUntil: '2026-07-05',
  },
  {
    applicableStore: '생협 매장',
    daysLeft: 0,
    description: '도서 구매 5% 적립 쿠폰',
    id: 'voucher-book-point',
    status: 'used',
    title: '도서 적립 쿠폰',
    validUntil: '2026-06-20',
  },
  {
    daysLeft: 0,
    description: '신학기 문구 3,000원 할인',
    id: 'voucher-stationery',
    minPayment: 10_000,
    status: 'expired',
    title: '문구 할인 쿠폰',
    validUntil: '2026-03-31',
  },
];

function* getVouchersWorker(
  action: PayloadAction<IRequestGetVouchers>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, type } = action.payload;
  try {
    // Simulate the network round-trip; swap for `call(getVouchers, request)`.
    yield delay(MOCK_VOUCHERS_DELAY_MS);
    onSuccess?.(MOCK_VOUCHERS.filter(voucher => voucher.status === type));
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getTotalItemCartWorker(
  action: PayloadAction<AppCallback<ITotalItemCart>>,
): Generator<unknown, void, ITotalItemCart> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    const data: ITotalItemCart = yield call(getTotalItemCart);
    yield put(getTotalItemCartSuccess(data));
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* activeAccountWorker(action: PayloadAction<AppCallback>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(activeAccount, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* deleteAccountWorker(action: PayloadAction<IRequestDeleteAccount>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(deleteAccount, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getProfileWorker(action: PayloadAction<AppCallback<Profile>>) {
  try {
    const oldProfile: Profile = yield select(AccountSelector.getProfile);
    const profile: Profile = yield call(getProfile);
    if (
      oldProfile &&
      JSON.stringify(oldProfile.permissionCodes) !=
        JSON.stringify(profile?.permissionCodes)
    ) {
      yield put(refreshTokenRequest());
    }
    yield put(getProfileSuccess(profile));
    action.payload.onSuccess?.(profile);
  } catch {
    action.payload.onFailure?.('');
  }
}

function* updatePushIdWorker(action: PayloadAction<IRequestUpdatePushId>) {
  try {
    yield call(updatePushId, action.payload);
  } catch {
    // silent
  }
}

function* updateMembershipWorker(
  action: PayloadAction<IRequestUpdateMembership>,
) {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    yield call(updateMembership, request);
    onSuccess?.();
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

function* updatePasswordWorker(action: PayloadAction<IRequestUpdatePassword>) {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    yield call(updatePassword, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* uploadAvatarWorker(action: PayloadAction<IUpdateAvatarRequest>) {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    const uploadResponse: IImage = yield call(uploadFile, {
      file: request.file,
    });
    const response: Profile = yield call(uploadAvatar, {
      avatarPath: uploadResponse.filePath,
    });
    yield put(getProfileSuccess(response));
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* updateProfileInfoWorker(
  action: PayloadAction<IUpdateProfileInfoRequest>,
) {
  const { onSuccess, onFailure, ...request } = action.payload;
  try {
    const response: Profile = yield call(updateProfileInfo, request);
    yield put(getProfileSuccess(response));
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getCurrentWalletWorker(
  action: PayloadAction<AppCallback<IWallet>>,
): Generator<unknown, void, IWallet> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    const wallet: IWallet = yield call(getCurrentWallet);
    yield put(getCurrentWalletSuccess(wallet));
    onSuccess?.(wallet);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getContributeHistoriesWorker(
  action: PayloadAction<IRequestGetTransactionHistories>,
): Generator<unknown, void, ListApiResponse<IContributeHistory[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: ListApiResponse<IContributeHistory[]> = yield call(
      getContributeHistories,
      request,
    );
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* topUpWalletWorker(
  action: PayloadAction<IRequestTopUpWallet>,
): Generator<unknown, void, ListApiResponse<TransactionHistory[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: ListApiResponse<TransactionHistory[]> = yield call(
      topUpWallet,
      request,
    );
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* autoCompleteAddressWorker(
  action: PayloadAction<IRequestAutoCompleteAddress>,
): Generator<unknown, void, AddressSuggestion[]> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const data: AddressSuggestion[] = yield call(autoCompleteAddress, request);
    onSuccess?.(data);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* accountSaga() {
  yield takeLatest(activeAccountRequest.type, activeAccountWorker);
  yield takeLatest(autoCompleteAddressRequest.type, autoCompleteAddressWorker);
  yield takeLatest(deleteAccountRequest.type, deleteAccountWorker);
  yield takeLatest(getTotalItemCartRequest.type, getTotalItemCartWorker);
  yield takeLatest(getVouchersRequest.type, getVouchersWorker);
  yield takeLatest(getProfileRequest.type, getProfileWorker);
  yield takeLatest(updateMembershipRequest.type, updateMembershipWorker);
  yield takeLatest(updatePasswordRequest.type, updatePasswordWorker);
  yield takeLatest(updateProfileInfoRequest.type, updateProfileInfoWorker);
  yield takeLatest(updatePushIdRequest.type, updatePushIdWorker);
  yield takeLatest(uploadAvatarRequest.type, uploadAvatarWorker);
  yield takeLatest(getCurrentWalletRequest.type, getCurrentWalletWorker);
  yield takeLatest(
    getContributeHistoriesRequest.type,
    getContributeHistoriesWorker,
  );
  yield takeLatest(topUpWalletRequest.type, topUpWalletWorker);
}
