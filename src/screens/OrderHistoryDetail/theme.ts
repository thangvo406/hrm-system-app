import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';

export const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';
export const EMPTY_VALUE = '-';
export const PRODUCT_PREVIEW_COUNT = 3;
export const SECTION_ICON_SIZE = ScaleSize(40);
export const STATUS_PENDING = 'PENDING';

type StatusTone = {
  readonly background: string;
  readonly color: string;
};

// Badge colours follow the order state: completed → green, pending → amber,
// anything else → neutral grey.
export const getStatusTone = (
  isSuccess: boolean,
  status?: string,
): StatusTone => {
  if (isSuccess) {
    return { background: Colors.green09, color: Colors.green08 };
  }
  if (status === STATUS_PENDING) {
    return { background: Colors.yellow04, color: Colors.yellow03 };
  }
  return { background: Colors.gray21, color: Colors.gray17 };
};

// Styles reused by every section of this screen.
export const sharedStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(12),
    marginBottom: ScaleSize(10),
    marginHorizontal: ScaleSize(12),
    padding: ScaleSize(16),
  },
  divider: {
    backgroundColor: Colors.gray19,
    height: 1,
  },
  label: {
    color: Colors.gray1,
    fontSize: ScaleSize(12),
  },
});
