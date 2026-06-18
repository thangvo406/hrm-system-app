import type { NotificationItem } from '@type/notifications';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { ListApiResponse } from '@type/common';

export const notificationKindSchema = z.enum([
  'contribution_done',
  'delivery_done',
  'payment_done',
]);

export const notificationItemSchema = z.object({
  date: z.string(),
  description: z.string(),
  id: z.union([z.string(), z.number()]).transform(value => String(value)),
  kind: notificationKindSchema,
  title: z.string(),
});

export const notificationsResponseSchema = z.object({
  data: z.array(notificationItemSchema),
});

export const getNotifications = async (): Promise<
  ListApiResponse<NotificationItem[]>
> => {
  const response = await httpRequest.get<ListApiResponse<NotificationItem[]>>(
    EndPoints.NOTIFICATIONS.list,
    { loading: false },
  );
  // return notificationsResponseSchema.parse(response).data;
  return response;
};
