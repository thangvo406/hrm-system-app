import type {
  AnnouncementDetail,
  AnnouncementImage,
  AnnouncementItem,
  GetAnnouncementsPayload,
  NotificationItem,
  IRequestGetNotifications
} from '@type/notifications';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getNotifications = async (request: IRequestGetNotifications): Promise<
  ListApiResponse<NotificationItem[]>
> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<SingleApiResponse<ListApiResponse<NotificationItem[]>>>(
    EndPoints.NOTIFICATIONS.list(params),
    { loading: false },
  );
  return response.data;
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

export const getAnnouncementById = async (
  announcementId: number | string,
): Promise<AnnouncementDetail> => {
  const response = await httpRequest.get<SingleApiResponse<AnnouncementDetail>>(
    EndPoints.ANNOUNCEMENTS.detail(announcementId),
    { loading: false },
  );
  return response?.data;
};
