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
