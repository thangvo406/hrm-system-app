import type {
  TAnnouncementImage,
  TGetAnnouncementImagesPayload,
  TGetNotificationDetailPayload,
  TGetNotificationsPayload,
  TGetAnnouncementDetailPayload,
  TMarkReadPayload,
} from '@type/notifications';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NotificationsState = {
  banners: TAnnouncementImage[];
};

const initialState: NotificationsState = {
  banners: [],
};

const notificationsSlice = createSlice({
  initialState,
  name: 'notifications',
  reducers: {
    getAnnouncementDetailRequest: {
      prepare: (payload: TGetAnnouncementDetailPayload) => ({ payload }),
      reducer: () => {},
    },
    getAnnouncementImagesRequest: {
      prepare: (payload: TGetAnnouncementImagesPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    getAnnouncementImagesSuccess: {
      prepare: (images: TAnnouncementImage[]) => ({
        payload: images,
      }),
      reducer: (state, action: PayloadAction<TAnnouncementImage[]>) => {
        state.banners = action.payload;
      },
    },
    getAnnouncementsRequest: {
      prepare: (payload: any = {}) => ({ payload }),
      reducer: () => {},
    },
    getNotificationDetailRequest: {
      prepare: (payload: TGetNotificationDetailPayload) => ({ payload }),
      reducer: () => {},
    },
    getNotificationsRequest: {
      prepare: (payload: TGetNotificationsPayload) => ({ payload }),
      reducer: () => {},
    },
    markReadAllRequest: {
      prepare: (payload: any) => ({ payload }),
      reducer: () => {},
    },
    markReadRequest: {
      prepare: (payload: TMarkReadPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getAnnouncementDetailRequest,
  getAnnouncementImagesRequest,
  getAnnouncementImagesSuccess,
  getAnnouncementsRequest,
  getNotificationDetailRequest,
  getNotificationsRequest,
  markReadAllRequest,
  markReadRequest,
} = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
