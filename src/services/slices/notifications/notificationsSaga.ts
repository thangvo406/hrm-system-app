import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TAnnouncementImage,
  TAnnouncementItem,
  TGetAnnouncementDetailPayload,
  TGetAnnouncementImagesPayload,
  TGetAnnouncementsPayload,
  TGetNotificationDetailPayload,
  TGetNotificationsPayload,
  TMarkReadPayload,
  TNotificationItem,
  IResponseAnnouncementImage,
  TNotificationDetail,
} from '@type/notifications';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { ListApiResponse } from '@type/common';
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
  action: PayloadAction<TGetNotificationsPayload>,
) {
  const { onSuccess, onFailure, ...request } = action.payload || {};
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
  action: PayloadAction<TGetAnnouncementsPayload>,
): Generator<unknown, void, ListApiResponse<TAnnouncementItem[]>> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
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
  action: PayloadAction<TGetAnnouncementImagesPayload>,
): Generator<unknown, void, TAnnouncementImage[]> {
  const { onSuccess, onFailure } = action.payload || {};
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
  action: PayloadAction<TGetAnnouncementDetailPayload>,
): Generator<unknown, void, TAnnouncementItem> {
  const { announcementId, onSuccess, onFailure } = action.payload || {};
  try {
    const response: TAnnouncementItem = yield call(
      getAnnouncementById,
      announcementId,
    );
    onSuccess?.(response);
  } catch (error) {
    const message = getErrorMessageApi(error);
    onFailure?.(message);
  }
}

function* getNotificationDetailWorker(
  action: PayloadAction<TGetNotificationDetailPayload>,
): Generator<unknown, void, TNotificationDetail> {
  const { notifyId, onSuccess, onFailure } = action.payload || {};
  try {
    const response: TNotificationDetail = yield call(
      getNotificationDetail,
      notifyId,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* markReadWorker(
  action: PayloadAction<TMarkReadPayload>,
): Generator<unknown, void, void> {
  const { notifyId, onSuccess, onFailure } = action.payload || {};
  try {
    yield call(markRead, notifyId);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_);
    onFailure?.(message);
  }
}

function* markReadAllWorker(
  action: PayloadAction<TMarkReadPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure } = action.payload || {};
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
