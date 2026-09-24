import type { IconName } from '@assets/icons';
import type { TAttendanceHistoryFilter } from '@type/attendance';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { AttendanceUtils } from '@utils';
import { Colors } from '@constants';
import { EAttendanceStatus } from '@constants/config';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const CHIP_ICON_SIZE = ScaleSize(17);

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
      {FILTERS.map(filter => {
        const isActive = filter.value === value;
        return (
          <AppButton
            key={filter.value}
            onPress={() => onChange(filter.value)}
            style={[styles.chip, isActive && styles.chipActive]}
            testID={`AttendanceHistoriesFilter_${filter.value}`}
          >
            <Image
              color={isActive ? Colors.white : filter.iconColor}
              height={CHIP_ICON_SIZE}
              name={filter.icon}
              type="svg"
              width={CHIP_ICON_SIZE}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(filter.labelKey)}
            </Text>
          </AppButton>
        );
      })}
    </ScrollView>
  );
}

export default React.memo(FilterChips);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray27,
    borderRadius: ScaleSize(22),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  chipActive: {
    backgroundColor: Colors.blue02,
    borderColor: Colors.blue02,
  },
  container: {
    // ScrollView ngang mà không chốt `flexGrow: 0` thì nó ăn hết chiều cao còn
    // lại của cha, đẩy danh sách bên dưới ra khỏi màn hình.
    flexGrow: 0,
    marginTop: ScaleSize(14),
  },
  content: {
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.white,
  },
});
