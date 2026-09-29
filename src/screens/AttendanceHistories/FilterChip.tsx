import type { IconName } from '@assets/icons';
import type { TAttendanceHistoryFilter } from '@type/attendance';

import AppButton from '@components/AppButton';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Image from '@components/Image';
import React, { useCallback, useEffect } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';

const CHIP_ICON_SIZE = ScaleSize(17);

const ACTIVE = 1;
const INACTIVE = 0;
const MORPH_DURATION = 180;

type Properties = {
  readonly icon: IconName;
  /** Màu icon khi chip KHÔNG được chọn; chip đang chọn thì icon trắng. */
  readonly iconColor: string;
  readonly isActive: boolean;
  readonly label: string;
  readonly onChange: (filter: TAttendanceHistoryFilter) => void;
  readonly testID?: string;
  readonly value: TAttendanceHistoryFilter;
};

function FilterChip({
  icon,
  iconColor,
  isActive,
  label,
  onChange,
  testID,
  value,
}: Properties) {
  const progress = useSharedValue(isActive ? ACTIVE : INACTIVE);

  useEffect(() => {
    progress.set(
      withTiming(isActive ? ACTIVE : INACTIVE, { duration: MORPH_DURATION }),
    );
  }, [isActive, progress]);

  const onPress = useCallback(() => onChange(value), [onChange, value]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [INACTIVE, ACTIVE],
      [Colors.white, Colors.blue02],
    ),
    borderColor: interpolateColor(
      progress.get(),
      [INACTIVE, ACTIVE],
      [Colors.gray27, Colors.blue02],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.get(),
      [INACTIVE, ACTIVE],
      [Colors.gray17, Colors.white],
    ),
  }));

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
  }));

  return (
    <AppButton onPress={onPress} testID={testID}>
      <Animated.View style={[styles.chip, chipStyle]}>
        <View style={styles.iconBox}>
          <Image
            color={iconColor}
            height={CHIP_ICON_SIZE}
            name={icon}
            type="svg"
            width={CHIP_ICON_SIZE}
          />
          <Animated.View style={[styles.iconOverlay, activeIconStyle]}>
            <Image
              color={Colors.white}
              height={CHIP_ICON_SIZE}
              name={icon}
              type="svg"
              width={CHIP_ICON_SIZE}
            />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </AppButton>
  );
}

export default React.memo(FilterChip);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: ScaleSize(22),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  iconBox: {
    height: CHIP_ICON_SIZE,
    width: CHIP_ICON_SIZE,
  },
  iconOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  label: {
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
