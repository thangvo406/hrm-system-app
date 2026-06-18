import type { GetAnnouncementsPayload } from '../../../types/announcements';

import { createSlice } from '@reduxjs/toolkit';

const announcementsSlice = createSlice({
  initialState: {},
  name: 'announcements',
  reducers: {
    getAnnouncementsRequest: {
      prepare: (payload: GetAnnouncementsPayload = {}) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getAnnouncementsRequest } = announcementsSlice.actions;
export const announcementsReducer = announcementsSlice.reducer;
