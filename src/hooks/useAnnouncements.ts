import type { AnnouncementItem } from '@type/announcements';

import { useAppDispatch } from '@services/common/storeHooks';
import { getAnnouncementsRequest } from '@services/slices/announcements/announcementsSlice';
import { useEffect, useState } from 'react';

export type {
  AnnouncementItem,
  AnnouncementKind,
} from '@type/announcements';

export const useAnnouncements = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSuccess = (items: AnnouncementItem[]) => {
    setData(items);
    setLoading(false);
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getAnnouncementsRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch]);

  const refresh = () => {
    setLoading(true);
    setError(undefined);
    dispatch(
      getAnnouncementsRequest({
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
