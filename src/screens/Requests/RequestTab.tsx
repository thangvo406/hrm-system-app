import type { TRequestTab } from '@type/requests';
import type { SharedValue } from 'react-native-reanimated';

import AppButton from '@components/AppButton';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import React, { useCallback } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';

const ACTIVE_COLOR = Colors.white;
const INACTIVE_COLOR = Colors.gray17;

const DISABLED_OPACITY = 0.4;

const FULLY_ACTIVE = 1;
const FULLY_INACTIVE = 0;

type Properties = {
  readonly index: number;
  readonly isActive: boolean;
  readonly isDisabled: boolean;
  readonly label: string;
  readonly onChange: (tab: TRequestTab) => void;
  readonly progress: SharedValue<number>;
  readonly testID?: string;
  readonly value: TRequestTab;
};

function RequestTab({
  index,
  isActive,
  isDisabled,
  label,
  onChange,
  progress,
  testID,
  value,
}: Properties) {
  const onPress = useCallback(() => onChange(value), [onChange, value]);

  const activeness = useDerivedValue(() =>
    Math.max(FULLY_ACTIVE - Math.abs(progress.get() - index), FULLY_INACTIVE),
  );

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeness.get(),
      [FULLY_INACTIVE, FULLY_ACTIVE],
      [INACTIVE_COLOR, ACTIVE_COLOR],
    ),
  }));

  return (
    <AppButton
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.tab, isDisabled && styles.tabDisabled]}
      testID={testID}
    >
      <Animated.Text
        numberOfLines={1}
        style={[styles.label, isActive && styles.labelActive, labelStyle]}
      >
        {label}
      </Animated.Text>
    </AppButton>
  );
}

export default React.memo(RequestTab);

const styles = StyleSheet.create({
  label: {
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  labelActive: {
    fontWeight: '700',
  },
  tabDisabled: {
    opacity: DISABLED_OPACITY,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(4),
    paddingVertical: ScaleSize(12),
  },
});
