import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ARROW_SIZE = ScaleSize(18);

type Properties = {
  readonly month: number;
  readonly onPickMonth: () => void;
  readonly onPressNextMonth: () => void;
  readonly onPressPreviousMonth: () => void;
  readonly year: number;
};

/** Tháng đang xem: hai mũi tên lùi/tới và nhãn tháng mở bộ chọn tháng. */
function MonthSelector({
  month,
  onPickMonth,
  onPressNextMonth,
  onPressPreviousMonth,
  year,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppButton
        onPress={onPressPreviousMonth}
        style={styles.arrow}
        testID="AttendanceHistoriesPreviousMonth"
      >
        <Image
          color={Colors.gray17}
          height={ARROW_SIZE}
          name="ic_arrow_left_gray"
          type="svg"
          width={ARROW_SIZE}
        />
      </AppButton>

      <AppButton
        onPress={onPickMonth}
        style={styles.label}
        testID="AttendanceHistoriesPickMonth"
      >
        <Text numberOfLines={1} style={styles.labelText}>
          {t('attendance_histories.month_label', { month, year })}
        </Text>
      </AppButton>

      <AppButton
        onPress={onPressNextMonth}
        style={styles.arrow}
        testID="AttendanceHistoriesNextMonth"
      >
        <Image
          color={Colors.gray17}
          height={ARROW_SIZE}
          name="ic_chevron_right"
          type="svg"
          width={ARROW_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(MonthSelector);

const styles = StyleSheet.create({
  arrow: {
    padding: ScaleSize(6),
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(18),
    justifyContent: 'center',
    marginTop: ScaleSize(14),
  },
  label: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: ScaleSize(6),
    paddingVertical: ScaleSize(4),
  },
  labelText: {
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
