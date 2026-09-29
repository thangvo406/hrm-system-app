import type { IconName } from '@assets/icons';
import type { TAttendanceMode } from '@type/attendance';
import type { SharedValue } from 'react-native-reanimated';

import AppButton from '@components/AppButton';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import Image from '@components/Image';
import React, { useCallback } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';

const TAB_ICON_SIZE = ScaleSize(18);
const ACTIVE_COLOR = Colors.navy04;
const INACTIVE_COLOR = Colors.blue05;

const FULLY_ACTIVE = 1;
const FULLY_INACTIVE = 0;

type Properties = {
  readonly icon: IconName;
  readonly index: number;
  readonly label: string;
  readonly mode: TAttendanceMode;
  readonly onChangeMode: (mode: TAttendanceMode) => void;
  readonly progress: SharedValue<number>;
  readonly testID?: string;
};

function ModeTab({
  icon,
  index,
  label,
  mode,
  onChangeMode,
  progress,
  testID,
}: Properties) {
  const onPress = useCallback(() => onChangeMode(mode), [mode, onChangeMode]);

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

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: activeness.get(),
  }));

  return (
    <AppButton onPress={onPress} style={styles.tab} testID={testID}>
      <View style={styles.iconBox}>
        <Image
          color={INACTIVE_COLOR}
          height={TAB_ICON_SIZE}
          name={icon}
          type="svg"
          width={TAB_ICON_SIZE}
        />
        <Animated.View style={[styles.iconOverlay, activeIconStyle]}>
          <Image
            color={ACTIVE_COLOR}
            height={TAB_ICON_SIZE}
            name={icon}
            type="svg"
            width={TAB_ICON_SIZE}
          />
        </Animated.View>
      </View>

      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
    </AppButton>
  );
}

export default React.memo(ModeTab);

const styles = StyleSheet.create({
  iconBox: {
    height: TAB_ICON_SIZE,
    width: TAB_ICON_SIZE,
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
  tab: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    paddingVertical: ScaleSize(11),
  },
});
