import type { SharedValue } from 'react-native-reanimated';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';

const DIVIDER_HEIGHT = ScaleSize(20);

const FULLY_ACTIVE = 1;
const FULLY_INACTIVE = 0;
const HALF = 2;

type Properties = {
  /** Ranh giới nằm giữa ô `boundary - 1` và ô `boundary`. */
  readonly boundary: number;
  readonly left: number;
  readonly progress: SharedValue<number>;
};

function RequestTabDivider({ boundary, left, progress }: Properties) {
  const style = useAnimatedStyle(() => {
    const before = Math.max(
      FULLY_ACTIVE - Math.abs(progress.get() - (boundary - 1)),
      FULLY_INACTIVE,
    );
    const after = Math.max(
      FULLY_ACTIVE - Math.abs(progress.get() - boundary),
      FULLY_INACTIVE,
    );

    return {
      left,
      opacity: FULLY_ACTIVE - Math.min(before + after, FULLY_ACTIVE),
    };
  });

  return <Animated.View style={[styles.divider, style]} />;
}

export default React.memo(RequestTabDivider);

const styles = StyleSheet.create({
  divider: {
    backgroundColor: Colors.gray19,
    height: DIVIDER_HEIGHT,
    marginTop: -DIVIDER_HEIGHT / HALF,
    position: 'absolute',
    top: '50%',
    width: 1,
  },
});
