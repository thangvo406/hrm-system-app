import type { IconName } from '@assets/icons';
import type { TRequestType } from '@type/requests';

import { Colors } from '@constants';

export type TRequestTypeStyle = {
  readonly icon: IconName;
  readonly ink: string;
  readonly labelKey: string;
  readonly tint: string;
};

export const REQUEST_TYPE_STYLES: Record<TRequestType, TRequestTypeStyle> = {
  attendance_explanation: {
    icon: 'ic_document',
    ink: Colors.teal01,
    labelKey: 'requests.type_attendance_explanation',
    tint: Colors.teal02,
  },
  early_leave: {
    icon: 'ic_sign_out',
    ink: Colors.purple03,
    labelKey: 'requests.type_early_leave',
    tint: Colors.purple04,
  },
  late_arrival: {
    icon: 'ic_clock',
    ink: Colors.green12,
    labelKey: 'requests.type_late_arrival',
    tint: Colors.green13,
  },
  leave: {
    icon: 'ic_calendar',
    ink: Colors.blue02,
    labelKey: 'requests.type_leave',
    tint: Colors.blue06,
  },
  overtime: {
    icon: 'ic_clock',
    ink: Colors.yellow03,
    labelKey: 'requests.type_overtime',
    tint: Colors.yellow06,
  },
};

/** Thứ tự các thẻ lọc, trái sang phải rồi xuống dòng. */
export const REQUEST_TYPE_ORDER: readonly TRequestType[] = [
  'leave',
  'late_arrival',
  'early_leave',
  'overtime',
  'attendance_explanation',
];
