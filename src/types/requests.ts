/** Loại đơn nhân viên có thể gửi. Nghỉ ốm đã bị bỏ khỏi luồng này. */
export type TRequestType = 'early_leave' | 'late_arrival' | 'leave';

/** Kết luận duyệt của một đơn. */
export type TRequestStatus = 'approved' | 'pending' | 'rejected';

/** Nhóm đơn hiển thị trên hàng tab ở đầu danh sách. */
export type TRequestTab = 'all' | 'pending' | 'processed';

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
