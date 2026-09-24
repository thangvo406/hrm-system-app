import type { TSelectionItem } from '@type/dialog';
import type {
  TAttendanceHistoryEntry,
  TAttendanceHistoryFilter,
} from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import dayjs from 'dayjs';
import Selection from '@dialogs/Selection';
import { getCurrentTime } from '@utils/date';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AttendanceUtils } from '@utils';
import { useAppDispatch } from '@services/common/storeHooks';
import { getAttendanceHistoriesRequest } from '@services/slices/attendance/attendanceSlice';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_ID_FORMAT = 'YYYY-MM';
const MONTH_OFFSET = 1;
const MONTH_STEP = 1;
/** Số tháng liệt kê trong bộ chọn tháng, tính ngược từ tháng hiện tại. */
const MONTH_OPTIONS_COUNT = 12;

const PAGE_SIZE = 20;
const FIRST_PAGE = 0;
const PAGE_STEP = 1;

const ALL_FILTER = 'all';

export function useAttendanceHistories() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TAttendanceHistoryFilter>('all');
  const dispatch = useAppDispatch();

  const [monthAnchor, setMonthAnchor] = useState(() =>
    getCurrentTime().startOf('month').format(ISO_DATE_FORMAT),
  );

  const [histories, setHistories] = useState<
    readonly TAttendanceHistoryEntry[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const visibleMonth = useMemo(() => {
    const anchor = dayjs(monthAnchor);
    return { month: anchor.month() + MONTH_OFFSET, year: anchor.year() };
  }, [monthAnchor]);

  const loadHistories = useCallback(
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
        getAttendanceHistoriesRequest({
          page,
          size: PAGE_SIZE,

          status: filter === ALL_FILTER ? '' : filter,
          month: dayjs(monthAnchor).format(MONTH_ID_FORMAT),
          onFailure: stopLoading,
          onSuccess: response => {
            stopLoading();
            if (!isMountedRef.current) {
              return;
            }
            pageRef.current = response.page;
            isLastRef.current = response.last;
            // Offset theo trang để `id` không trùng giữa các trang nối vào nhau.
            const mapped = response.content.map((element, index) =>
              AttendanceUtils.toHistoryEntry(element, page * PAGE_SIZE + index),
            );
            setHistories(previous =>
              isFirstPage ? mapped : [...previous, ...mapped],
            );
          },
        }),
      );
    },
    [dispatch, monthAnchor, filter],
  );

  // Tải lại khi mở màn và mỗi lần đổi bộ lọc hoặc đổi tháng — `loadHistories`
  // đổi theo cả `filter` lẫn `monthAnchor`.
  useFocusEffect(
    useCallback(() => {
      loadHistories(FIRST_PAGE);
    }, [loadHistories]),
  );

  const onEndReached = useCallback(() => {
    if (isLoadingRef.current || isLastRef.current || histories.length === 0) {
      return;
    }
    loadHistories(pageRef.current + PAGE_STEP);
  }, [histories.length, loadHistories]);

  const onPressPreviousMonth = useCallback(() => {
    setMonthAnchor(previous =>
      dayjs(previous).subtract(MONTH_STEP, 'month').format(ISO_DATE_FORMAT),
    );
  }, []);

  const onPressNextMonth = useCallback(() => {
    setMonthAnchor(previous =>
      dayjs(previous).add(MONTH_STEP, 'month').format(ISO_DATE_FORMAT),
    );
  }, []);

  const onPickMonth = useCallback(() => {
    const latestMonth = getCurrentTime().startOf('month');
    const items: readonly TSelectionItem[] = Array.from(
      { length: MONTH_OPTIONS_COUNT },
      (_, index) => {
        const month = latestMonth.subtract(index, 'month');
        return {
          id: month.format(MONTH_ID_FORMAT),
          label: t('attendance_histories.month_label', {
            month: month.month() + MONTH_OFFSET,
            year: month.year(),
          }),
        };
      },
    );
    const selectedId = dayjs(monthAnchor).format(MONTH_ID_FORMAT);

    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      items,
      // Truyền nguyên item chứ không phải id: bấm "Xác nhận" mà không chọn lại
      // thì `Selection` trả về đúng giá trị khởi tạo này.
      itemSelected: items.find(item => item.id === selectedId),
      onSelect: (item: TSelectionItem) => {
        setMonthAnchor(dayjs(item.id).format(ISO_DATE_FORMAT));
      },
      pathDisplay: 'label',
      pathSelected: 'id',
      showSearchBar: false,
      title: t('attendance_histories.pick_month'),
    });
  }, [monthAnchor, t]);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  return {
    entries: histories,
    filter,
    isLoading,
    isLoadingMore,
    onEndReached,
    onGoBack,
    onPickMonth,
    onPressNextMonth,
    onPressPreviousMonth,
    setFilter,
    visibleMonth,
  };
}
