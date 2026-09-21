import type { TAttendanceStatus } from '@type/attendance';

import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const DOT_SIZE = ScaleSize(8);

/** Màu nền, màu chữ/chấm và nhãn của từng kết luận chấm công. */
const STATUS_STYLES: Record<
  TAttendanceStatus,
  {
    readonly background: string;
    readonly foreground: string;
    readonly labelKey: string;
  }
> = {
  early_leave: {
    background: Colors.yellow04,
    foreground: Colors.orange02,
    labelKey: 'attendance_histories.status_early',
  },
  late: {
    background: Colors.yellow04,
    foreground: Colors.orange02,
    labelKey: 'attendance_histories.status_late',
  },
  missing: {
    background: Colors.gray21,
    foreground: Colors.gray24,
    labelKey: 'attendance_histories.status_missing',
  },
  on_time: {
    background: Colors.green06,
    foreground: Colors.green08,
    labelKey: 'attendance_histories.status_on_time',
  },
};

type Properties = {
  readonly status: TAttendanceStatus;
};

/** Nhãn kết luận chấm công của một ngày, dạng chấm màu + chữ. */
function StatusBadge({ status }: Properties) {
  const { t } = useTranslation();
  const tone = STATUS_STYLES[status];

  return (
    <View style={[styles.container, { backgroundColor: tone.background }]}>
      <View style={[styles.dot, { backgroundColor: tone.foreground }]} />
      <Text
        numberOfLines={1}
        style={[styles.label, { color: tone.foreground }]}
      >
        {t(tone.labelKey)}
      </Text>
    </View>
  );
}

export default React.memo(StatusBadge);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(6),
    paddingHorizontal: ScaleSize(5),
    paddingVertical: ScaleSize(3),
  },
  dot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  label: {
    fontSize: ScaleSize(10),
    fontWeight: '600',
  },
});
