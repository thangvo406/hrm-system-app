import type { IconName } from '@assets/icons';
import type { TRequestType } from '@type/requests';

import { Colors } from '@constants';

/**
 * Bộ nhận diện của từng loại đơn: icon, màu mực và nền nhạt phía sau. Dùng
 * chung cho thẻ lọc ở đầu màn và ô icon của mỗi dòng đơn, để cùng một loại
 * đơn luôn hiện cùng một màu ở mọi chỗ.
 */
export const REQUEST_TYPE_STYLES: Record<
  TRequestType,
  {
    readonly hintKey: string;
    readonly icon: IconName;
    readonly ink: string;
    readonly labelKey: string;
    readonly tint: string;
  }
> = {
  early_leave: {
    hintKey: 'requests.type_early_leave_hint',
    icon: 'ic_sign_out',
    ink: Colors.purple03,
    labelKey: 'requests.type_early_leave',
    tint: Colors.purple04,
  },
  late_arrival: {
    hintKey: 'requests.type_late_arrival_hint',
    icon: 'ic_clock',
    ink: Colors.green12,
    labelKey: 'requests.type_late_arrival',
    tint: Colors.green13,
  },
  leave: {
    hintKey: 'requests.type_leave_hint',
    icon: 'ic_calendar',
    ink: Colors.blue02,
    labelKey: 'requests.type_leave',
    tint: Colors.blue06,
  },
};

/** Thứ tự các thẻ lọc, trái sang phải. */
export const REQUEST_TYPE_ORDER: readonly TRequestType[] = [
  'leave',
  'late_arrival',
  'early_leave',
];
