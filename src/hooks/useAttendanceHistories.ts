import type { SelectionItem } from '@dialogs/Selection';
import type {
  TAttendanceHistoryEntry,
  TAttendanceHistoryFilter,
} from '@type/attendance';

import AppNavigator from '@navigation/AppNavigator';
import dayjs from 'dayjs';
import Selection from '@dialogs/Selection';
import { getCurrentTime } from '@utils/date';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_ID_FORMAT = 'YYYY-MM';
const MONTH_OFFSET = 1;
const MONTH_STEP = 1;
/** Số tháng liệt kê trong bộ chọn tháng, tính ngược từ tháng hiện tại. */
const MONTH_OPTIONS_COUNT = 12;

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).

const DEVICE = 'iPhone 16 Pro';

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
 * Toàn bộ logic màn Lịch sử chấm công: tháng đang xem, bộ lọc theo loại dấu
 * chấm công, và danh sách ngày công của tháng đó.
 */
export function useAttendanceHistories() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TAttendanceHistoryFilter>('all');
  // Neo ở ngày 1 chứ không phải ngày hôm nay: `add(1, 'month')` từ ngày 31 sẽ bị
  // kẹp về 28/30, lùi lại không ra ngày cũ nữa nên bấm tới/lui vài nhịp là trôi
  // mất tháng.
  const [monthAnchor, setMonthAnchor] = useState(() =>
    getCurrentTime().startOf('month').format(ISO_DATE_FORMAT),
  );

  const visibleMonth = useMemo(() => {
    const anchor = dayjs(monthAnchor);
    return { month: anchor.month() + MONTH_OFFSET, year: anchor.year() };
  }, [monthAnchor]);

  const entries = useMemo(() => {
    const anchor = dayjs(monthAnchor);
    return MOCK_ENTRIES.filter(
      entry =>
        dayjs(entry.date).isSame(anchor, 'month') &&
        matchesFilter(entry, filter),
    );
  }, [filter, monthAnchor]);

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

  /**
   * Mở bộ chọn tháng bằng bottom sheet `Selection` dùng chung.
   *
   * Danh sách dựng ngay lúc bấm chứ không memo: nó bám theo tháng hiện tại, mà
   * phiên làm việc có thể vắt qua nửa đêm cuối tháng.
   */
  const onPickMonth = useCallback(() => {
    // Màn lịch sử nên không liệt kê tháng tương lai; mới nhất xếp trước.
    const latestMonth = getCurrentTime().startOf('month');
    const items: readonly SelectionItem[] = Array.from(
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
      onSelect: (item: SelectionItem) => {
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
    entries,
    filter,
    onGoBack,
    onPickMonth,
    onPressNextMonth,
    onPressPreviousMonth,
    setFilter,
    visibleMonth,
  };
}
