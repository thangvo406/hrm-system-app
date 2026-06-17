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
