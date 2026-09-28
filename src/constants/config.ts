import { Environment } from './environment';

export const PASSWORD_MIN_LENGTH = 6;
export const URL_TRANSLATION = `${Environment.DOMAIN_CDN}uploads/{{lng}}.json`;
export const APP_CONFIG_URL = `${Environment.DOMAIN_CDN}uploads/app-config.json`;

export enum EDayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const EMPTY_VALUE = '-';

/** Giờ hành chính dự phòng khi chưa tải được văn phòng nào từ server. */
export const OFFICE_SHIFT = {
  END_AT: '18:00',
  START_AT: '09:00',
};

export const MAP_REGION_DELTA = 0.0012;

export enum EAttendanceStatus {
  LATE = 'LATE',
  EARLY_LEAVE = 'EARLY_LEAVE',
  ABSENT = 'ABSENT',
  IN_PROGRESS = 'IN_PROGRESS',
  FULL_TIME = 'FULL_TIME',
}

export enum EAttendanceType {
  CHECK_OUT = 'CHECK_OUT',
  CHECK_IN = 'CHECK_IN',
}

export enum EAttendanceMode {
  GPS = 'GPS',
  QR_CODE = 'QR_CODE',
}

export const HISLOP_BUTTON = { top: 10, bottom: 10, left: 10, right: 10 };

export const APP_LANGUAGE_KEY = 'APP_LANGUAGE_KEY' as const;
export const NEED_CONTRIBUTION_KEY = 'NEED_CONTRIBUTION_KEY' as const;
export const INIT_SCREEN_START_UP_KEY = 'INIT_SCREEN_START_UP_KEY' as const;
export const CODE_PUSH_LAST_RESTART_HASH_KEY =
  'CODE_PUSH_LAST_RESTART_HASH_KEY' as const;
export const REMEMBERED_EMAIL_KEY = 'REMEMBERED_EMAIL_KEY' as const;
