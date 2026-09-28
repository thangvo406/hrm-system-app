import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestGetNotificationCounts,
  IRequestGetNotifications,
  TNotificationCounts,
  TNotificationItem,
} from '@type/notifications';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import {
  getNotificationCounts,
  getNotifications,
} from '@services/request/notifications';
import {
  getNotificationCountsRequest,
  getNotificationsRequest,
} from './notificationsSlice';
import { getErrorMessageApi } from '@utils/common';

function* getNotificationsWorker(
  action: PayloadAction<IRequestGetNotifications>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<TNotificationItem[]> = yield call(
      getNotifications,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* getNotificationCountsWorker(
  action: PayloadAction<IRequestGetNotificationCounts>,
) {
  const { onFailure, onSuccess } = action.payload;
  try {
    const response: TNotificationCounts = yield call(getNotificationCounts);
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

export function* notificationsSaga() {
  yield takeLatest(getNotificationsRequest.type, getNotificationsWorker);
  yield takeLatest(
    getNotificationCountsRequest.type,
    getNotificationCountsWorker,
  );
}
