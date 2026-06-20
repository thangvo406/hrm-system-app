import { ListApiResponse } from './common';

export type AnnouncementKind = 'event' | 'announcement';

export type AnnouncementItem = {
  id: number;
  title: string;
  content: string;
  type: string;
  createdDate: string;
};

export type AnnouncementDetail = AnnouncementItem;

export type AnnouncementsCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (items: ListApiResponse<AnnouncementItem[]>) => void;
};

export type GetAnnouncementsPayload = {
  type: string;
  page: number;
  size: number;
} & AnnouncementsCallback;

export type AnnouncementDetailCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (detail: AnnouncementDetail) => void;
};

export type GetAnnouncementDetailPayload = {
  readonly announcementId: number | string;
} & AnnouncementDetailCallback;

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
  id: number
  type: string
  title: string
  message: string
  contentHtml: string
  imageUrl: string
  referenceId: number
  read: boolean
  readAt: string
  createdDate: string
};

export type NotificationsCallback = {
  onFailure?: (error: string) => void;
  onSuccess?: (items: ListApiResponse<NotificationItem[]>) => void;
};

export interface IRequestGetNotifications {
  page: number;
  size: number;
}
export type GetNotificationsPayload = IRequestGetNotifications & NotificationsCallback;
