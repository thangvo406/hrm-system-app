import type { AnnouncementDetail } from '@type/notifications';

import { useAppDispatch } from '@services/common/storeHooks';
import { getAnnouncementDetailRequest } from '@services/slices/notifications/notificationsSlice';
import { useEffect, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';

export type { AnnouncementDetail } from '@type/notifications';

export const useAnnouncementDetail = (props: any) => {
  const { id: announcementId } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<AnnouncementDetail | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

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
      setLoading(false);
      setError('Missing announcement id');
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
    error,
    loading,
  };
};
