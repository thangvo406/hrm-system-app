import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '@services/request/account';
import type { AddressSuggestion } from '@services/request/account';

import type {
  IResponseCreateQRCodeMember,
  IRequestAutoCompleteAddress,
  IRequestGetBankInfo,
  IRequestGetVouchers,
  IRequestUpdateMembership,
  IRequestUpdatePassword,
  IRequestUpdatePushId,
  IUpdateAvatarRequest,
  IUpdateProfileInfoRequest,
  IRequestCreateQRCodeMember,
  IResponseBankInfo,
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
  createQRCodeMember,
  deleteAccount,
  getBankInfo,
  getProfile,
  getVouchers,
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
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { getErrorMessageApi } from '@utils/common';

import {
  activeAccountRequest,
  autoCompleteAddressRequest,
  deleteAccountRequest,
  generateQRCodeMemberRequest,
  getBankInfoRequest,
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

function* getVouchersWorker(
  action: PayloadAction<IRequestGetVouchers>,
): Generator<unknown, void, ListApiResponse<IVoucher[]>> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<IVoucher[]> = yield call(
      getVouchers,
      request,
    );
    onSuccess?.(response);
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

function* generateQRCodeMemberWorker(
  action: PayloadAction<IRequestCreateQRCodeMember>,
): Generator<unknown, void, IResponseCreateQRCodeMember> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: IResponseCreateQRCodeMember = yield call(
      createQRCodeMember,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getBankInfoWorker(
  action: PayloadAction<IRequestGetBankInfo>,
): Generator<unknown, void, IResponseBankInfo> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseBankInfo = yield call(getBankInfo, request);
    onSuccess?.(response);
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
  yield takeLatest(
    generateQRCodeMemberRequest.type,
    generateQRCodeMemberWorker,
  );
  yield takeLatest(getBankInfoRequest.type, getBankInfoWorker);
  yield takeLatest(getTotalItemCartRequest.type, getTotalItemCartWorker);
  // takeEvery (not takeLatest): voucher tabs share one action type, so a new
  // fetch (tab switch / refresh) must not cancel an in-flight one. Duplicate
  // work is already guarded in the hook (requestedTabs / isLoadingMore).
  yield takeEvery(getVouchersRequest.type, getVouchersWorker);
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
