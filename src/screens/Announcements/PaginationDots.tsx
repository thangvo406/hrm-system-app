import type { SharedValue } from 'react-native-reanimated';

import { ScaleSize } from '@kits/core';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';

const DOT_SIZE = ScaleSize(6);

type PaginationDotProperties = {
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly index: number;
  readonly progress: SharedValue<number>;
  readonly size: number;
};

function PaginationDot({
  activeColor,
  activeWidth,
  gap,
  inactiveColor,
  index,
  progress,
  size,
}: PaginationDotProperties) {
  const animatedStyle = useAnimatedStyle(() => {
    const val = Math.abs(progress.value - index);
    return {
      backgroundColor: interpolateColor(
        val,
        [0, 0.5, 1],
        [activeColor, inactiveColor, inactiveColor],
      ),
      marginHorizontal: gap,
      width: interpolate(
        val,
        [0, 0.5, 1],
        [activeWidth, size, size],
        Extrapolation.CLAMP,
      ),
    };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
}

type PaginationDotsProperties = {
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly count: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly progress: SharedValue<number>;
  readonly size: number;
  readonly style: ViewStyle | ViewStyle[];
};

function PaginationDots({
  activeColor,
  activeWidth,
  count,
  gap,
  inactiveColor,
  progress,
  size,
  style,
}: PaginationDotsProperties) {
  return (
    <View style={[styles.paginationRow, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot
          activeColor={activeColor}
          activeWidth={activeWidth}
          gap={gap}
          inactiveColor={inactiveColor}
          index={index}
          progress={progress}
          size={size}
          // eslint-disable-next-line react/no-array-index-key -- static positions, no reordering
          key={`pagination-dot-${index}`}
        />
      ))}
    </View>
  );
}

export default React.memo(PaginationDots);

const styles = StyleSheet.create({
  paginationDot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
  },
  paginationRow: {
    alignSelf: 'center',
    bottom: ScaleSize(10),
    flexDirection: 'row',
    position: 'absolute',
  },
});
