import type { AppCallback, IImage, ListApiResponse } from './common';

export interface TAnnouncementItem {
  id: number;
  title: string;
  content: string;
  type: string;
  createdDate: string;
}

export interface IRequestGetAnnouncements
  extends AppCallback<ListApiResponse<TAnnouncementItem[]>> {
  type: string;
  page: number;
  size: number;
}

export interface IRequestGetAnnouncementDetail
  extends AppCallback<TAnnouncementItem> {
  readonly announcementId: number | string;
}

export interface IResponseAnnouncementImage {
  items: TAnnouncementImage[];
}
export interface TAnnouncementImage {
  id: number;
  image: IImage;
}

export interface TNotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  contentHtml: string;
  imageUrl: string;
  referenceId: number;
  read: boolean;
  readAt: string;
  createdDate: string;
}

export interface IRequestGetNotifications
  extends AppCallback<ListApiResponse<TNotificationItem[]>> {
  page: number;
  size: number;
}

export interface IRequestMarkRead extends AppCallback {
  readonly notifyId: number;
}

export interface TNotificationDetail {
  id: number;
  type: string;
  title: string;
  message: string;
  contentHtml: string;
  imageUrl: any;
  referenceType: string;
  referenceId: number;
  read: boolean;
  readAt: string;
  createdDate: string;
}
export interface IRequestGetNotificationDetail
  extends AppCallback<TNotificationItem> {
  readonly notifyId: number | string;
}
