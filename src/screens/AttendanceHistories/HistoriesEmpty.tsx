import type { TAttendanceHistoryFilter } from '@type/attendance';

import EmptyView from '@components/EmptyView';
import React from 'react';
import { AttendanceUtils } from '@utils';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ILLUSTRATION_SIZE = ScaleSize(200);
// Chốt bề ngang dòng mô tả để nó xuống dòng cân đối ở giữa, thay vì chạy sát
// hai mép rồi ngắt ở chỗ ngẫu nhiên.
const DESCRIPTION_WIDTH = ScaleSize(280);
const DESCRIPTION_LINE_HEIGHT = ScaleSize(21);

const ALL_FILTER = 'all';

type Properties = {
  readonly filter: TAttendanceHistoryFilter;
};

function HistoriesEmpty({ filter }: Properties) {
  const { t } = useTranslation();

  const labelKeys: Partial<Record<TAttendanceHistoryFilter, string>> =
    AttendanceUtils.FILTER_LABEL_KEYS;
  const filterLabelKey = labelKeys[filter];
  const isFiltered = filter !== ALL_FILTER && !!filterLabelKey;

  const title = t(
    isFiltered
      ? 'attendance_histories.empty.filtered.title'
      : 'attendance_histories.empty.all.title',
  );
  const description = isFiltered
    ? t('attendance_histories.empty.filtered.description', {
        filter: t(filterLabelKey),
      })
    : t('attendance_histories.empty.all.description');

  return (
    <EmptyView
      icon="ic_attendance_histories_empty"
      renderDesc={() => (
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
      size={ILLUSTRATION_SIZE}
      style={styles.container}
      type="image"
    />
  );
}

export default React.memo(HistoriesEmpty);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(24),
  },
  description: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    lineHeight: DESCRIPTION_LINE_HEIGHT,
    marginTop: ScaleSize(8),
    maxWidth: DESCRIPTION_WIDTH,
    textAlign: 'center',
  },
  texts: {
    alignItems: 'center',
    marginTop: ScaleSize(20),
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
});
