import type { AppCallback, ListApiResponse } from '@type/common';
import type { IconName } from '@assets/icons';

/** Loại đơn nhân viên có thể gửi. Nghỉ ốm đã bị bỏ khỏi luồng này. */
export type TRequestType =
  | 'attendance_explanation'
  | 'early_leave'
  | 'late_arrival'
  | 'leave'
  | 'overtime';

/** Kết luận duyệt của một đơn. */

export type TRequestStatus = 'approved' | 'draft' | 'pending' | 'rejected';

/** Nhóm đơn hiển thị trên hàng tab ở đầu danh sách. */
export type TRequestTab = 'all' | 'pending' | 'processed';

export type TRequestStatusFilter =
  | 'all'
  | 'processed'
  | Exclude<TRequestStatus, 'draft'>;

export type TRequestTypeFilter = 'all' | 'draft' | TRequestType;

export type TRequestPeriod =
  | 'all'
  | 'custom'
  | 'last_3_months'
  | 'this_month'
  | 'this_week';

export type TRequestDateRange = {
  readonly from: string;
  readonly to: string;
};

export type TDatePickMode = 'range' | 'single';

/** Nguồn ngày nghỉ mà đơn sẽ trừ vào. */
export type TLeaveBalanceKind = 'annual' | 'performance' | 'unpaid';

/** Một thẻ số dư ở đầu màn tạo đơn. */
export type TLeaveBalance = {
  /** `undefined` nghĩa là không có hạn mức cố định, hiển thị dấu gạch. */
  readonly days?: number;
  readonly kind: TLeaveBalanceKind;
};

/** Nghỉ cả ngày hay nửa ngày. */
export type TLeaveDuration = 'afternoon' | 'full_day' | 'morning';

/** Loại nghỉ phép chọn trong ô thả xuống. */
export type TLeaveKind =
  | 'annual'
  | 'compensatory'
  | 'performance'
  | 'unpaid'
  | 'wedding';

/** Một cấp duyệt trong luồng phê duyệt của đơn. */
export type TApprovalStep = {
  readonly id: string;
  /** Chữ viết tắt hiện trong vòng tròn đại diện. */
  readonly initials: string;
  readonly name: string;
  /** Khoá i18n mô tả vai trò của cấp duyệt này. */
  readonly roleKey: string;
};

/** Nơi ngồi làm khi đăng ký OT. */
export type TWorkPlace = 'client' | 'home' | 'office';

/** Sự kiện cần giải trình trong đơn giải trình công. */
export type TAttendanceEventKind =
  | 'early_leave'
  | 'forgot_check_in'
  | 'forgot_check_out'
  | 'late_arrival';

export type TCreateRequestSection =
  | 'attachment'
  | 'balances'
  | 'date_range'
  | 'duration'
  | 'event_kind'
  | 'leave_kind'
  | 'note'
  | 'place'
  | 'reason'
  | 'single_date'
  | 'summary'
  | 'time_range';

export type TCreateRequestDraft = {
  /** Ngày áp dụng của đơn chỉ nhắm một ngày, dạng `YYYY-MM-DD`. */
  readonly date: string;
  readonly duration: TLeaveDuration;
  /** Dạng `YYYY-MM-DD`. */
  readonly endDate: string;
  /** Dạng `HH:mm`. */
  readonly endTime: string;
  readonly eventKind: TAttendanceEventKind;
  readonly leaveKind: TLeaveKind;
  readonly note: string;
  readonly place: TWorkPlace;
  readonly reason: string;
  /** Dạng `YYYY-MM-DD`. */
  readonly startDate: string;
  /** Dạng `HH:mm`. */
  readonly startTime: string;
  readonly type: TRequestType;
};

export type TCreateRequestFormValues = Omit<TCreateRequestDraft, 'type'>;

export type TCreateRequestFormState = {
  readonly byType: Readonly<Record<TRequestType, TCreateRequestFormValues>>;
  readonly revision: number;
  readonly type: TRequestType;
};

export type TCreateRequestAction =
  | { readonly action: 'apply_draft'; readonly draft: TCreateRequestDraft }
  | { readonly action: 'change_type'; readonly requestType: TRequestType }
  | {
      readonly action: 'patch';
      readonly values: Partial<TCreateRequestFormValues>;
    };

/** Toàn bộ bộ lọc đang áp cho danh sách đơn. */
export type TRequestFilters = {
  readonly period: TRequestPeriod;
  /** Chỉ dùng khi `period` là `custom`. */
  readonly range?: TRequestDateRange;
  readonly status: TRequestStatusFilter;
  readonly type: TRequestTypeFilter;
};

/** Một đơn từ trong danh sách. */
export type TRequestItem = {
  /** Ngày gửi đơn, dạng `YYYY-MM-DD`. */
  readonly createdAt: string;
  /** Số ngày nghỉ; `undefined` với đơn đi muộn / về sớm chỉ tính theo giờ. */
  readonly dayCount?: number;
  /** `undefined` khi đơn chỉ áp dụng cho đúng một ngày. */
  readonly endDate?: string;
  readonly id: string;
  readonly reason: string;
  /** Ngày áp dụng (ngày đầu nếu là khoảng), dạng `YYYY-MM-DD`. */
  readonly startDate: string;
  readonly status: TRequestStatus;
  readonly type: TRequestType;
};

export interface IRequestGetRequests
  extends AppCallback<ListApiResponse<TRequestItem[]>> {
  /** Đầu khoảng lọc, dạng `YYYY-MM-DD`. */
  fromDate?: string;
  page: number;
  size: number;
  /** Một giá trị của `TRequestStatus`; bỏ trống khi tab đang là `all`. */
  status?: string;
  /** Cuối khoảng lọc, dạng `YYYY-MM-DD`. */
  toDate?: string;
  /** Một giá trị của `TRequestType`; bỏ trống khi không lọc theo loại. */
  type?: string;
}

/** Số đơn của từng tab, không phụ thuộc tab đang chọn. */
export type TRequestCounts = {
  readonly all: number;
  readonly pending: number;
  readonly processed: number;
};

export interface IRequestGetRequestCounts extends AppCallback<TRequestCounts> {
  fromDate?: string;
  toDate?: string;
  type?: string;
}

/** Một nhóm đơn theo tháng trong `SectionList`. */
export type TRequestSection = {
  readonly data: readonly TRequestItem[];
  /** Dạng `YYYY-MM`, dùng làm khoá của section. */
  readonly id: string;
  readonly month: number;
  readonly year: number;
};

/** Trạng thái của một bước trong luồng duyệt. */
export type TApprovalStepStatus =
  /** Mốc gửi đơn — không phải một cấp duyệt nên không kèm kết luận. */
  'created' | 'current' | 'done' | 'rejected' | 'waiting';

/** Một mốc trong luồng phê duyệt của đơn, kể cả mốc tạo đơn. */
export type TRequestApprovalStep = {
  /** Thời điểm bước này xảy ra; `undefined` khi chưa tới lượt. */
  readonly at?: string;
  readonly id: string;
  readonly name: string;
  /** Khoá i18n của vai trò, ví dụ "Quản lý trực tiếp". */
  readonly roleKey: string;
  readonly status: TApprovalStepStatus;
};

/** Một dòng trong nhật ký hoạt động của đơn. */
export type TRequestActivity = {
  readonly at: string;
  readonly id: string;
  /** Câu mô tả phụ bên dưới, thường là trạng thái đơn sau hành động đó. */
  readonly note: string;
  readonly title: string;
};

/** Loại tệp đính kèm — quyết định icon và màu ô tệp. */
export type TAttachmentKind = 'image' | 'pdf';

/** Một tệp người dùng đính kèm vào đơn. */
export type TRequestAttachment = {
  readonly id: string;
  readonly kind: TAttachmentKind;
  readonly name: string;
  /** Dung lượng đã định dạng sẵn, ví dụ `1.2 MB`. */
  readonly sizeLabel: string;
};

/**
 * Một dòng trong khối "Thông tin chung".
 *
 * Mỗi loại đơn có bộ trường riêng — đơn OT hỏi giờ làm thêm và loại OT, đơn
 * giải trình hỏi loại sự kiện — nên các trường là DỮ LIỆU chứ không phải bố
 * cục cứng trong component.
 */
export type TRequestDetailField = {
  readonly icon: IconName;
  readonly id: string;
  readonly labelKey: string;
  readonly value: string;
};

/** Toàn bộ nội dung màn Chi tiết đơn từ. */
export type TRequestDetail = {
  readonly activities: readonly TRequestActivity[];
  readonly approvals: readonly TRequestApprovalStep[];
  readonly attachments: readonly TRequestAttachment[];
  /** Mã đơn hiện dưới tiêu đề, ví dụ `LV20260916001`. */
  readonly code: string;
  readonly createdAt: string;
  readonly createdBy: string;
  /** Các dòng của khối "Thông tin chung", khác nhau theo loại đơn. */
  readonly fields: readonly TRequestDetailField[];
  readonly id: string;
  readonly status: TRequestStatus;
  readonly type: TRequestType;
};
