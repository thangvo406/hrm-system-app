import type {
  AnnouncementImage,
  GetAnnouncementImagesPayload,
  GetNotificationsPayload,
} from '@type/notifications';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NotificationsState = {
  banners: AnnouncementImage[];
};

const initialState: NotificationsState = {
  banners: [],
};

const notificationsSlice = createSlice({
  initialState,
  name: 'notifications',
  reducers: {
    getAnnouncementImagesRequest: {
      prepare: (payload: GetAnnouncementImagesPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getAnnouncementImagesSuccess: {
      prepare: (images: AnnouncementImage[]) => ({
        payload: images,
      }),
      reducer: (state, action: PayloadAction<AnnouncementImage[]>) => {
        state.banners = action.payload;
      },
    },
    getAnnouncementsRequest: {
      prepare: (payload: any = {}) => ({ payload }),
      reducer: () => {},
    },
    getNotificationsRequest: {
      prepare: (payload: GetNotificationsPayload = {}) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationsRequest,
} = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
