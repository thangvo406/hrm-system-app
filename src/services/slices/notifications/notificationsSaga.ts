import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AnnouncementDetail,
  AnnouncementImage,
  AnnouncementItem,
  GetAnnouncementDetailPayload,
  GetAnnouncementImagesPayload,
  GetAnnouncementsPayload,
  GetNotificationsPayload,
  MarkReadPayload,
  NotificationItem,
} from '@type/notifications';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { ListApiResponse } from '@type/common';
import {
  getAnnouncementById,
  getAnnouncementImages,
  getAnnouncements,
  getNotifications,
  markRead,
  markReadAll,
} from '@services/request/notifications';
import {
  getAnnouncementDetailRequest,
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationsRequest,
  markReadAllRequest,
  markReadRequest,
} from './notificationsSlice';
import { getErrorMessageApi } from '@utils/common';

function* getNotificationsWorker(
  action: PayloadAction<GetNotificationsPayload>,
) {
  const { onSuccess, onFailure, ...request} = action.payload || {}
  try {
    const response: ListApiResponse<NotificationItem[]> = yield call(getNotifications, request);
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_)
    onFailure?.(message);
  }
}

function* getAnnouncementsWorker(
  action: PayloadAction<GetAnnouncementsPayload>,
): Generator<unknown, void, ListApiResponse<AnnouncementItem[]>> {
  const { onSuccess, onFailure, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<AnnouncementItem[]> = yield call(
      getAnnouncements,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_)
    onFailure?.(message);
  }
}

function* getAnnouncementImagesWorker(
  action: PayloadAction<GetAnnouncementImagesPayload>,
): Generator<unknown, void, AnnouncementImage[]> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    const response: AnnouncementImage[] = yield call(getAnnouncementImages);
    yield put(getAnnouncementImagesSuccess(response));
    onSuccess?.(response);
  } catch (error_) {
    const message = getErrorMessageApi(error_)
    onFailure?.(message);
  }
}

function* getAnnouncementDetailWorker(
  action: PayloadAction<GetAnnouncementDetailPayload>,
): Generator<unknown, void, AnnouncementDetail> {
  const { announcementId, onSuccess, onFailure } = action.payload || {};
  try {
    const response: AnnouncementDetail = yield call(
      getAnnouncementById,
      announcementId,
    );
    onSuccess?.(response);
  } catch (error) {
    const message = getErrorMessageApi(error)
    onFailure?.(message);
  }
}

function* markReadWorker(
  action: PayloadAction<MarkReadPayload>,
): Generator<unknown, void, void> {
  const { notifyId, onSuccess, onFailure } = action.payload || {};
  try {
    yield call(markRead, notifyId);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_)
    onFailure?.(message);
  }
}

function* markReadAllWorker(
  action: PayloadAction<MarkReadPayload>,
): Generator<unknown, void, void> {
  const { onSuccess, onFailure } = action.payload || {};
  try {
    yield call(markReadAll);
    onSuccess?.();
  } catch (error_) {
    const message = getErrorMessageApi(error_)
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
  yield takeLatest(markReadRequest.type, markReadWorker);
  yield takeLatest(markReadAllRequest.type, markReadAllWorker);
}
