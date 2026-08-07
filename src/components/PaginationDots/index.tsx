import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

type DotProps = {
  readonly activeColor?: string;
  readonly activeWidth: number;
  readonly gap: number;
  readonly inactiveColor?: string;
  readonly index: number;
  readonly progress: SharedValue<number>;
  readonly size: number;
};
const DOT_ACTIVE_COLOR = '#256B3A';
const DOT_INACTIVE_COLOR = '#E0E0E0';
function Dot({
  activeColor = DOT_ACTIVE_COLOR,
  activeWidth,
  gap,
  inactiveColor = DOT_INACTIVE_COLOR,
  index,
  progress,
  size,
}: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    return {
      backgroundColor: distance < 0.5 ? activeColor : inactiveColor,
      borderRadius: size / 2,
      height: size,
      marginHorizontal: gap,
      width: interpolate(
        distance,
        [0, 0.5, 1],
        [activeWidth, size, size],
        Extrapolation.CLAMP,
      ),
    };
  });

  return <Animated.View style={animatedStyle} />;
}

type Properties = {
  readonly activeColor?: string;
  readonly activeWidth: number;
  readonly count: number;
  readonly gap: number;
  readonly inactiveColor?: string;
  readonly progress: SharedValue<number>;
  readonly size: number;
  readonly style?: StyleProp<ViewStyle>;
};

function PaginationDots({
  activeColor = DOT_ACTIVE_COLOR,
  activeWidth,
  count,
  gap,
  inactiveColor = DOT_INACTIVE_COLOR,
  progress,
  size,
  style = undefined,
}: Properties) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          activeColor={activeColor}
          activeWidth={activeWidth}
          gap={gap}
          inactiveColor={inactiveColor}
          index={index}
          progress={progress}
          size={size}
          key={`dot-${index}`}
        />
      ))}
    </View>
  );
}

export default React.memo(PaginationDots);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
