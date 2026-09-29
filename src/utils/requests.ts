import type {
  TAttendanceEventKind,
  TCreateRequestSection,
  TLeaveBalanceKind,
  TLeaveKind,
  TRequestFilters,
  TRequestItem,
  TRequestPeriod,
  TRequestStatusFilter,
  TRequestType,
  TRequestTypeFilter,
  TLeaveDuration,
  TRequestDateRange,
  TWorkPlace,
} from '@type/requests';

import dayjs from 'dayjs';
import { getCurrentTime, MINUTES_PER_HOUR, parseMinutes } from './date';

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
 * Đổi bộ lọc của màn thành khoảng ngày phẳng để gửi lên server.
 *
 * Giữ đúng ngữ nghĩa của `matchesPeriod`: `last_3_months` chỉ chặn đầu dưới
 * (đơn có ngày áp dụng trong tương lai vẫn tính), còn `this_week`/`this_month`
 * chặn cả hai đầu. `all` và `custom` chưa chọn xong ngày thì không giới hạn gì.
 */
export const toRequestDateRange = (
  filters: TRequestFilters,
): { readonly fromDate?: string; readonly toDate?: string } => {
  switch (filters.period) {
    case 'custom': {
      return {
        fromDate: filters.range?.from,
        toDate: filters.range?.to,
      };
    }
    case 'last_3_months': {
      return {
        fromDate: getCurrentTime()
          .subtract(LAST_MONTHS_COUNT, 'month')
          .format(ISO_DATE_FORMAT),
      };
    }
    case 'this_month': {
      const now = getCurrentTime();
      return {
        fromDate: now.startOf('month').format(ISO_DATE_FORMAT),
        toDate: now.endOf('month').format(ISO_DATE_FORMAT),
      };
    }
    case 'this_week': {
      // Neo vào Thứ hai, giống `matchesPeriod`.
      const monday = getCurrentTime().startOf('week').add(1, 'day');
      return {
        fromDate: monday.format(ISO_DATE_FORMAT),
        toDate: monday.add(6, 'day').format(ISO_DATE_FORMAT),
      };
    }
    default: {
      return {};
    }
  }
};

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

// ─── Form tạo đơn ─────────────────────────────────────────────────────────────

/**
 * Khối nội dung mà form tạo đơn bật lên cho từng loại đơn, suy thẳng từ bộ
 * trường "Thông tin chung" mà màn Chi tiết đơn hiện cho loại đó.
 *
 * Thứ tự trong mảng chỉ để đọc cho dễ đối chiếu; thứ tự vẽ thật do JSX ở
 * `screens/CreateRequest/index.tsx` quyết định (một trật tự dùng chung cho mọi
 * loại), nên thêm khối mới thì nhớ chèn vào đúng chỗ trong JSX đó.
 */
export const CREATE_REQUEST_SECTIONS: Readonly<
  Record<TRequestType, readonly TCreateRequestSection[]>
> = {
  // Chi tiết: ngày cần giải trình, thời gian, loại sự kiện, lý do, ghi chú.
  attendance_explanation: [
    'single_date',
    'time_range',
    'event_kind',
    'reason',
    'note',
    'attachment',
  ],
  // Chi tiết: ngày về sớm, thời gian, lý do.
  early_leave: ['single_date', 'time_range', 'reason', 'attachment'],
  // Chi tiết: ngày đi muộn, thời gian, lý do.
  late_arrival: ['single_date', 'time_range', 'reason', 'attachment'],
  // Chi tiết: thời gian nghỉ, số ngày, số ngày còn lại, hình thức, lý do.
  leave: [
    'balances',
    'leave_kind',
    'date_range',
    'duration',
    'summary',
    'reason',
    'attachment',
  ],
  // Chi tiết: ngày làm thêm, thời gian, lý do, địa điểm, ghi chú.
  overtime: [
    'single_date',
    'time_range',
    'place',
    'reason',
    'note',
    'attachment',
  ],
};

/**
 * Khối nào là bắt buộc. Mọi khối còn lại hoặc không nhận nhập liệu
 * (`balances`, `summary`), hoặc luôn có sẵn một giá trị hợp lệ vì là ô chọn
 * một-trong-nhiều (`duration`, `leave_kind`, `place`,
 * `event_kind`), hoặc không bắt buộc theo nghiệp vụ (`note`, `attachment`).
 */
const REQUIRED_SECTIONS: ReadonlySet<TCreateRequestSection> = new Set([
  'date_range',
  'reason',
  'single_date',
  'time_range',
]);

/** Giá trị cần để chấm xem form đã đủ điều kiện gửi chưa. */
export type TCreateRequestValues = {
  /** Ngày của đơn nhắm một ngày, dạng `YYYY-MM-DD`. */
  readonly date: string;
  readonly reason: string;
  readonly totalDays: number;
  readonly totalHours: number;
};

/**
 * Những khối BẮT BUỘC của loại đơn này mà người dùng chưa điền xong.
 *
 * Duyệt thẳng `CREATE_REQUEST_SECTIONS[type]` chứ không viết điều kiện riêng
 * cho từng loại: thêm loại đơn mới chỉ cần khai báo khối, phần kiểm tự đúng
 * theo. Rỗng nghĩa là gửi được.
 */
export const findMissingSections = (
  type: TRequestType,
  values: TCreateRequestValues,
): readonly TCreateRequestSection[] =>
  CREATE_REQUEST_SECTIONS[type].filter(section => {
    if (!REQUIRED_SECTIONS.has(section)) {
      return false;
    }

    switch (section) {
      // Khoảng ngày ngược hoặc rỗng đều cho ra 0 ngày.
      case 'date_range': {
        return values.totalDays <= 0;
      }
      case 'reason': {
        return values.reason.trim().length === 0;
      }
      case 'single_date': {
        return !dayjs(values.date).isValid();
      }
      // Giờ kết thúc không sau giờ bắt đầu thì `countHours` trả về 0.
      case 'time_range': {
        return values.totalHours <= 0;
      }
      default: {
        return false;
      }
    }
  });

/** Tiêu đề dải đầu màn tạo đơn, đổi theo loại đơn đang soạn. */
export const CREATE_REQUEST_TITLE_KEYS: Readonly<Record<TRequestType, string>> =
  {
    attendance_explanation: 'create_request.title_attendance_explanation',
    early_leave: 'create_request.title_early_leave',
    late_arrival: 'create_request.title_late_arrival',
    leave: 'create_request.title_leave',
    overtime: 'create_request.title_overtime',
  };

/**
 * Nhãn ô lý do. Màn Chi tiết gọi chung là "Lý do" vì ở đó đã có loại đơn ngay
 * trên đầu; form thì đang hỏi nên nói rõ hỏi lý do của việc gì.
 */
export const CREATE_REQUEST_REASON_LABEL_KEYS: Readonly<
  Record<TRequestType, string>
> = {
  attendance_explanation: 'create_request.reason_label_attendance_explanation',
  early_leave: 'create_request.reason_label_early_leave',
  late_arrival: 'create_request.reason_label_late_arrival',
  leave: 'create_request.reason_label_leave',
  overtime: 'create_request.reason_label_overtime',
};

/** Gợi ý trong ô lý do, nhắc đúng thứ người duyệt của loại đơn đó cần biết. */
export const CREATE_REQUEST_REASON_PLACEHOLDER_KEYS: Readonly<
  Record<TRequestType, string>
> = {
  attendance_explanation:
    'create_request.reason_placeholder_attendance_explanation',
  early_leave: 'create_request.reason_placeholder_early_leave',
  late_arrival: 'create_request.reason_placeholder_late_arrival',
  leave: 'create_request.reason_placeholder_leave',
  overtime: 'create_request.reason_placeholder_overtime',
};

/** Thứ tự loại đơn trong ô chọn ở đầu form. */
export const CREATE_REQUEST_TYPE_ORDER: readonly TRequestType[] = [
  'leave',
  'late_arrival',
  'early_leave',
  'overtime',
  'attendance_explanation',
];

/**
 * Nhãn ô ngày của đơn chỉ nhắm một ngày. Dùng chung khoá với màn Chi tiết để
 * chỗ hỏi và chỗ hiện gọi cùng một tên.
 */
export const SINGLE_DATE_LABEL_KEYS: Readonly<Record<TRequestType, string>> = {
  attendance_explanation: 'request_detail.field_explanation_date',
  early_leave: 'request_detail.field_early_leave_date',
  late_arrival: 'request_detail.field_late_arrival_date',
  leave: 'request_detail.field_period',
  overtime: 'request_detail.field_overtime_date',
};

/** Nguồn phép mà từng loại nghỉ sẽ trừ vào. */
export const LEAVE_KIND_SOURCES: Readonly<
  Record<TLeaveKind, TLeaveBalanceKind>
> = {
  annual: 'annual',
  compensatory: 'annual',
  performance: 'performance',
  unpaid: 'unpaid',
  wedding: 'annual',
};

export const LEAVE_KIND_LABEL_KEYS: Readonly<Record<TLeaveKind, string>> = {
  annual: 'create_request.kind_annual',
  compensatory: 'create_request.kind_compensatory',
  performance: 'create_request.kind_performance',
  unpaid: 'create_request.kind_unpaid',
  wedding: 'create_request.kind_wedding',
};

export const LEAVE_KIND_ORDER: readonly TLeaveKind[] = [
  'annual',
  'performance',
  'compensatory',
  'wedding',
  'unpaid',
];

export const BALANCE_LABEL_KEYS: Readonly<Record<TLeaveBalanceKind, string>> = {
  annual: 'create_request.balance_annual',
  performance: 'create_request.balance_performance',
  unpaid: 'create_request.balance_unpaid',
};

export const WORK_PLACE_LABEL_KEYS: Readonly<Record<TWorkPlace, string>> = {
  client: 'create_request.place_client',
  home: 'create_request.place_home',
  office: 'create_request.place_office',
};

export const WORK_PLACE_ORDER: readonly TWorkPlace[] = [
  'office',
  'home',
  'client',
];

export const EVENT_KIND_LABEL_KEYS: Readonly<
  Record<TAttendanceEventKind, string>
> = {
  early_leave: 'create_request.event_early_leave',
  forgot_check_in: 'create_request.event_forgot_check_in',
  forgot_check_out: 'create_request.event_forgot_check_out',
  late_arrival: 'create_request.event_late_arrival',
};

export const EVENT_KIND_ORDER: readonly TAttendanceEventKind[] = [
  'late_arrival',
  'early_leave',
  'forgot_check_in',
  'forgot_check_out',
];

const HOUR_DECIMALS = 1;

/**
 * Số giờ giữa hai mốc `HH:mm`. Trả về 0 khi mốc kết thúc không nằm sau mốc bắt
 * đầu — ca qua nửa đêm không thuộc luồng đơn từ này.
 */
export const countHours = (startTime: string, endTime: string) => {
  const start = parseMinutes(startTime);
  const end = parseMinutes(endTime);
  if (start === undefined || end === undefined || end <= start) {
    return 0;
  }
  return (end - start) / MINUTES_PER_HOUR;
};

/**
 * Số giờ dạng chữ, bỏ phần thập phân khi tròn giờ: `3` → `3`, `1.5` → `1,5`.
 * Dùng dấu phẩy cố định, giống `formatLeaveDays`.
 */
export const formatHours = (hours: number) =>
  Number.isInteger(hours)
    ? String(hours)
    : hours.toFixed(HOUR_DECIMALS).replace('.', DECIMAL_SEPARATOR);

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
