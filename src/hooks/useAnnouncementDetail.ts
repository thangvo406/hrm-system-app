import type { AnnouncementDetail } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import { getAnnouncementDetailRequest } from '@services/slices/notifications/notificationsSlice';
import { useEffect, useMemo, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { ScaleSize } from '@kits/core';

export type { AnnouncementDetail } from '@type/notifications';

export const useAnnouncementDetail = (props: any) => {
  const {
    id: announcementId,
    notification,
    hideBtnNotify,
  } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<AnnouncementDetail | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const contentNotify = useMemo(() => {
    if (!data) {
      return '';
    }
    return `
            <div style="font-size: ${ScaleSize(12, 14)}px;">
               ${data?.content || ''}
            </div>
         `;
  }, [data]);

  const handleSuccess = (detail: AnnouncementDetail) => {
    setData(detail);
    setLoading(false);
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    if (announcementId === undefined || announcementId === '') {
      if (notification) {
        setData({
          id: notification.id,
          title: notification.title,
          content: notification.contentHtml,
          type: notification.type,
          createdDate: notification.createdDate,
        } as AnnouncementDetail);
      } else {
        setError('Missing announcement id');
      }
      setLoading(false);
      return;
    }
    // setLoading(true);
    // setError(undefined);
    dispatch(
      getAnnouncementDetailRequest({
        announcementId,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, announcementId]);

  return {
    data,
    hideBtnNotify,
    contentNotify,
    error,
    loading,
  };
};
