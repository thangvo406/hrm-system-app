import type {
  IRequestGetNotificationCounts,
  IRequestGetNotifications,
} from '@type/notifications';

import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  initialState: {},
  name: 'notifications',
  reducers: {
    getNotificationCountsRequest: {
      prepare: (payload: IRequestGetNotificationCounts) => ({ payload }),
      reducer: () => {},
    },
    getNotificationsRequest: {
      prepare: (payload: IRequestGetNotifications) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getNotificationCountsRequest, getNotificationsRequest } =
  notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
