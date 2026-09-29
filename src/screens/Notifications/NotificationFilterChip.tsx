import type { TNotificationFilter } from '@type/notifications';

import AppButton from '@components/AppButton';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React, { useCallback, useEffect } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';

const ACTIVE = 1;
const INACTIVE = 0;
const MORPH_DURATION = 180;

type Properties = {
  readonly isActive: boolean;
  readonly label: string;
  readonly onChangeFilter: (filter: TNotificationFilter) => void;
  readonly testID?: string;
  readonly value: TNotificationFilter;
};

function NotificationFilterChip({
  isActive,
  label,
  onChangeFilter,
  testID,
  value,
}: Properties) {
  const progress = useSharedValue(isActive ? ACTIVE : INACTIVE);

  useEffect(() => {
    progress.set(
      withTiming(isActive ? ACTIVE : INACTIVE, { duration: MORPH_DURATION }),
    );
  }, [isActive, progress]);

  const onPress = useCallback(
    () => onChangeFilter(value),
    [onChangeFilter, value],
  );

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [INACTIVE, ACTIVE],
      [Colors.navy06, Colors.white],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.get(),
      [INACTIVE, ACTIVE],
      [Colors.blue05, Colors.navy04],
    ),
  }));

  return (
    <AppButton onPress={onPress} testID={testID}>
      <Animated.View style={[styles.chip, chipStyle]}>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.chipLabel,
            isActive && styles.chipLabelActive,
            labelStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </AppButton>
  );
}

export default React.memo(NotificationFilterChip);

const styles = StyleSheet.create({
  chip: {
    borderRadius: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  chipLabel: {
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  chipLabelActive: {
    fontWeight: '700',
  },
});
