import type {
  AnnouncementImage,
  AnnouncementItem,
  GetAnnouncementsPayload,
  NotificationItem,
} from '@type/notifications';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getNotifications = async (): Promise<
  ListApiResponse<NotificationItem[]>
> => {
  const response = await httpRequest.get<ListApiResponse<NotificationItem[]>>(
    EndPoints.NOTIFICATIONS.list,
    { loading: false },
  );
  return response;
};

export const getAnnouncements = async (
  request: GetAnnouncementsPayload,
): Promise<ListApiResponse<AnnouncementItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<AnnouncementItem[]>>
  >(EndPoints.ANNOUNCEMENTS.list(params), { loading: false });
  return response.data;
};

export const getAnnouncementImages = async (): Promise<AnnouncementImage[]> => {
  const response = await httpRequest.get<
    SingleApiResponse<AnnouncementImage[]>
  >(EndPoints.ANNOUNCEMENTS.listImage, { loading: false });
  return response.data;
};
