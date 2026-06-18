import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AnnouncementImage,
  AnnouncementItem,
  GetAnnouncementImagesPayload,
  GetAnnouncementsPayload,
  GetNotificationsPayload,
  NotificationItem,
} from '@type/notifications';

import { call, delay, put, takeLatest } from 'redux-saga/effects';

import type { ListApiResponse } from '@type/common';
import {
  getAnnouncementImages,
  getAnnouncements,
} from '@services/request/notifications';
import {
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationsRequest,
} from './notificationsSlice';

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    date: '2026.06.15  12:00AM',
    description: '50,000원 추가 출자가 완료되었어요.',
    id: '1',
    kind: 'contribution_done',
    title: '추가 출자 완료',
  },
  {
    date: '2026.06.15  12:00AM',
    description: '50,000원 추가 출자가 완료되었어요.',
    id: '2',
    kind: 'contribution_done',
    title: '추가 출자 완료',
  },
  {
    date: '2026.06.15  12:00AM',
    description: '[AA 카페]에서 {N}원 결제가 완료되었어요.',
    id: '3',
    kind: 'payment_done',
    title: '결제 완료',
  },
  {
    date: '2026.06.15  12:00AM',
    description: '[AA 카페]에서 {상품} 배달이 완료되었어요.',
    id: '4',
    kind: 'delivery_done',
    title: '결제 완료',
  },
];

const MOCK_DELAY_MS = 500;

function* getNotificationsWorker(
  action: PayloadAction<GetNotificationsPayload>,
) {
  try {
    // TODO: replace with real API call once endpoint contract is stable:
    // const response: ListApiResponse<NotificationItem[]> = yield call(getNotifications);
    // action.payload.onSuccess?.(response.data);
    yield delay(MOCK_DELAY_MS);
    action.payload.onSuccess?.(MOCK_NOTIFICATIONS);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    action.payload.onFailure?.(message);
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

export function* notificationsSaga() {
  yield takeLatest(getNotificationsRequest.type, getNotificationsWorker);
  yield takeLatest(getAnnouncementsRequest.type, getAnnouncementsWorker);
  yield takeLatest(
    getAnnouncementImagesRequest.type,
    getAnnouncementImagesWorker,
  );
}
