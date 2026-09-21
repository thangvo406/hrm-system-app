import type {
  TAttendanceHistoryEntry,
  TAttendanceHistoryFilter,
  TAttendanceWeekDay,
} from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_OFFSET = 1;
const DAYS_PER_WEEK = 7;
const WEEK_STEP = 1;
const MONTH_STEP = 1;

/** Thứ Hai đầu tuần, khớp thứ tự T2 → CN của dải tuần trong thiết kế. */
const WEEKDAY_KEYS: readonly string[] = [
  'date.date_range.mon',
  'date.date_range.tue',
  'date.date_range.wed',
  'date.date_range.thu',
  'date.date_range.fri',
  'date.date_range.sat',
  'date.date_range.sun',
];

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).

const DEVICE = 'iPhone 16 Pro';
const TODAY = '2026-09-16';

const MOCK_ENTRIES: readonly TAttendanceHistoryEntry[] = [
  {
    checkInAt: '08:26',
    checkInMethod: 'gps',
    checkOutAt: '17:34',
    checkOutMethod: 'gps',
    date: '2026-09-16',
    device: DEVICE,
    id: 'day-2026-09-16',
    status: 'on_time',
    workedHours: 9,
    workedMinutes: 8,
  },
  {
    checkInAt: '08:45',
    checkInMethod: 'qr',
    checkOutAt: '17:30',
    checkOutMethod: 'gps',
    date: '2026-09-15',
    device: DEVICE,
    id: 'day-2026-09-15',
    status: 'late',
    workedHours: 8,
    workedMinutes: 45,
  },
  {
    checkInAt: '08:20',
    checkInMethod: 'gps',
    checkOutAt: '17:35',
    checkOutMethod: 'gps',
    date: '2026-09-14',
    device: DEVICE,
    id: 'day-2026-09-14',
    status: 'on_time',
    workedHours: 9,
    workedMinutes: 15,
  },
  {
    checkInAt: '08:10',
    checkInMethod: 'qr',
    checkOutAt: '16:50',
    checkOutMethod: 'gps',
    date: '2026-09-13',
    device: DEVICE,
    id: 'day-2026-09-13',
    status: 'early_leave',
    workedHours: 8,
    workedMinutes: 40,
  },
  {
    date: '2026-09-12',
    id: 'day-2026-09-12',
    status: 'missing',
  },
  {
    checkInAt: '08:28',
    checkInMethod: 'gps',
    checkOutAt: '17:32',
    checkOutMethod: 'gps',
    date: '2026-09-17',
    device: DEVICE,
    id: 'day-2026-09-17',
    status: 'on_time',
    workedHours: 9,
    workedMinutes: 4,
  },
  {
    checkInAt: '08:22',
    checkInMethod: 'gps',
    checkOutAt: '17:40',
    checkOutMethod: 'gps',
    date: '2026-09-18',
    device: DEVICE,
    id: 'day-2026-09-18',
    status: 'on_time',
    workedHours: 9,
    workedMinutes: 18,
  },
];

// ──────────────────────────────────────────────────────────────────────────────

const matchesFilter = (
  entry: TAttendanceHistoryEntry,
  filter: TAttendanceHistoryFilter,
) => {
  switch (filter) {
    case 'all': {
      return true;
    }
    case 'check_in': {
      return !!entry.checkInAt;
    }
    case 'check_out': {
      return !!entry.checkOutAt;
    }
    default: {
      return entry.status === filter;
    }
  }
};

/**
 * Toàn bộ logic màn Lịch sử chấm công: dải tuần ở đầu màn, bộ lọc theo loại dấu
 * chấm công, và danh sách ngày công.
 *
 * Dải tuần là bộ điều hướng ngày, KHÔNG lọc danh sách bên dưới — đúng như thiết
 * kế, nơi tuần đang xem là 14–20 nhưng danh sách vẫn liệt kê cả ngày 12 và 13.
 */
export function useAttendanceHistories() {
  const [filter, setFilter] = useState<TAttendanceHistoryFilter>('all');
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const entries = useMemo(
    () => MOCK_ENTRIES.filter(entry => matchesFilter(entry, filter)),
    [filter],
  );

  const weekDays = useMemo<readonly TAttendanceWeekDay[]>(() => {
    // `day()` trả 0 cho Chủ Nhật, mà dải tuần bắt đầu từ Thứ Hai, nên Chủ Nhật
    // phải lùi về tuần trước chứ không mở đầu tuần mới.
    const selected = dayjs(selectedDate);
    const weekdayIndex = (selected.day() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
    const monday = selected.subtract(weekdayIndex, 'day');

    return Array.from({ length: DAYS_PER_WEEK }, (_, index) => {
      const date = monday.add(index, 'day');
      const iso = date.format(ISO_DATE_FORMAT);
      return {
        date: iso,
        dayNumber: date.date(),
        id: iso,
        status: MOCK_ENTRIES.find(entry => entry.date === iso)?.status,
        weekdayKey: WEEKDAY_KEYS[index] ?? '',
      };
    });
  }, [selectedDate]);

  const visibleMonth = useMemo(() => {
    const selected = dayjs(selectedDate);
    return { month: selected.month() + MONTH_OFFSET, year: selected.year() };
  }, [selectedDate]);

  const onPressPreviousWeek = useCallback(() => {
    setSelectedDate(previous =>
      dayjs(previous).subtract(WEEK_STEP, 'week').format(ISO_DATE_FORMAT),
    );
  }, []);

  const onPressNextWeek = useCallback(() => {
    setSelectedDate(previous =>
      dayjs(previous).add(WEEK_STEP, 'week').format(ISO_DATE_FORMAT),
    );
  }, []);

  const onPressPreviousMonth = useCallback(() => {
    setSelectedDate(previous =>
      dayjs(previous).subtract(MONTH_STEP, 'month').format(ISO_DATE_FORMAT),
    );
  }, []);

  const onPressNextMonth = useCallback(() => {
    setSelectedDate(previous =>
      dayjs(previous).add(MONTH_STEP, 'month').format(ISO_DATE_FORMAT),
    );
  }, []);

  /**
   * Mở bộ chọn tháng. Chưa có dialog chọn tháng trong dự án nên tạm để trống,
   * đúng tinh thần màn này vẫn đang chạy trên MOCK_ENTRIES.
   */
  const onPickMonth = useCallback(() => {
    // TODO: mở dialog chọn tháng khi có component picker dùng chung.
  }, []);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  return {
    entries,
    filter,
    onGoBack,
    onPickMonth,
    onPressNextMonth,
    onPressNextWeek,
    onPressPreviousMonth,
    onPressPreviousWeek,
    selectedDate,
    setFilter,
    setSelectedDate,
    visibleMonth,
    weekDays,
  };
}
