import type {
  TNotificationCounts,
  TNotificationFilter,
  TNotificationItem,
} from '@type/notifications';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getNotificationCountsRequest,
  getNotificationsRequest,
} from '@services/slices/notifications/notificationsSlice';

const PAGE_SIZE = 20;
const FIRST_PAGE = 0;
const PAGE_STEP = 1;

const ALL_FILTER = 'all';

const EMPTY_COUNTS: TNotificationCounts = {
  all: 0,
  needs_action: 0,
  unread: 0,
};

/**
 * Toàn bộ logic màn Thông báo: nhóm đang lọc, số đếm cho từng nhóm, phân trang
 * và việc đánh dấu đã đọc.
 */
export function useNotifications() {
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<TNotificationFilter>(ALL_FILTER);
  const [loaded, setLoaded] = useState<readonly TNotificationItem[]>([]);
  const [counts, setCounts] = useState<TNotificationCounts>(EMPTY_COUNTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Đánh dấu đã đọc ngay tại máy thay vì sửa mảng server trả về: dữ liệu tải
  // xuống phải giữ nguyên để trang sau nối vào không lệch với trang trước.
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  const pageRef = useRef(FIRST_PAGE);
  const isLastRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const loadNotifications = useCallback(
    (page: number) => {
      const isFirstPage = page === FIRST_PAGE;
      isLoadingRef.current = true;

      if (isFirstPage) {
        pageRef.current = FIRST_PAGE;
        isLastRef.current = false;
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const stopLoading = () => {
        // Hạ cờ ref kể cả khi đã unmount, còn state thì chỉ đụng khi còn sống.
        isLoadingRef.current = false;
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      };

      dispatch(
        getNotificationsRequest({
          filter: filter === ALL_FILTER ? '' : filter,
          page,
          size: PAGE_SIZE,
          onFailure: stopLoading,
          onSuccess: response => {
            stopLoading();
            if (!isMountedRef.current) {
              return;
            }
            pageRef.current = response.page;
            isLastRef.current = response.last;
            setLoaded(previous =>
              isFirstPage
                ? response.content
                : [...previous, ...response.content],
            );
          },
        }),
      );
    },
    [dispatch, filter],
  );

  // Con số trên hàng lọc phải trả lời "bấm nhóm này thì còn bao nhiêu", nên nó
  // không phụ thuộc `filter` và cũng không suy được từ trang đang xem — trang
  // đó đã bị server lọc theo đúng nhóm đang chọn.
  const loadCounts = useCallback(() => {
    dispatch(
      getNotificationCountsRequest({
        onSuccess: next => {
          if (isMountedRef.current) {
            setCounts(next);
          }
        },
      }),
    );
  }, [dispatch]);

  // Tải lại khi mở màn và mỗi lần đổi nhóm lọc — `loadNotifications` đổi theo
  // `filter`.
  useFocusEffect(
    useCallback(() => {
      loadNotifications(FIRST_PAGE);
      loadCounts();
    }, [loadCounts, loadNotifications]),
  );

  const onEndReached = useCallback(() => {
    if (isLoadingRef.current || isLastRef.current || loaded.length === 0) {
      return;
    }
    loadNotifications(pageRef.current + PAGE_STEP);
  }, [loadNotifications, loaded.length]);

  const items = useMemo(
    () =>
      loaded.map(item =>
        readIds.has(item.id) ? { ...item, isRead: true } : item,
      ),
    [loaded, readIds],
  );

  const onChangeFilter = useCallback((next: TNotificationFilter) => {
    setFilter(next);
  }, []);

  // Đọc xong là số của nhóm "Chưa đọc" và "Cần xác nhận" đổi theo, mà hai con
  // số đó nay do server đếm — nên phải hỏi lại chứ không tự trừ ở máy.
  const onAcknowledge = useCallback(
    (id: string) => {
      setReadIds(current => new Set([...current, id]));
      loadCounts();
    },
    [loadCounts],
  );

  const onReadAll = useCallback(() => {
    setReadIds(
      current => new Set([...current, ...loaded.map(item => item.id)]),
    );
    loadCounts();
  }, [loadCounts, loaded]);

  // Chưa có màn đích cho từng loại thông báo: chỗ nối sẵn cho sau.
  const onOpen = useCallback(() => {}, []);

  return {
    counts,
    filter,
    isLoading,
    isLoadingMore,
    items,
    onAcknowledge,
    onChangeFilter,
    onEndReached,
    onOpen,
    onReadAll,
  };
}
