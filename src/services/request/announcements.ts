import type { AnnouncementItem } from '@type/announcements';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';
import { SingleApiResponse } from '@type/common';

export const announcementKindSchema = z.enum(['event', 'notice']);

export const announcementItemSchema = z.object({
  date: z.string(),
  icon: z.string(),
  id: z.union([z.string(), z.number()]).transform(String),
  kind: announcementKindSchema,
  title: z.string(),
});

export const announcementsResponseSchema = z.object({
  data: z.array(announcementItemSchema),
});

export const getAnnouncements = async (): Promise<AnnouncementItem[]> => {
  const response = await httpRequest.get<SingleApiResponse<AnnouncementItem[]>>(
    EndPoints.ANNOUNCEMENTS.list,
    { loading: false },
  );
  return announcementsResponseSchema.parse(response).data;
};
