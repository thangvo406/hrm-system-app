import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';

const GLOBE_ICON_SIZE = ScaleSize(18);
const CHEVRON_ICON_SIZE = ScaleSize(16);

/** Đủ để viên trắng tách khỏi nền sóng, chưa tới mức thành một thẻ nổi. */
const SHADOW_OPACITY = 0.12;

type Properties = {
  readonly label: string;
  readonly onPress: () => void;
};

function LanguagePill({ label, onPress }: Properties) {
  return (
    <AppButton onPress={onPress} style={styles.pill} testID="ProfileLanguage">
      <Image
        color={Colors.blue02}
        height={GLOBE_ICON_SIZE}
        name="ic_globe"
        type="svg"
        width={GLOBE_ICON_SIZE}
      />

      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>

      <Image
        color={Colors.navy04}
        height={CHEVRON_ICON_SIZE}
        name="ic_chevron_down"
        type="svg"
        width={CHEVRON_ICON_SIZE}
      />
    </AppButton>
  );
}

export default React.memo(LanguagePill);

const styles = StyleSheet.create({
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  pill: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(22),
    elevation: 3,
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(9),
    shadowColor: Colors.navy04,
    shadowOffset: { height: ScaleSize(2), width: 0 },
    shadowOpacity: SHADOW_OPACITY,
    shadowRadius: ScaleSize(6),
  },
});
