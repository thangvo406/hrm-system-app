import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  GetNotificationsPayload,
  NotificationItem,
} from '../../../types/notifications';

import { delay, takeLatest } from 'redux-saga/effects';

import { getNotificationsRequest } from './notificationsSlice';

const MOCK_DATA: NotificationItem[] = [
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
    yield delay(MOCK_DELAY_MS);
    action.payload.onSuccess?.(MOCK_DATA);
  } catch (error_) {
    const message =
      error_ instanceof Error ? error_.message : 'Unknown error';
    action.payload.onFailure?.(message);
  }
}

export function* notificationsSaga() {
  yield takeLatest(getNotificationsRequest.type, getNotificationsWorker);
}
