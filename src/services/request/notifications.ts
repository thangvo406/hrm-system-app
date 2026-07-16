import type {
  TAnnouncementItem,
  IRequestGetAnnouncementDetail,
  IRequestGetAnnouncements,
  IRequestGetNotificationDetail,
  IRequestMarkRead,
  TNotificationItem,
  IRequestGetNotifications,
  IResponseAnnouncementImage,
  TNotificationDetail,
} from '@type/notifications';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getNotifications = async (
  request: IRequestGetNotifications,
): Promise<ListApiResponse<TNotificationItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<TNotificationItem[]>>
  >(EndPoints.NOTIFICATIONS.list(params), { loading: false });
  return response.data;
};

export const getAnnouncements = async (
  request: IRequestGetAnnouncements,
): Promise<ListApiResponse<TAnnouncementItem[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<TAnnouncementItem[]>>
  >(EndPoints.ANNOUNCEMENTS.list(params), { loading: false });
  return response.data;
};

export const getAnnouncementImages =
  async (): Promise<IResponseAnnouncementImage> => {
    const response = await httpRequest.get<
      SingleApiResponse<IResponseAnnouncementImage>
    >(EndPoints.ANNOUNCEMENTS.listImage, { loading: false });
    return response.data;
  };

export const getAnnouncementById = async (
  request: IRequestGetAnnouncementDetail,
): Promise<TAnnouncementItem> => {
  const response = await httpRequest.get<SingleApiResponse<TAnnouncementItem>>(
    EndPoints.ANNOUNCEMENTS.detail(request.announcementId),
    { loading: false },
  );
  return response?.data;
};

export const markRead = async (request: IRequestMarkRead): Promise<void> => {
  await httpRequest.patch(
    EndPoints.NOTIFICATIONS.markRead(request.notifyId),
    undefined,
    {
      loading: false,
    },
  );
};

export const markReadAll = async (): Promise<void> => {
  await httpRequest.patch(EndPoints.NOTIFICATIONS.markReadAll);
};

export const getNotificationDetail = async (
  request: IRequestGetNotificationDetail,
): Promise<TNotificationDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<TNotificationDetail>
  >(EndPoints.NOTIFICATIONS.detail(request.notifyId), { loading: false });
  return response.data;
};
