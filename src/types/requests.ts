/** Loại đơn nhân viên có thể gửi. Nghỉ ốm đã bị bỏ khỏi luồng này. */
export type TRequestType =
  | 'attendance_explanation'
  | 'early_leave'
  | 'late_arrival'
  | 'leave'
  | 'overtime';

/** Kết luận duyệt của một đơn. */
export type TRequestStatus = 'approved' | 'pending' | 'rejected';

/** Nhóm đơn hiển thị trên hàng tab ở đầu danh sách. */
export type TRequestTab = 'all' | 'pending' | 'processed';

/**
 * Trạng thái đang lọc. Hàng tab và nhóm "Trạng thái" trong bộ lọc cùng ghi vào
 * MỘT trường này, nên nó gộp cả `processed` (nhóm rộng của tab) lẫn từng kết
 * luận cụ thể (lựa chọn hẹp hơn trong bộ lọc).
 */
export type TRequestStatusFilter = 'all' | 'processed' | TRequestStatus;

/** Loại đơn đang lọc; `all` là không lọc theo loại. */
export type TRequestTypeFilter = 'all' | TRequestType;

/** Khoảng thời gian đang lọc. `custom` là tự chọn ngày trên lịch. */
export type TRequestPeriod =
  | 'all'
  | 'custom'
  | 'last_3_months'
  | 'this_month'
  | 'this_week';

/** Khoảng ngày tự chọn, hai đầu đều dạng `YYYY-MM-DD`. */
export type TRequestDateRange = {
  readonly from: string;
  readonly to: string;
};

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

/** Nội dung đơn đang soạn ở màn tạo đơn. */
export type TCreateRequestDraft = {
  readonly duration: TLeaveDuration;
  /** Dạng `YYYY-MM-DD`. */
  readonly endDate: string;
  readonly kind: TLeaveKind;
  readonly reason: string;
  /** Dạng `YYYY-MM-DD`. */
  readonly startDate: string;
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

/** Một nhóm đơn theo tháng trong `SectionList`. */
export type TRequestSection = {
  readonly data: readonly TRequestItem[];
  /** Dạng `YYYY-MM`, dùng làm khoá của section. */
  readonly id: string;
  readonly month: number;
  readonly year: number;
};

/** Trạng thái của một bước trong luồng duyệt. */
export type TApprovalStepStatus = 'current' | 'done' | 'rejected' | 'waiting';

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

/** Một tệp người dùng đính kèm vào đơn. */
export type TRequestAttachment = {
  readonly id: string;
  readonly name: string;
  /** Dung lượng đã định dạng sẵn, ví dụ `1.2 MB`. */
  readonly sizeLabel: string;
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
  readonly dayCount: number;
  readonly duration: TLeaveDuration;
  /** `undefined` khi đơn chỉ áp dụng cho đúng một ngày. */
  readonly endDate?: string;
  readonly id: string;
  readonly reason: string;
  /** Số ngày phép còn lại sau khi trừ đơn này. */
  readonly remainingDays: number;
  readonly startDate: string;
  readonly status: TRequestStatus;
  readonly type: TRequestType;
};
