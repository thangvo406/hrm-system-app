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
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly index: number;
  readonly progress: SharedValue<number>;
  readonly size: number;
};

function Dot({
  activeColor,
  activeWidth,
  gap,
  inactiveColor,
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
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly count: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly progress: SharedValue<number>;
  readonly size: number;
  readonly style?: StyleProp<ViewStyle>;
};

function PaginationDots({
  activeColor,
  activeWidth,
  count,
  gap,
  inactiveColor,
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
          // eslint-disable-next-line react/no-array-index-key -- static positions, no reordering
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
