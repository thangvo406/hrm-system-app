import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AnnouncementDetail,
  AnnouncementImage,
  AnnouncementItem,
  GetAnnouncementDetailPayload,
  GetAnnouncementImagesPayload,
  GetAnnouncementsPayload,
  GetNotificationsPayload,
  NotificationItem,
} from '@type/notifications';

import { call, put, takeLatest } from 'redux-saga/effects';

import type { ListApiResponse } from '@type/common';
import {
  getAnnouncementById,
  getAnnouncementImages,
  getAnnouncements,
  getNotifications,
} from '@services/request/notifications';
import {
  getAnnouncementDetailRequest,
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationsRequest,
} from './notificationsSlice';

function* getNotificationsWorker(
  action: PayloadAction<GetNotificationsPayload>,
) {
  const { onSuccess, onFailure, ...request} = action.payload || {}
  try {
    // TODO: replace with real API call once endpoint contract is stable:
    const response: ListApiResponse<NotificationItem[]> = yield call(getNotifications, request);
    onSuccess?.(response);
    // yield delay(MOCK_DELAY_MS);
    // action.payload.onSuccess?.(MOCK_NOTIFICATIONS);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
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
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
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
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
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
    const message = error instanceof Error ? error.message : 'Unknown error';
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
}
