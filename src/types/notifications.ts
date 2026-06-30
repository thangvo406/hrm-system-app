import type { AppCallback, IImage, ListApiResponse } from './common';

export type AnnouncementKind = 'event' | 'announcement';

export type AnnouncementItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  createdDate: string;
};

export type AnnouncementDetail = AnnouncementItem;

export type GetAnnouncementsPayload = {
  type: string;
  page: number;
  size: number;
} & AppCallback<ListApiResponse<AnnouncementItem[]>>;

export type GetAnnouncementDetailPayload = {
  readonly announcementId: number | string;
} & AppCallback<AnnouncementDetail>;

export type AnnouncementImage = {
  id: number;
  image: IImage;
};

export type GetAnnouncementImagesPayload = AppCallback<AnnouncementImage[]>;

export type NotificationKind =
  | 'contribution_done'
  | 'delivery_done'
  | 'payment_done';

export type NotificationItem = {
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

export type GetNotificationsPayload = AppCallback<
  ListApiResponse<NotificationItem[]>
> &
  IRequestGetNotifications;

export type MarkReadPayload = {
  readonly notifyId: number;
} & AppCallback;
