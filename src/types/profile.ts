import type { IconName } from '@assets/icons';

/** Một ô trong dải liên hệ của thẻ danh tính. */
export type TProfileContact = {
  readonly icon: IconName;
  readonly id: string;
  /** Khoá i18n của dòng nhãn bên dưới giá trị. */
  readonly labelKey: string;
  readonly value: string;
};

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
  readonly contacts: readonly TProfileContact[];
  readonly department: string;
  readonly fullName: string;
  /** Chữ viết tắt dựng sẵn cho ô avatar, ví dụ `NA`. */
  readonly initials: string;
  readonly jobTitle: string;
};
