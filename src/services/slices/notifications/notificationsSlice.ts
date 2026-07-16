import type { AppCallback } from '@type/common';
import type {
  TAnnouncementImage,
  IRequestGetAnnouncementDetail,
  IRequestGetAnnouncements,
  IRequestGetNotificationDetail,
  IRequestGetNotifications,
  IRequestMarkRead,
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
      prepare: (payload: IRequestGetAnnouncementDetail) => ({ payload }),
      reducer: () => {},
    },
    getAnnouncementImagesRequest: {
      prepare: (payload: AppCallback<TAnnouncementImage[]> = {}) => ({
        payload,
      }),
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
      prepare: (payload: IRequestGetAnnouncements) => ({ payload }),
      reducer: () => {},
    },
    getNotificationDetailRequest: {
      prepare: (payload: IRequestGetNotificationDetail) => ({ payload }),
      reducer: () => {},
    },
    getNotificationsRequest: {
      prepare: (payload: IRequestGetNotifications) => ({ payload }),
      reducer: () => {},
    },
    markReadAllRequest: {
      prepare: (payload: AppCallback) => ({ payload }),
      reducer: () => {},
    },
    markReadRequest: {
      prepare: (payload: IRequestMarkRead) => ({ payload }),
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
