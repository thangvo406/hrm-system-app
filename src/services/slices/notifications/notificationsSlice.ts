import type { GetNotificationsPayload } from '@type/notifications';

import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  initialState: {},
  name: 'notifications',
  reducers: {
    getNotificationsRequest: {
      prepare: (payload: GetNotificationsPayload = {}) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getNotificationsRequest } = notificationsSlice.actions;
