import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import type {
  TRequestCounts,
  TRequestFilters,
  TRequestItem,
  TRequestSection,
  TRequestTab,
  TRequestType,
} from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import dayjs from 'dayjs';
import { Paths } from '@navigation/paths';
import FilterSheet from '@dialogs/FilterSheet';
import {
  countSelectedFilters,
  DEFAULT_REQUEST_FILTERS,
  toRequestDateRange,
} from '@utils/requests';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getRequestCountsRequest,
  getRequestsRequest,
} from '@services/slices/requests/requestsSlice';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const MONTH_ID_FORMAT = 'YYYY-MM';
const MONTH_OFFSET = 1;

/** Dưới mốc cuộn này thì hàng tab luôn hiện, khỏi phải vuốt ngược lên. */
const TABS_ALWAYS_VISIBLE_OFFSET = 24;
/** Quãng vuốt xuôi phải cộng dồn được trước khi thu hàng tab lại. */
const TABS_HIDE_DISTANCE = 24;
/** Vuốt ngược lên thì cho hiện sớm hơn, vì người dùng đang muốn đổi bộ lọc. */
const TABS_SHOW_DISTANCE = 12;
const NO_DRAG = 0;
const NO_HEIGHT = 0;
const TABS_DURATION = 220;
const FULLY_SHOWN = 1;
const FULLY_HIDDEN = 0;

const CONTENT_FADE_OUT_DURATION = 220;
const CONTENT_FADE_IN_DURATION = 200;

const PAGE_SIZE = 20;
const FIRST_PAGE = 0;
const PAGE_STEP = 1;

const ALL_FILTER = 'all';
const NO_FILTER = 0;

const EMPTY_COUNTS: TRequestCounts = { all: 0, pending: 0, processed: 0 };

/** Gom các đơn đã lọc thành từng nhóm tháng, mới nhất xếp trước. */
const groupByMonth = (items: readonly TRequestItem[]): TRequestSection[] => {
  const buckets = new Map<string, TRequestItem[]>();

  for (const item of items) {
    const id = dayjs(item.startDate).format(MONTH_ID_FORMAT);
    const bucket = buckets.get(id);

    if (bucket) {
      bucket.push(item);
    } else {
      buckets.set(id, [item]);
    }
  }

  return [...buckets].map(([id, data]) => {
    const month = dayjs(id);
    return {
      data,
      id,
      month: month.month() + MONTH_OFFSET,
      year: month.year(),
    };
  });
};

export function useRequests() {
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState<TRequestFilters>(
    DEFAULT_REQUEST_FILTERS,
  );

  const [requests, setRequests] = useState<readonly TRequestItem[]>([]);
  const [counts, setCounts] = useState<TRequestCounts>(EMPTY_COUNTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const pageRef = useRef(FIRST_PAGE);
  const isLastRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  const contentProgress = useSharedValue(FULLY_SHOWN);
  /** Mốc bắt đầu nhịp mờ đi, để biết còn nợ bao nhiêu mili giây nữa. */
  const fadeOutStartedAtRef = useRef(0);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  const tab: TRequestTab = useMemo(() => {
    if (filters.status === ALL_FILTER) {
      return 'all';
    }
    return filters.status === 'pending' ? 'pending' : 'processed';
  }, [filters.status]);

  const scope = useMemo(
    () => ({
      ...toRequestDateRange(filters),
      type: filters.type === ALL_FILTER ? '' : filters.type,
    }),
    [filters],
  );

  const loadRequests = useCallback(
    (page: number) => {
      const isFirstPage = page === FIRST_PAGE;
      isLoadingRef.current = true;

      if (isFirstPage) {
        pageRef.current = FIRST_PAGE;
        isLastRef.current = false;
        setIsLoading(true);
        fadeOutStartedAtRef.current = Date.now();
        contentProgress.set(
          withTiming(FULLY_HIDDEN, { duration: CONTENT_FADE_OUT_DURATION }),
        );
      } else {
        setIsLoadingMore(true);
      }

      const stopLoading = () => {
        isLoadingRef.current = false;
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      };

      const showContent = () => {
        if (!isFirstPage || !isMountedRef.current) {
          return;
        }

        const elapsed = Date.now() - fadeOutStartedAtRef.current;
        const remaining = Math.max(CONTENT_FADE_OUT_DURATION - elapsed, 0);

        contentProgress.set(
          withDelay(
            remaining,
            withTiming(FULLY_SHOWN, { duration: CONTENT_FADE_IN_DURATION }),
          ),
        );
      };

      dispatch(
        getRequestsRequest({
          ...scope,
          page,
          size: PAGE_SIZE,
          status: filters.status === ALL_FILTER ? '' : filters.status,
          onFailure: () => {
            stopLoading();
            // Hiện lại kể cả khi lỗi, không thì màn hình kẹt ở trạng thái mờ.
            showContent();
          },
          onSuccess: response => {
            stopLoading();
            if (!isMountedRef.current) {
              return;
            }
            pageRef.current = response.page;
            isLastRef.current = response.last;
            setRequests(previous =>
              isFirstPage
                ? response.content
                : [...previous, ...response.content],
            );
            showContent();
          },
        }),
      );
    },
    [contentProgress, dispatch, filters.status, scope],
  );

  const loadCounts = useCallback(() => {
    dispatch(
      getRequestCountsRequest({
        ...scope,
        onSuccess: next => {
          if (isMountedRef.current) {
            setCounts(next);
          }
        },
      }),
    );
  }, [dispatch, scope]);

  useFocusEffect(
    useCallback(() => {
      loadRequests(FIRST_PAGE);
      loadCounts();
    }, [loadCounts, loadRequests]),
  );

  const onEndReached = useCallback(() => {
    if (isLoadingRef.current || isLastRef.current || requests.length === 0) {
      return;
    }
    loadRequests(pageRef.current + PAGE_STEP);
  }, [loadRequests, requests.length]);

  const sections = useMemo(() => groupByMonth(requests), [requests]);

  // Hàng tab ghi vào `status`, nên `countSelectedFilters` đã bao luôn cả việc
  // người dùng đang đứng ở tab hẹp chứ không riêng bộ lọc trong bottom sheet.
  const isFiltered = useMemo(
    () => countSelectedFilters(filters) > NO_FILTER,
    [filters],
  );

  const onChangeTab = useCallback((next: TRequestTab) => {
    setFilters(current => ({ ...current, status: next }));
  }, []);

  const onToggleType = useCallback((next: TRequestType) => {
    setFilters(current => ({
      ...current,
      type: current.type === next ? 'all' : next,
    }));
  }, []);

  const onOpenDetail = useCallback((item: TRequestItem) => {
    AppNavigator.navigate(Paths.RequestDetail, {
      id: item.id,
      type: item.type,
    });
  }, []);

  const onCreateRequest = useCallback(() => {
    AppNavigator.navigate(Paths.CreateRequest);
  }, []);

  const onOpenFilter = useCallback(() => {
    AppNavigator.showDialog({
      screen: FilterSheet,
      popupType: 'bottomSheet',
      onApply: setFilters,
      value: filters,
    });
  }, [filters]);

  // ─── Thu gọn hàng tab theo hướng cuộn ───────────────────────────────────────

  /** Chiều cao thật của hàng tab, `undefined` khi chưa đo xong. */
  const [tabsHeight, setTabsHeight] = useState<number | undefined>();
  /** 1 là hiện đủ, 0 là đã thu hết. Chỉ giá trị này chạy trên luồng UI. */
  const tabsProgress = useSharedValue(FULLY_SHOWN);
  const isTabsHidden = useRef(false);
  const lastOffsetY = useRef(0);
  /** Quãng vuốt cộng dồn theo một hướng; dương là đang đi xuống. */
  const dragDistance = useRef(NO_DRAG);

  const onTabsLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTabsHeight(current => (current === height ? current : height));
  }, []);

  useEffect(() => {
    dragDistance.current = NO_DRAG;
    isTabsHidden.current = false;
    lastOffsetY.current = 0;
    tabsProgress.set(withTiming(FULLY_SHOWN, { duration: TABS_DURATION }));
  }, [filters, tabsProgress]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const delta = offsetY - lastOffsetY.current;
      lastOffsetY.current = offsetY;

      if (offsetY <= TABS_ALWAYS_VISIBLE_OFFSET) {
        dragDistance.current = NO_DRAG;
        if (isTabsHidden.current) {
          isTabsHidden.current = false;
          tabsProgress.set(
            withTiming(FULLY_SHOWN, { duration: TABS_DURATION }),
          );
        }
        return;
      }

      const accumulated = dragDistance.current;
      const dragged =
        delta * accumulated < NO_DRAG ? delta : accumulated + delta;
      dragDistance.current = dragged;

      if (dragged >= TABS_HIDE_DISTANCE && !isTabsHidden.current) {
        dragDistance.current = NO_DRAG;
        isTabsHidden.current = true;
        tabsProgress.set(withTiming(FULLY_HIDDEN, { duration: TABS_DURATION }));
      } else if (dragged <= -TABS_SHOW_DISTANCE && isTabsHidden.current) {
        dragDistance.current = NO_DRAG;
        isTabsHidden.current = false;
        tabsProgress.set(withTiming(FULLY_SHOWN, { duration: TABS_DURATION }));
      }
    },
    [tabsProgress],
  );

  const tabsStyle = useAnimatedStyle(
    () => ({
      opacity: tabsProgress.get(),
      transform: [
        {
          translateY:
            -(tabsHeight ?? NO_HEIGHT) * (FULLY_SHOWN - tabsProgress.get()),
        },
      ],
    }),
    [tabsHeight],
  );

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentProgress.get(),
  }));

  /** Chừa đúng chỗ hàng tab đang đè lên, để dòng đầu không bị nó che. */
  const listContentStyle = useMemo(
    () => ({ paddingTop: tabsHeight ?? NO_HEIGHT }),
    [tabsHeight],
  );

  return {
    contentStyle,
    counts,
    isFiltered,
    isLoading,
    isLoadingMore,
    listContentStyle,
    onChangeTab,
    onCreateRequest,
    onEndReached,
    onOpenDetail,
    onOpenFilter,
    onScroll,
    onTabsLayout,
    onToggleType,
    sections,
    tab,
    tabsStyle,
    typeFilter: filters.type,
  };
}
