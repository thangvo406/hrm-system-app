import AppButton from '@components/AppButton';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type Properties<T extends string> = {
  readonly labelKey: string;
  /** Khoá i18n của từng lựa chọn, tra theo giá trị. */
  readonly labels: Readonly<Record<T, string>>;
  readonly onChange: (option: T) => void;
  readonly options: readonly T[];
  readonly testIDPrefix: string;
  readonly value: T;
};

/** Một nhóm chip chọn-một trong bộ lọc, có tiêu đề riêng và tự xuống dòng. */
function FilterChipGroup<T extends string>({
  labelKey,
  labels,
  onChange,
  options,
  testIDPrefix,
  value,
}: Properties<T>) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t(labelKey)}</Text>

      <View style={styles.chips}>
        {options.map(option => {
          const isActive = option === value;

          return (
            <AppButton
              key={option}
              onPress={() => {
                onChange(option);
              }}
              style={[styles.chip, isActive && styles.chipActive]}
              testID={`${testIDPrefix}_${option}`}
            >
              <Text
                numberOfLines={1}
                style={[styles.chipLabel, isActive && styles.chipLabelActive]}
              >
                {t(labels[option])}
              </Text>
            </AppButton>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(FilterChipGroup) as typeof FilterChipGroup;

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.gray21,
    borderRadius: ScaleSize(10),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(12),
  },
  chipActive: {
    backgroundColor: Colors.blue02,
  },
  chipLabel: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  chipLabelActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  // Chip tự rớt dòng: nhãn tiếng Việt dài ngắn khác nhau, ép một hàng thì chữ
  // bị cắt trên máy hẹp.
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(10),
  },
  container: {
    gap: ScaleSize(12),
    marginTop: ScaleSize(24),
  },
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
