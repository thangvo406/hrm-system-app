import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

type Properties = {
  readonly month: number;
  readonly year: number;
};

/** Tiêu đề của một nhóm đơn trong danh sách, ví dụ "Tháng 9, 2026". */
function MonthHeader({ month, year }: Properties) {
  const { t } = useTranslation();

  return (
    <Text style={styles.title}>
      {t('requests.month_label', { month, year })}
    </Text>
  );
}

export default React.memo(MonthHeader);

const styles = StyleSheet.create({
  title: {
    backgroundColor: Colors.gray21,
    color: Colors.navy04,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    paddingBottom: ScaleSize(6),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(20),
  },
});
