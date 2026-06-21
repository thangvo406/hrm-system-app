import type {
  AnnouncementImage,
  GetAnnouncementImagesPayload,
  GetNotificationsPayload,
  GetAnnouncementDetailPayload,
  MarkReadPayload,
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
    getAnnouncementDetailRequest: {
      prepare: (payload: GetAnnouncementDetailPayload) => ({ payload }),
      reducer: () => {},
    },
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
    markReadAllRequest: {
      prepare: (payload: any) => ({ payload }),
      reducer: () => {},
    },
    markReadRequest: {
      prepare: (payload: MarkReadPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getAnnouncementDetailRequest,
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationsRequest,
  markReadAllRequest,
  markReadRequest,
} = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
