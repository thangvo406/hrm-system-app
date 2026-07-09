import type { TNotificationItem } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  getNotificationsRequest,
  markReadAllRequest,
  markReadRequest,
} from '@services/slices/notifications/notificationsSlice';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListApiResponse } from '@type';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState<TNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  // const handleSuccess = (items: NotificationItem[]) => {
  //   setData(items);
  //   setLoading(false);
  // };
  const handleSuccess = (data: ListApiResponse<TNotificationItem[]>) => {
    isLast.current = data.last;
    setData(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      return results;
    });
    setLoading(false);
  };

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onRefreshReadData = (markAll = false, item?: TNotificationItem) => {
    const newData = data?.map(it => ({
      ...it,
      read: markAll ? true : it.id == item?.id ? true : it.read,
    }));
    setData(newData);
  };

  const disabledBtnReadAll = useMemo(() => {
    return !(data?.length > 0);
  }, [data]);

  const onMarkRead = (item: TNotificationItem) => {
    dispatch(
      markReadRequest({
        notifyId: item.id,
        onSuccess: () => {
          onRefreshReadData(false, item);
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({
            message: message || t('notifications.mark_read_failed'),
            type: 'failed',
          });
        },
      }),
    );
  };

  const onMarkReadAll = () => {
    dispatch(
      markReadAllRequest({
        onSuccess: () => {
          AppNavigator.showSnackBar({
            message: t('notifications.mark_read_success'),
            type: 'success',
          });
          onRefreshReadData(true);
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({
            message: message || t('notifications.mark_read_failed'),
            type: 'failed',
          });
        },
      }),
    );
  };

  const onPressItem = useCallback(
    (item: TNotificationItem) => {
      if (!item.read) {
        onMarkRead(item);
      }

      AppNavigator.navigate(Paths.AnnouncementDetail, {
        notification: item,
        hideBtnNotify: true,
      });
    },
    [data],
  );

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getNotificationsRequest({
        page: currentPage,
        size: 10,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch]);
  return {
    data,
    error,
    disabledBtnReadAll,
    onPressItem,
    onLoadMore,
    onMarkRead,
    onMarkReadAll,
    loading,
  };
};
