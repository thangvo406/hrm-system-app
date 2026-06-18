import type { NotificationItem } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import { getNotificationsRequest } from '@services/slices/notifications/notificationsSlice';
import { useEffect, useState } from 'react';

export type {
  NotificationItem,
  NotificationKind,
} from '@type/notifications';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSuccess = (items: NotificationItem[]) => {
    setData(items);
    setLoading(false);
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getNotificationsRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch]);

  const refresh = () => {
    setLoading(true);
    setError(undefined);
    dispatch(
      getNotificationsRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  };

  return {
    data,
    error,
    loading,
    refresh,
  };
};
