import type { IconName } from '@assets/icons';

/** Một dòng điều hướng trong nhóm menu. */
export type TProfileMenuItem = {
  readonly icon: IconName;
  readonly id: string;
  readonly subtitleKey: string;
  readonly titleKey: string;
};

/** Một nhóm menu có tiêu đề riêng. */
export type TProfileMenuSection = {
  readonly id: string;
  readonly items: readonly TProfileMenuItem[];
  readonly titleKey: string;
};

/** Người đang đăng nhập, hiển thị ở đầu màn Cá nhân. */
export type TProfileEmployee = {
  /** Rỗng khi hồ sơ chưa có dữ liệu này; lúc đó màn không dựng dòng đó. */
  readonly department: string;
  readonly fullName: string;
  /** Chữ viết tắt dựng sẵn cho ô avatar, ví dụ `NA`. */
  readonly initials: string;
  /** Rỗng khi hồ sơ chưa có dữ liệu này; lúc đó màn không dựng dòng đó. */
  readonly jobTitle: string;
};

/** Tô giá trị thành viên nhãn màu thay vì chữ thường. */
export type TInfoFieldBadge = 'danger' | 'neutral' | 'success' | 'warning';

/** Một trường thông tin chỉ đọc. */
export type TProfileInfoField = {
  /** `undefined` là giá trị hiện dạng chữ thường. */
  readonly badge?: TInfoFieldBadge;
  readonly icon: IconName;
  readonly id: string;
  /** Khoá i18n của nhãn đứng trên giá trị. */
  readonly labelKey: string;
  readonly value: string;
};

/** Một thẻ trên màn Thông tin công việc. */
export type TWorkspaceInfoCard = {
  readonly fields: readonly TProfileInfoField[];
  /** Biểu tượng trong ô vuông canh giữa ở đầu thẻ. */
  readonly icon: IconName;
  readonly id: string;
  /** `undefined` là thẻ không có tiêu đề riêng. */
  readonly titleKey?: string;
};

/** Một nhóm trường thông tin có tiêu đề riêng. */
export type TProfileInfoSection = {
  readonly fields: readonly TProfileInfoField[];
  readonly id: string;
  readonly titleKey: string;
};
