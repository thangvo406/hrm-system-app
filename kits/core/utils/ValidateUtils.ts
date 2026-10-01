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
  if (isEmpty(style)) {
    return {};
  }
  if (!Array.isArray(style)) {
    return style;
  }
  const merged = {};
  for (const item of style) {
    Object.assign(merged, item);
  }
  return merged;
};
const isPhoneNumber = (value: string) => {
  const PHONE_REGEX = /^01\d-?\d{3,4}-?\d{4}$/;
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

function getFileName(uri: string): string {
  if (!uri?.trim()) {
    return '';
  }

  try {
    // Handle file:// URIs
    if (uri.startsWith('file://')) {
      const path = uri.replace('file://', '');
      const fileName = path.split('/').pop();
      return fileName || '';
    }

    // Handle content:// URIs
    if (uri.startsWith('content://')) {
      const path = uri.replace('content://', '');
      const fileName = path.split('/').pop();
      return fileName || '';
    }

    // Handle http/https URIs
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      const path = uri.replace('http://', '').replace('https://', '');
      const fileName = path.split('/').pop();
      return fileName || '';
    }

    // Handle other URI schemes or plain paths
    const fileName = uri.split('/').pop();
    return fileName || '';
  } catch {
    return '';
  }
}

const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return 'n/a';
  }
  const i = Number.parseInt(
    Math.floor(Math.log(bytes) / Math.log(1e6)).toString(),
    10,
  );
  // if (i == 0) {
  //    return bytes + ' ' + sizes[i];
  // }
  return {
    value: (bytes / Math.pow(1e6, i)).toFixed(1),
    unit: sizes[i],
  };
};

const getExtensionFile = (link: string) => {
  const s = link?.split('/');
  const lastPart = s?.at(-1);
  if (!lastPart) {
    return '';
  }

  const files = lastPart.split('.');
  if (files.length > 1) {
    return files?.at(-1) || '';
  }
  return '';
};

const checkValidFile = (data: any) => {
  const size = bytesToSize(data?.size);
  let isLimitSize = true;
  if (size != 'n/a' && typeof size == 'object' && 'unit' in size) {
    isLimitSize =
      size.unit == 'KB' ? Number.parseFloat(size.value) >= 100 : false;
  }
  if (isLimitSize) {
    return {
      type: 'limit',
    };
  }
  return null;
  const extension = getExtensionFile(data?.name);
  // PPT, PPTX, DOC, DOCX, XLS, XLSX, JPG, PNG, JPEG, PDF, ZIP, RAR, MP3, MP4
  if (
    !extension ||
    ![
      'ppt',
      'pptx',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'jpg',
      'png',
      'jpeg',
      'pdf',
      'zip',
      'rar',
      'mp3',
      'mp4',
    ].includes(extension?.toLowerCase?.())
  ) {
    return {
      type: 'extension',
    };
  }
  return null;
};

export const ValidateUtils = {
  getImageSource,
  mergeStyle,
  isEmail,
  getFileName,
  checkValidFile,
  getExtensionFile,
  isNumber,
  isImageUrl,
  isPhoneNumber,
};
