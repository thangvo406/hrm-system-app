import type { TAttendanceInfo, TAttendanceLogEntry } from '@type/attendance';

import LogRow from './LogRow';
import React from 'react';
import WorkedTotal from './WorkedTotal';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CARD_SHADOW_OFFSET = ScaleSize(8);
const CARD_SHADOW_OPACITY = 0.06;
const CARD_ELEVATION = 3;

type Properties = {
  readonly attendanceInfo: TAttendanceInfo;
  readonly entries: readonly TAttendanceLogEntry[];
};

/** Nhật ký chấm công trong ngày kèm tổng giờ đã làm. */
function TodayLog({ attendanceInfo, entries }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('attendance.log.title')}</Text>
        <WorkedTotal
          checkedInAt={attendanceInfo.checkedInAt}
          checkedOutAt={attendanceInfo.checkedOutAt}
        />
      </View>

      {entries.map((entry, index) => (
        <View key={entry.id}>
          {index > 0 && <View style={styles.divider} />}
          <LogRow entry={entry} />
        </View>
      ))}
    </View>
  );
}

export default React.memo(TodayLog);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(20),
    elevation: CARD_ELEVATION,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(12),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: ScaleSize(16),
  },
  divider: {
    backgroundColor: Colors.gray27,
    height: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingTop: ScaleSize(4),
  },
  title: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
