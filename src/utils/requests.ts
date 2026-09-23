import type {
  TRequestFilters,
  TRequestItem,
  TRequestPeriod,
  TRequestStatusFilter,
  TRequestTypeFilter,
  TLeaveDuration,
  TRequestDateRange,
} from '@type/requests';

import dayjs from 'dayjs';
import { getCurrentTime } from './date';

const LAST_MONTHS_COUNT = 3;

/** Trạng thái xuất phát: không lọc gì cả. */
export const DEFAULT_REQUEST_FILTERS: TRequestFilters = {
  period: 'all',
  status: 'all',
  type: 'all',
};

/** Thứ tự chip của từng nhóm trong bộ lọc, trái sang phải. */
export const REQUEST_STATUS_OPTIONS: readonly TRequestStatusFilter[] = [
  'all',
  'pending',
  'approved',
  'rejected',
];

export const REQUEST_PERIOD_OPTIONS: readonly TRequestPeriod[] = [
  'all',
  'this_week',
  'this_month',
  'last_3_months',
  'custom',
];

export const REQUEST_TYPE_FILTER_OPTIONS: readonly TRequestTypeFilter[] = [
  'all',
  'leave',
  'late_arrival',
  'early_leave',
  'overtime',
  'attendance_explanation',
];

const matchesStatus = (item: TRequestItem, status: TRequestStatusFilter) => {
  switch (status) {
    case 'all': {
      return true;
    }
    // Nhóm rộng của hàng tab: mọi đơn đã có kết luận, duyệt hay từ chối.
    case 'processed': {
      return item.status !== 'pending';
    }
    default: {
      return item.status === status;
    }
  }
};

const matchesPeriod = (item: TRequestItem, filters: TRequestFilters) => {
  const date = dayjs(item.startDate);

  switch (filters.period) {
    case 'custom': {
      const { range } = filters;
      // Chưa chọn xong ngày thì chưa lọc, thay vì trả về danh sách rỗng.
      return range
        ? !date.isBefore(dayjs(range.from), 'day') &&
            !date.isAfter(dayjs(range.to), 'day')
        : true;
    }
    case 'last_3_months': {
      return !date.isBefore(
        getCurrentTime().subtract(LAST_MONTHS_COUNT, 'month'),
        'day',
      );
    }
    case 'this_month': {
      return date.isSame(getCurrentTime(), 'month');
    }
    case 'this_week': {
      // `dayjs` mặc định coi Chủ nhật là đầu tuần; đơn từ tính theo tuần làm
      // việc nên neo vào Thứ hai cho khớp cách người dùng hiểu "tuần này".
      const monday = getCurrentTime().startOf('week').add(1, 'day');
      return (
        !date.isBefore(monday, 'day') &&
        !date.isAfter(monday.add(6, 'day'), 'day')
      );
    }
    default: {
      return true;
    }
  }
};

/** Một đơn có lọt qua toàn bộ bộ lọc đang áp hay không. */
export const matchesRequestFilters = (
  item: TRequestItem,
  filters: TRequestFilters,
) =>
  (filters.type === 'all' || item.type === filters.type) &&
  matchesStatus(item, filters.status) &&
  matchesPeriod(item, filters);

/**
 * Số hiện trên nút "Áp dụng": ĐẾM SỐ BỘ LỌC ĐANG BẬT, không phải số đơn khớp.
 * Mỗi mục chọn một chip khác "Tất cả" thì tính 1, mục để "Tất cả" tính 0 — nên
 * giá trị chỉ chạy từ 0 (chưa lọc gì) tới 3 (cả ba mục đều đang lọc).
 */
export const countSelectedFilters = (filters: TRequestFilters) =>
  (filters.type === 'all' ? 0 : 1) +
  (filters.status === 'all' ? 0 : 1) +
  (filters.period === 'all' ? 0 : 1);

/**
 * Phần lọc KHÔNG phụ thuộc trạng thái — dùng để đếm số đơn cho từng tab, vì
 * con số trên tab phải là "nếu bấm tab này thì còn bao nhiêu đơn".
 */
export const matchesRequestFiltersExceptStatus = (
  item: TRequestItem,
  filters: TRequestFilters,
) =>
  (filters.type === 'all' || item.type === filters.type) &&
  matchesPeriod(item, filters);

const HALF_DAY = 0.5;
const DAY_DECIMALS = 1;
const DECIMAL_SEPARATOR = ',';

/**
 * Số ngày nghỉ của một đơn. Nghỉ nửa buổi thì mỗi ngày trong khoảng chỉ tính
 * nửa ngày, nên chọn buổi sáng cho khoảng 2 ngày ra 1,0 chứ không phải 0,5.
 */
export const countLeaveDays = (
  startDate: string,
  endDate: string,
  duration: TLeaveDuration,
) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid() || end.isBefore(start, 'day')) {
    return 0;
  }

  const spannedDays = end.diff(start, 'day') + 1;
  return duration === 'full_day' ? spannedDays : spannedDays * HALF_DAY;
};

/**
 * Số ngày nghỉ dạng chữ, luôn một chữ số thập phân: `2` → `2,0`.
 *
 * Dùng dấu phẩy cố định theo cách viết tiếng Việt chứ không theo locale đang
 * bật — bản en/ko sẽ thấy dấu phẩy thay vì dấu chấm.
 */
export const formatLeaveDays = (days: number) =>
  days.toFixed(DAY_DECIMALS).replace('.', DECIMAL_SEPARATOR);

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Sắp hai đầu của một khoảng ngày về đúng thứ tự, `from` luôn không sau `to`.
 *
 * Lịch dùng chung cho chạm hai ngày theo thứ tự tuỳ ý và chỉ `push` vào mảng
 * chứ không sắp lại, nên chạm ngày muộn trước sẽ trả về khoảng ngược. Khoảng
 * ngược làm mọi phép so sánh sau đó ra rỗng: số ngày nghỉ thành 0, bộ lọc
 * không khớp đơn nào.
 *
 * Hai đầu trùng nhau là hợp lệ — đó là đơn nghỉ đúng một ngày.
 */
export const toOrderedDateRange = (
  first: dayjs.ConfigType,
  second: dayjs.ConfigType,
): TRequestDateRange => {
  const start = dayjs(first);
  const end = dayjs(second);
  const isReversed = end.isBefore(start, 'day');

  return {
    from: (isReversed ? end : start).format(ISO_DATE_FORMAT),
    to: (isReversed ? start : end).format(ISO_DATE_FORMAT),
  };
};
