import type { IconName } from '@assets/icons';
import type { TAttendanceHistoryFilter } from '@type/attendance';

import FilterChip from './FilterChip';
import React from 'react';
import { AttendanceUtils } from '@utils';
import { Colors } from '@constants';
import { EAttendanceStatus } from '@constants/config';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const FILTERS: readonly {
  readonly icon: IconName;
  /** Màu icon khi chip KHÔNG được chọn; chip đang chọn thì icon trắng. */
  readonly iconColor: string;
  readonly labelKey: string;
  readonly value: TAttendanceHistoryFilter;
}[] = [
  {
    icon: 'ic_grid',
    iconColor: Colors.gray17,
    labelKey: AttendanceUtils.FILTER_LABEL_KEYS.all,
    value: 'all',
  },
  {
    icon: 'ic_check',
    iconColor: Colors.green08,
    labelKey: AttendanceUtils.FILTER_LABEL_KEYS[EAttendanceStatus.FULL_TIME],
    value: EAttendanceStatus.FULL_TIME,
  },
  {
    icon: 'ic_clock',
    iconColor: Colors.yellow03,
    labelKey: AttendanceUtils.FILTER_LABEL_KEYS[EAttendanceStatus.LATE],
    value: EAttendanceStatus.LATE,
  },
  {
    icon: 'ic_minus_circle',
    iconColor: Colors.gray24,
    labelKey: AttendanceUtils.FILTER_LABEL_KEYS[EAttendanceStatus.EARLY_LEAVE],
    value: EAttendanceStatus.EARLY_LEAVE,
  },
];

type Properties = {
  readonly onChange: (filter: TAttendanceHistoryFilter) => void;
  readonly value: TAttendanceHistoryFilter;
};

/** Hàng chip lọc danh sách, cuộn ngang khi không đủ bề ngang. */
function FilterChips({ onChange, value }: Properties) {
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {FILTERS.map(filter => (
        <FilterChip
          key={filter.value}
          icon={filter.icon}
          iconColor={filter.iconColor}
          isActive={filter.value === value}
          label={t(filter.labelKey)}
          onChange={onChange}
          testID={`AttendanceHistoriesFilter_${filter.value}`}
          value={filter.value}
        />
      ))}
    </ScrollView>
  );
}

export default React.memo(FilterChips);

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginTop: ScaleSize(14),
  },
  content: {
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
  },
});
