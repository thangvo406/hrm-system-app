import type { AppCallback, IImage, ListApiResponse } from './common';

export type TAnnouncementItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  createdDate: string;
};

export type TGetAnnouncementsPayload = {
  type: string;
  page: number;
  size: number;
} & AppCallback<ListApiResponse<TAnnouncementItem[]>>;

export type TGetAnnouncementDetailPayload = {
  readonly announcementId: number | string;
} & AppCallback<TAnnouncementItem>;

export type IResponseAnnouncementImage = {
  items: TAnnouncementImage[];
};
export type TAnnouncementImage = {
  id: number;
  image: IImage;
};

export type TGetAnnouncementImagesPayload = AppCallback<TAnnouncementImage[]>;

export type TNotificationItem = {
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
};

export type IRequestGetNotifications = {
  page: number;
  size: number;
};

export type TGetNotificationsPayload = AppCallback<
  ListApiResponse<TNotificationItem[]>
> &
  IRequestGetNotifications;

export type TMarkReadPayload = {
  readonly notifyId: number;
} & AppCallback;

export type TNotificationDetail = {
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
};
export type TGetNotificationDetailPayload = {
  readonly notifyId: number | string;
} & AppCallback<TNotificationItem>;
