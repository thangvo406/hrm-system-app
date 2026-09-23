import type { IconName } from '@assets/icons';
import type { TLeaveDuration } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

const DURATIONS: readonly {
  readonly icon: IconName;
  readonly labelKey: string;
  readonly value: TLeaveDuration;
}[] = [
  {
    icon: 'ic_sun',
    labelKey: 'create_request.duration_full_day',
    value: 'full_day',
  },
  {
    icon: 'ic_sunrise',
    labelKey: 'create_request.duration_morning',
    value: 'morning',
  },
  {
    icon: 'ic_sunset',
    labelKey: 'create_request.duration_afternoon',
    value: 'afternoon',
  },
];

type Properties = {
  readonly onChange: (duration: TLeaveDuration) => void;
  readonly value: TLeaveDuration;
};

/** Chọn nghỉ cả ngày hay nửa buổi; đổi ở đây thì số ngày tính lại ngay. */
function DurationTabs({ onChange, value }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.label}>{t('create_request.duration_label')}</Text>

      <View style={styles.row}>
        {DURATIONS.map(duration => {
          const isActive = duration.value === value;

          return (
            <AppButton
              key={duration.value}
              onPress={() => {
                onChange(duration.value);
              }}
              style={[styles.tab, isActive && styles.tabActive]}
              testID={`CreateRequestDuration_${duration.value}`}
            >
              <Image
                color={isActive ? Colors.blue02 : Colors.gray17}
                height={ICON_SIZE}
                name={duration.icon}
                type="svg"
                width={ICON_SIZE}
              />
              <Text
                numberOfLines={1}
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {t(duration.labelKey)}
              </Text>
            </AppButton>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(DurationTabs);

const styles = StyleSheet.create({
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(8),
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  tab: {
    alignItems: 'center',
    backgroundColor: Colors.gray21,
    borderColor: 'transparent',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(6),
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(6),
    paddingVertical: ScaleSize(14),
  },
  tabActive: {
    backgroundColor: Colors.blue07,
    borderColor: Colors.blue06,
  },
  tabLabel: {
    color: Colors.gray17,
    flexShrink: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.blue02,
    fontWeight: '700',
  },
});
