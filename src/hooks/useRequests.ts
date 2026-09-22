import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import type {
  TRequestItem,
  TRequestSection,
  TRequestTab,
  TRequestType,
} from '@type/requests';

import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
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

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).

const MOCK_REQUESTS: readonly TRequestItem[] = [
  {
    createdAt: '2026-09-18',
    dayCount: 2,
    endDate: '2026-09-23',
    id: 'req-2026-09-22',
    reason: 'Giải quyết việc gia đình',
    startDate: '2026-09-22',
    status: 'pending',
    type: 'leave',
  },
  {
    createdAt: '2026-09-10',
    dayCount: 3,
    endDate: '2026-09-18',
    id: 'req-2026-09-16',
    reason: 'Nghỉ du lịch cùng gia đình',
    startDate: '2026-09-16',
    status: 'pending',
    type: 'leave',
  },
  {
    createdAt: '2026-09-12',
    id: 'req-2026-09-12',
    reason: 'Xe hỏng giữa đường',
    startDate: '2026-09-12',
    status: 'approved',
    type: 'late_arrival',
  },
  {
    createdAt: '2026-09-09',
    id: 'req-2026-09-09',
    reason: 'Đưa con đi khám',
    startDate: '2026-09-09',
    status: 'approved',
    type: 'early_leave',
  },
  {
    createdAt: '2026-09-03',
    id: 'req-2026-09-03',
    reason: 'Kẹt xe do mưa lớn',
    startDate: '2026-09-03',
    status: 'rejected',
    type: 'late_arrival',
  },
  {
    createdAt: '2026-08-27',
    id: 'req-2026-08-28',
    reason: 'Có việc gia đình',
    startDate: '2026-08-28',
    status: 'approved',
    type: 'early_leave',
  },
  {
    createdAt: '2026-08-15',
    dayCount: 3,
    endDate: '2026-08-22',
    id: 'req-2026-08-20',
    reason: 'Về quê',
    startDate: '2026-08-20',
    status: 'approved',
    type: 'leave',
  },
  {
    createdAt: '2026-08-12',
    id: 'req-2026-08-12',
    reason: 'Đi khám sức khoẻ định kỳ',
    startDate: '2026-08-12',
    status: 'approved',
    type: 'late_arrival',
  },
  {
    createdAt: '2026-08-04',
    id: 'req-2026-08-05',
    reason: 'Đón người nhà ở sân bay',
    startDate: '2026-08-05',
    status: 'rejected',
    type: 'early_leave',
  },
  {
    createdAt: '2026-07-30',
    dayCount: 1,
    id: 'req-2026-08-03',
    reason: 'Nghỉ phép năm',
    startDate: '2026-08-03',
    status: 'approved',
    type: 'leave',
  },
  {
    createdAt: '2026-07-21',
    id: 'req-2026-07-21',
    reason: 'Tàu điện hỏng giờ cao điểm',
    startDate: '2026-07-21',
    status: 'approved',
    type: 'late_arrival',
  },
  {
    createdAt: '2026-07-08',
    dayCount: 2,
    endDate: '2026-07-14',
    id: 'req-2026-07-13',
    reason: 'Giỗ gia đình',
    startDate: '2026-07-13',
    status: 'pending',
    type: 'leave',
  },
];

// ──────────────────────────────────────────────────────────────────────────────

const matchesTab = (item: TRequestItem, tab: TRequestTab) => {
  switch (tab) {
    case 'pending': {
      return item.status === 'pending';
    }
    case 'processed': {
      return item.status !== 'pending';
    }
    default: {
      return true;
    }
  }
};

/** Gom các đơn đã lọc thành từng nhóm tháng, mới nhất xếp trước. */
const groupByMonth = (items: readonly TRequestItem[]): TRequestSection[] => {
  // `Map` giữ nguyên thứ tự chèn nên các tháng ra đúng thứ tự của danh sách đã
  // sắp trước đó, không phải sắp lại lần nữa.
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

/**
 * Toàn bộ logic màn Đơn từ: loại đơn và nhóm tab đang lọc, số đơn của từng
 * nhóm và danh sách đơn đã gom theo tháng.
 */
export function useRequests() {
  const [tab, setTab] = useState<TRequestTab>('all');
  /** `undefined` là không lọc theo loại đơn nào cả. */
  const [typeFilter, setTypeFilter] = useState<TRequestType | undefined>();

  // Sắp một lần cho cả màn: ngày áp dụng mới nhất lên trước, cùng ngày thì đơn
  // gửi sau đứng trên.
  const sortedRequests = useMemo(
    () =>
      // Spread đã tạo mảng mới nên sort tại chỗ không đụng vào `MOCK_REQUESTS`;
      // `toSorted` chưa có trong lib TS/Hermes của dự án.
      // eslint-disable-next-line unicorn/no-array-sort
      [...MOCK_REQUESTS].sort((left, right) => {
        const byStartDate = right.startDate.localeCompare(left.startDate);
        return byStartDate === 0
          ? right.createdAt.localeCompare(left.createdAt)
          : byStartDate;
      }),
    [],
  );

  const typedRequests = useMemo(
    () =>
      typeFilter === undefined
        ? sortedRequests
        : sortedRequests.filter(item => item.type === typeFilter),
    [sortedRequests, typeFilter],
  );

  // Số đếm trên tab bám theo loại đơn đang lọc, để con số luôn khớp với danh
  // sách đang hiện chứ không phải tổng của cả màn.
  const counts = useMemo(
    () => ({
      all: typedRequests.length,
      pending: typedRequests.filter(item => item.status === 'pending').length,
      processed: typedRequests.filter(item => item.status !== 'pending').length,
    }),
    [typedRequests],
  );

  const sections = useMemo(
    () => groupByMonth(typedRequests.filter(item => matchesTab(item, tab))),
    [tab, typedRequests],
  );

  const onChangeTab = useCallback((next: TRequestTab) => {
    setTab(next);
  }, []);

  /** Bấm lại đúng loại đang chọn thì bỏ lọc, quay về xem tất cả. */
  const onToggleType = useCallback((next: TRequestType) => {
    setTypeFilter(current => (current === next ? undefined : next));
  }, []);

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

  // Đổi loại đơn khi hàng tab đang ẩn có thể để lại danh sách quá ngắn, không
  // còn cuộn được để vuốt cho nó hiện lại — nên trả về trạng thái hiện luôn.
  useEffect(() => {
    dragDistance.current = NO_DRAG;
    isTabsHidden.current = false;
    lastOffsetY.current = 0;
    tabsProgress.set(withTiming(FULLY_SHOWN, { duration: TABS_DURATION }));
  }, [tabsProgress, typeFilter]);

  /**
   * Handler chạy ở luồng JS chứ không phải `useAnimatedScrollHandler`:
   * `SectionList` không có bản animated sẵn, phải tự bọc bằng
   * `createAnimatedComponent` thì handler của reanimated hay không gắn được vào
   * `ScrollView` bên trong và im lặng không chạy. Ở đây mỗi event chỉ quyết
   * định ẩn/hiện chứ không nội suy từng frame, nên đi qua JS hoàn toàn ổn —
   * bản thân animation vẫn do `withTiming` chạy trên luồng UI.
   */
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

      // Cộng dồn quãng vuốt thay vì xét delta của riêng từng frame: vuốt chậm
      // thì mỗi frame chỉ nhích vài pixel, không frame nào đủ chạm ngưỡng.
      // Đổi hướng thì đếm lại từ đầu, không thì quãng xuôi và ngược triệt tiêu
      // nhau và trạng thái không bao giờ lật.
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

  /**
   * CHỈ `transform` và `opacity` — hai thứ chạy thẳng trên GPU. Bản trước
   * animate `height`, là layout prop: reanimated phải đi qua đường khác, gây
   * layout lại mỗi frame và trên Fabric thì không ăn.
   *
   * Hàng tab nằm đè tuyệt đối lên đầu danh sách, nên trượt nó lên không đụng
   * gì tới bố cục; phần danh sách lộ ra bên dưới chính là nội dung vốn đã cuộn
   * qua chỗ đó, không để lại khoảng trống.
   */
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

  /** Chừa đúng chỗ hàng tab đang đè lên, để dòng đầu không bị nó che. */
  const listContentStyle = useMemo(
    () => ({ paddingTop: tabsHeight ?? NO_HEIGHT }),
    [tabsHeight],
  );

  return {
    counts,
    listContentStyle,
    onChangeTab,
    onScroll,
    onTabsLayout,
    onToggleType,
    sections,
    tab,
    tabsStyle,
    typeFilter,
  };
}
