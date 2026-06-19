import type { AnnouncementItem } from '@type/notifications';

import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { NotificationsSelector } from '@services/selectors';
import {
  getAnnouncementImagesRequest,
  getAnnouncementsRequest,
} from '@services/slices/notifications/notificationsSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListApiResponse } from '@type';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import { useFocusEffect } from '@react-navigation/native';
import ImagePreview from '@dialogs/ImagePreview';

export type {
  AnnouncementImage,
  AnnouncementItem,
  AnnouncementKind,
} from '@type/notifications';

export type AnnouncementTabKey = 'all' | 'event' | 'announcement';

export const ANNOUNCEMENT_TABS: readonly AnnouncementTabKey[] = [
  'all',
  'announcement',
  'event',
];

export const useAnnouncements = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(NotificationsSelector.getBanners);
  const [data, setData] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [tabIndex, setTabIndex] = useState(0);
  const tab = ANNOUNCEMENT_TABS[tabIndex];
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const onRefreshBanners = useCallback(() => {
    dispatch(getAnnouncementImagesRequest({}));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      onRefreshBanners();
    }, [onRefreshBanners]),
  );

  const handleSuccess = (data: ListApiResponse<AnnouncementItem[]>) => {
    isLast.current = data.last;
    setLoading(false);
    setData(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      return results;
    });
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    onRefreshBanners();
  }, [onRefreshBanners]);

  useEffect(() => {
    const type = tab == 'all' ? '' : tab?.toUpperCase();
    dispatch(
      getAnnouncementsRequest({
        type,
        page: currentPage,
        size: 10,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, currentPage, tabIndex]);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onChangeTab = (newTabIndex: number) => {
    setLoading(true);
    setTabIndex(newTabIndex);
    setCurrentPage(0);
  };

  const onPressBannerItem = useCallback(item => {
    AppNavigator.showDialog({
      imageUrl: item.fileUrl,
      screen: ImagePreview,
      isFullScreen: true,
    });
  }, []);

  const onPressNoticeItem = useCallback((item: AnnouncementItem) => {
    AppNavigator.navigate(Paths.AnnouncementDetail, { id: item?.id });
  }, []);

  const onOpenMenu = useCallback(() => {
    AppNavigator.showMenu();
  }, []);

  return {
    banners,
    data,
    error,
    loading,
    onChangeTab,
    onLoadMore,
    onOpenMenu,
    onPressBannerItem,
    onPressNoticeItem,
    onRefreshBanners,
    tab,
    tabIndex,
  };
};
