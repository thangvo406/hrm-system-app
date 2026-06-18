import type { AnnouncementItem } from '../../types/announcements';

import { httpRequest } from '@services/common/httpRequest';
import { z } from 'zod';
import { EndPoints } from '@constants';

type ApiResponse<T> = { data: T };

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
  const response = await httpRequest.get<ApiResponse<AnnouncementItem[]>>(
    EndPoints.ANNOUNCEMENTS.list,
    { loading: false },
  );
  return announcementsResponseSchema.parse(response).data;
};
