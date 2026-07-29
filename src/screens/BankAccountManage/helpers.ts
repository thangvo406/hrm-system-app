const LAST_DIGITS = 4;
const MASK_GROUP = '••••';
const YEAR_SHORT_LENGTH = 2;

const digitsOnly = (value: number | string = '') =>
  `${value}`.replaceAll(/\D/g, '');

/** Server values already arrive masked; only pad plain numbers ourselves. */
export const maskFullNumber = (displayNumber = '') => {
  if (displayNumber.length === 0) {
    return '';
  }
  if (/[*•]/.test(displayNumber)) {
    return displayNumber;
  }
  const digits = digitsOnly(displayNumber);
  return `${MASK_GROUP} ${MASK_GROUP} ${MASK_GROUP} ${digits.slice(-LAST_DIGITS)}`;
};

/** Compact form used on the card thumbnail: "•••• 1234". */
export const maskShortNumber = (displayNumber = '') => {
  const digits = digitsOnly(displayNumber);
  if (digits.length === 0) {
    return MASK_GROUP;
  }
  return `${MASK_GROUP} ${digits.slice(-LAST_DIGITS)}`;
};

/** "9" + "2027" -> "09/27". Returns undefined when the card has no expiry. */
export const formatExpiry = (
  month?: number | string,
  year?: number | string,
) => {
  const monthDigits = digitsOnly(month);
  const yearDigits = digitsOnly(year);
  if (monthDigits.length === 0 || yearDigits.length === 0) {
    return undefined;
  }
  return `${monthDigits.padStart(YEAR_SHORT_LENGTH, '0')}/${yearDigits.slice(-YEAR_SHORT_LENGTH)}`;
};

/** Initials for the bank thumbnail: "Vietcombank" -> "VI", "국민 은행" -> "국은". */
export const getInitials = (displayName = '') => {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  if (words.length === 1) {
    return words[0].slice(0, YEAR_SHORT_LENGTH).toUpperCase();
  }
  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
};

export const isActiveStatus = (status = '') =>
  status.toUpperCase() === 'ACTIVE';
