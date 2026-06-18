import { ListApiResponse } from './common';

export type AnnouncementKind = 'event' | 'announcement';

export type AnnouncementItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  createdDate: string;
};

export type AnnouncementsCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (items: ListApiResponse<AnnouncementItem[]>) => void;
};

export type GetAnnouncementsPayload = {
  type: string;
  page: number;
  size: number;
} & AnnouncementsCallback;

export type AnnouncementImage = {
  id: number;
  fileUrl: string;
};

export type AnnouncementImagesCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (images: AnnouncementImage[]) => void;
};

export type GetAnnouncementImagesPayload = AnnouncementImagesCallback;

export type NotificationKind =
  | 'contribution_done'
  | 'delivery_done'
  | 'payment_done';

export type NotificationItem = {
  date: string;
  description: string;
  id: string;
  kind: NotificationKind;
  title: string;
};

export type NotificationsCallback = {
  onFailure?: (error: string) => void;
  onSuccess?: (items: NotificationItem[]) => void;
};

export type GetNotificationsPayload = NotificationsCallback;
