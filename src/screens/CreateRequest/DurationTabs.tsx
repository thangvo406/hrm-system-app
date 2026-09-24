import type { IconName } from '@assets/icons';
import type { TLeaveDuration } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

// Tỉ lệ lấy theo thiết kế: vòng tròn ≈ 0.54 chiều cao pill, icon ≈ 0.58 đường
// kính vòng tròn. `ScaleSize` co theo chiều rộng máy (baseline 414pt) nên tỉ lệ
// giữ nguyên trên mọi máy, chỉ cần vừa ở baseline là vừa ở mọi nơi.
const CIRCLE_SIZE = ScaleSize(28);
const ICON_SIZE = ScaleSize(16);
/** Vệt sáng xanh quanh pill đang chọn. */
const GLOW_RADIUS = ScaleSize(8);
const GLOW_OPACITY = 0.25;
const GLOW_ELEVATION = 2;

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
              <View style={[styles.circle, isActive && styles.circleActive]}>
                <Image
                  color={isActive ? Colors.blue02 : Colors.gray17}
                  height={ICON_SIZE}
                  name={duration.icon}
                  type="svg"
                  width={ICON_SIZE}
                />
              </View>
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
  // Vòng tròn nền của icon. Nền đậm hơn nền pill một bậc để vòng tròn đọc
  // được, chứ không chỉ là một khoảng trống quanh icon.
  circle: {
    alignItems: 'center',
    backgroundColor: Colors.gray19,
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    width: CIRCLE_SIZE,
  },
  circleActive: {
    backgroundColor: Colors.blue06,
  },
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
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    // Ba pill chia đều một hàng nên chữ là thứ hẹp nhất; đệm ngang để mỏng để
    // nhãn dài nhất ("Buổi chiều") còn đủ chỗ trên một dòng.
    paddingHorizontal: ScaleSize(6),
    paddingVertical: ScaleSize(10),
  },
  tabActive: {
    backgroundColor: Colors.blue07,
    borderColor: Colors.blue08,
    elevation: GLOW_ELEVATION,
    shadowColor: Colors.blue08,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: GLOW_OPACITY,
    shadowRadius: GLOW_RADIUS,
  },
  tabLabel: {
    color: Colors.gray17,
    flexShrink: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.blue02,
    fontWeight: '700',
  },
});
