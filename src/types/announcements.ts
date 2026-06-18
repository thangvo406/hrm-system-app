export type AnnouncementKind = 'event' | 'notice';

export type AnnouncementItem = {
  readonly date: string;
  readonly icon: string;
  readonly id: string;
  readonly kind: AnnouncementKind;
  readonly title: string;
};

export type AnnouncementsCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (items: AnnouncementItem[]) => void;
};

export type GetAnnouncementsPayload = AnnouncementsCallback;
