import isEmpty from 'lodash/isEmpty';

const getImageSource = (source: any, defaultSource?: any) => {
  if (source && typeof source === 'string' && source.startsWith('http')) {
    return { uri: source };
  }
  if (
    source &&
    (typeof source === 'number' ||
      (typeof source === 'object' &&
        typeof source?.uri === 'string' &&
        source?.uri?.startsWith('http')))
  ) {
    return source;
  }
  if (defaultSource) {
    return defaultSource;
  }
  return null;
};

const mergeStyle = (style: any) => {
  return isEmpty(style)
    ? {}
    : Array.isArray(style)
      ? style.reduce((obj, item) => (obj = { ...obj, ...item }), {})
      : style;
};
const isPhoneNumber = (value: string) => {
  const PHONE_REGEX = /^(010|840)-[0-9]{4}-[0-9]{4}$/;
  return PHONE_REGEX.test(value);
};
const isNumber = (text: string) => {
  const reg = new RegExp(String.raw`^\d+$`);
  return reg.test(text);
};

const isImageUrl = (url: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = url?.split('.').pop()?.toLowerCase() || '';
  return imageExtensions.includes(extension);
};

export const isEmail = (value: string) => {
  if (!value) {
    return false;
  }
  const emailRegex =
    /^(([^\s"(),.:;<>@[\]]+(\.[^\s"(),.:;<>@[\]]+)*)|(".+"))@(([^\s"(),.:;<>@[\]]+\.)+[^\s"(),.:;<>@[\]]{2,})$/i;
  return emailRegex.test(value);
};

export const ValidateUtils = {
  getImageSource,
  mergeStyle,
  isEmail,
  isNumber,
  isImageUrl,
  isPhoneNumber,
};
