import type { LayoutChangeEvent, ViewStyle } from 'react-native';

import { ScaleSize } from '@kits/core';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DURATION = 240;
const MEASURE_EPSILON = 1;
// Reanimated only patches style properties it is given a concrete value for
// each frame — returning `undefined` later to "unset" a height that was
// previously animated to a number is silently ignored, so the interpolated
// height has to already be generous enough on its own to never clip the
// real content (sub-pixel rounding, tight ascender/descender metrics on
// some scripts...). A few extra px of headroom on top of the measured
// height covers that.
const MEASURE_BUFFER = ScaleSize(4);

type Properties = {
  readonly children: React.ReactNode;
  readonly contentStyle?: ViewStyle;
  readonly expanded: boolean;
};

/**
 * Animates its own height between 0 and the natural height of `children`.
 * The children stay mounted and keep their intrinsic height — the wrapper
 * clips them — so the measurement never fights the animation.
 *
 * Everything the animation reads lives in shared values: measuring must not
 * trigger a React render, or the row tree re-renders mid-animation and drops
 * frames.
 */
function Collapsible({ children, contentStyle, expanded }: Properties) {
  const progress = useSharedValue(expanded ? 1 : 0);
  const contentHeight = useSharedValue(0);
  const isMeasured = useSharedValue(false);
  const lastMeasured = useRef(0);

  useEffect(() => {
    progress.set(
      withTiming(expanded ? 1 : 0, {
        duration: DURATION,
        // Decelerate on the way open, accelerate on the way shut.
        easing: expanded ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      }),
    );
  }, [expanded, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    if (next <= 0 || Math.abs(next - lastMeasured.current) < MEASURE_EPSILON) {
      return;
    }
    const hadHeight = lastMeasured.current > 0;
    lastMeasured.current = next;
    const target = next + MEASURE_BUFFER;
    // A row was added or removed: glide to the new height. First measure snaps.
    contentHeight.set(
      hadHeight ? withTiming(target, { duration: DURATION }) : target,
    );
    isMeasured.set(true);
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Nothing to interpolate until the content has been measured: keep the
    // natural height when open, stay shut when closed.
    if (!isMeasured.get()) {
      return {
        height: expanded ? undefined : 0,
        opacity: expanded ? 1 : 0,
      };
    }
    return {
      height: contentHeight.get() * progress.get(),
      opacity: progress.get(),
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View onLayout={onLayout} style={contentStyle}>
        {children}
      </View>
    </Animated.View>
  );
}

export default React.memo(Collapsible);

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
});
