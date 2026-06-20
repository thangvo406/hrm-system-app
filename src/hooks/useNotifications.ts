import type { NotificationItem } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import { getNotificationsRequest } from '@services/slices/notifications/notificationsSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListApiResponse } from '@type';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

export type {
  NotificationItem,
  NotificationKind,
} from '@type/notifications';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  // const handleSuccess = (items: NotificationItem[]) => {
  //   setData(items);
  //   setLoading(false);
  // };
  const handleSuccess = (data: ListApiResponse<NotificationItem[]>) => {
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

  const onPressItem = useCallback((item: NotificationItem) => {
    AppNavigator.navigate(Paths.AnnouncementDetail, { notification: item, hideBtnNotify: true });
  }, []);
  
  

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
    onPressItem,
    onLoadMore,
    loading,
  };
};
