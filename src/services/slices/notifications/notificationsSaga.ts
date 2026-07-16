import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TAnnouncementImage,
  TAnnouncementItem,
  IRequestGetAnnouncementDetail,
  IRequestGetAnnouncements,
  IRequestGetNotificationDetail,
  IRequestGetNotifications,
  IRequestMarkRead,
  TNotificationItem,
  IResponseAnnouncementImage,
  TNotificationDetail,
} from '@type/notifications';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { AppCallback, ListApiResponse } from '@type/common';
import {
  getAnnouncementById,
  getAnnouncementImages,
  getAnnouncements,
  getNotificationDetail,
  getNotifications,
  markRead,
  markReadAll,
} from '@services/request/notifications';
import {
  getAnnouncementDetailRequest,
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationDetailRequest,
  getNotificationsRequest,
  markReadAllRequest,
  markReadRequest,
} from './notificationsSlice';
import { getErrorMessageApi } from '@utils/common';

function* getNotificationsWorker(
  action: PayloadAction<IRequestGetNotifications>,
) {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<TNotificationItem[]> = yield call(
      getNotifications,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getAnnouncementsWorker(
  action: PayloadAction<IRequestGetAnnouncements>,
): Generator<unknown, void, ListApiResponse<TAnnouncementItem[]>> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<TAnnouncementItem[]> = yield call(
      getAnnouncements,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getAnnouncementImagesWorker(
  action: PayloadAction<AppCallback<TAnnouncementImage[]>>,
): Generator<unknown, void, TAnnouncementImage[]> {
  const { onFailure, onSuccess } = action.payload || {};
  try {
    const response: IResponseAnnouncementImage = yield call(
      getAnnouncementImages,
    );
    yield put(getAnnouncementImagesSuccess(response.items));
    onSuccess?.(response?.items);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* getAnnouncementDetailWorker(
  action: PayloadAction<IRequestGetAnnouncementDetail>,
): Generator<unknown, void, TAnnouncementItem> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: TAnnouncementItem = yield call(
      getAnnouncementById,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    const message = getErrorMessageApi(error);
    onFailure?.(message);
  }
}

function* getNotificationDetailWorker(
  action: PayloadAction<IRequestGetNotificationDetail>,
): Generator<unknown, void, TNotificationDetail> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: TNotificationDetail = yield call(
      getNotificationDetail,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* markReadWorker(
  action: PayloadAction<IRequestMarkRead>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    yield call(markRead, request);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* markReadAllWorker(
  action: PayloadAction<AppCallback>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess } = action.payload || {};
  try {
    yield call(markReadAll);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

export function* notificationsSaga() {
  yield takeLatest(getNotificationsRequest.type, getNotificationsWorker);
  yield takeLatest(getAnnouncementsRequest.type, getAnnouncementsWorker);
  yield takeLatest(
    getAnnouncementImagesRequest.type,
    getAnnouncementImagesWorker,
  );
  yield takeLatest(
    getAnnouncementDetailRequest.type,
    getAnnouncementDetailWorker,
  );
  yield takeLatest(
    getNotificationDetailRequest.type,
    getNotificationDetailWorker,
  );
  yield takeLatest(markReadRequest.type, markReadWorker);
  yield takeLatest(markReadAllRequest.type, markReadAllWorker);
}
