import type { IconName } from '@assets/icons';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { ACCENT_INK, ACCENT_SURFACE, MUTED_INK, TITLE_INK } from './tokens';

const CHIP_SIZE = ScaleSize(36);
const ICON_SIZE = ScaleSize(20);
const CHEVRON_SIZE = ScaleSize(18);
const HALF_TURN = 180;
const ROTATION_DURATION = 200;

type Properties = {
  readonly actionLabel?: string;
  readonly count: number;
  readonly expanded?: boolean;
  readonly icon: IconName;
  readonly testID?: string;
  readonly title: string;
  readonly onPress?: () => void;
  readonly onPressAction?: () => void;
};

function SectionHeader({
  actionLabel,
  count,
  expanded = true,
  icon,
  testID,
  title,
  onPress,
  onPressAction,
}: Properties) {
  const progress = useDerivedValue(() =>
    withTiming(expanded ? 1 : 0, { duration: ROTATION_DURATION }),
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * HALF_TURN}deg` }],
  }));

  return (
    <AppButton
      activeOpacity={1}
      onPress={onPress}
      style={styles.header}
      testID={`${testID}-toggle`}
    >
      <View style={styles.chip}>
        <Image
          color={ACCENT_INK}
          height={ICON_SIZE}
          name={icon}
          type="svg"
          width={ICON_SIZE}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.countPill}>
        <Text style={styles.countLabel}>{count}</Text>
      </View>
      <View style={styles.spacer} />
      {!!actionLabel && (
        <AppButton onPress={onPressAction} testID={testID}>
          <Text style={styles.action}>{`+ ${actionLabel}`}</Text>
        </AppButton>
      )}
      <Animated.View style={chevronStyle}>
        <Image
          color={MUTED_INK}
          height={CHEVRON_SIZE}
          name="ic_chevron_down"
          type="svg"
          width={CHEVRON_SIZE}
        />
      </Animated.View>
    </AppButton>
  );
}

export default React.memo(SectionHeader);

const styles = StyleSheet.create({
  action: {
    color: ACCENT_INK,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  chip: {
    alignItems: 'center',
    backgroundColor: ACCENT_SURFACE,
    borderRadius: CHIP_SIZE / 2,
    height: CHIP_SIZE,
    justifyContent: 'center',
    width: CHIP_SIZE,
  },
  countLabel: {
    color: MUTED_INK,
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
  countPill: {
    alignItems: 'center',
    backgroundColor: '#ECEEF1',
    borderRadius: ScaleSize(11),
    justifyContent: 'center',
    minWidth: ScaleSize(22),
    paddingHorizontal: ScaleSize(6),
    paddingVertical: ScaleSize(2),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginBottom: ScaleSize(12),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
  },
  spacer: {
    flex: 1,
  },
  title: {
    color: TITLE_INK,
    fontSize: ScaleSize(20),
    fontWeight: '800',
  },
});
