import type { IconName } from '@assets/icons';

// Import thẳng file sibling chứ không qua '@utils': index.ts re-export chính
// file này, đi vòng qua đó là tạo circular import.
import * as PermissionUtils from './permissions';
import { SupportedLanguages } from '@hooks/language/schema';

const INITIALS_MIN_WORDS = 2;
const WHITESPACE_PATTERN = /\s+/u;

/**
 * Chữ viết tắt cho ô avatar: chữ cái đầu của tên đầu và tên cuối.
 * `Nguyễn Văn A` → `NA`, `Mai` → `M`, rỗng → chuỗi rỗng.
 */
export const getInitials = (fullName: string | undefined) => {
  const words = (fullName ?? '')
    .trim()
    .split(WHITESPACE_PATTERN)
    .filter(Boolean);
  const first = words.at(0)?.charAt(0) ?? '';
  const last =
    words.length >= INITIALS_MIN_WORDS ? (words.at(-1)?.charAt(0) ?? '') : '';

  return (first + last).toUpperCase();
};

/**
 * Tên ngôn ngữ luôn viết bằng chính ngôn ngữ đó nên không nằm trong file dịch:
 * người đang xem giao diện tiếng Hàn mà muốn đổi sang tiếng Việt vẫn phải nhận
 * ra dòng "Tiếng Việt".
 */
export const LANGUAGE_LABELS: Readonly<Record<SupportedLanguages, string>> = {
  [SupportedLanguages.EN_EN]: 'English',
  [SupportedLanguages.KO_KR]: '한국어',
  [SupportedLanguages.VI_VN]: 'Tiếng Việt',
};

/**
 * Cờ đi kèm mỗi ngôn ngữ trong bộ chọn. Tiếng Anh gắn cờ Anh chứ không phải
 * cờ Mỹ: bản dịch `en-EN.json` đang viết theo lối Anh ("Help centre").
 */
export const LANGUAGE_FLAGS: Readonly<Record<SupportedLanguages, IconName>> = {
  [SupportedLanguages.EN_EN]: 'ic_flag_gb',
  [SupportedLanguages.KO_KR]: 'ic_flag_kr',
  [SupportedLanguages.VI_VN]: 'ic_flag_vn',
};

/** Thứ tự liệt kê trong bộ chọn ngôn ngữ, bắt đầu từ ngôn ngữ mặc định. */
export const LANGUAGE_OPTIONS: readonly SupportedLanguages[] = [
  SupportedLanguages.VI_VN,
  SupportedLanguages.EN_EN,
  SupportedLanguages.KO_KR,
];

/**
 * `true` khi máy đang cho phép hiện thông báo đẩy. Đọc quyền thật chứ không giữ
 * cờ riêng: người dùng có thể tắt thông báo ở cài đặt máy mà app không hay biết.
 */
export const isNotificationEnabled = async () => {
  const { status } = await PermissionUtils.checkNotifications();
  return status === PermissionUtils.RESULTS.GRANTED;
};
