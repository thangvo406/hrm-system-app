import type { LayoutChangeEvent, ViewStyle } from 'react-native';

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
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: DURATION,
      // Decelerate on the way open, accelerate on the way shut.
      easing: expanded ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
  }, [expanded, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    if (next <= 0 || Math.abs(next - lastMeasured.current) < MEASURE_EPSILON) {
      return;
    }
    const hadHeight = lastMeasured.current > 0;
    lastMeasured.current = next;
    // A row was added or removed: glide to the new height. First measure snaps.
    contentHeight.value = hadHeight
      ? withTiming(next, { duration: DURATION })
      : next;
    isMeasured.value = true;
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Nothing to interpolate until the content has been measured: keep the
    // natural height when open, stay shut when closed.
    if (!isMeasured.value) {
      return {
        height: expanded ? undefined : 0,
        opacity: expanded ? 1 : 0,
      };
    }
    return {
      height: contentHeight.value * progress.value,
      opacity: progress.value,
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
