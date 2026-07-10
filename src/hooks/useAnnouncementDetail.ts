import type { TAnnouncementItem } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  getAnnouncementDetailRequest,
  getNotificationDetailRequest,
} from '@services/slices/notifications/notificationsSlice';
import { useEffect, useMemo, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { ScaleSize } from '@kits/core';

export const useAnnouncementDetail = (props: any) => {
  const {
    id: announcementId,
    notification,
    hideBtnNotify,
  } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<TAnnouncementItem | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const contentNotify = useMemo(() => {
    if (!data) {
      return '';
    }
    if (notification) {
      return data?.content;
    }
    return `
            <div style="font-size: ${ScaleSize(12, 14)}px;">
               ${data?.content || ''}
            </div>
         `;
  }, [data]);

  const handleSuccess = (detail: TAnnouncementItem) => {
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
        dispatch(
          getNotificationDetailRequest({
            notifyId: notification?.id,
            onSuccess: data => {
              setData({
                id: notification.id,
                title: data.title,
                content: data.contentHtml,
                type: data.type,
                createdDate: data.createdDate,
              } as TAnnouncementItem);
              setLoading(false);
            },
            onFailure: error => {
              setError(error);
              setLoading(false);
            },
          }),
        );
      } else {
        setError('Missing announcement id');
      }

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
