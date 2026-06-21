import type { LayoutChangeEvent } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import React from 'react';

const TAB_TIMING_DURATION = 280;
const TAB_ROW_PADDING = ScaleSize(16);

const TEXT_TAB_INACTIVE = '#5C5C5C';

type TabLayout = {
  readonly width: number;
  readonly x: number;
};

type TabButtonProperties = {
  readonly index: number;
  readonly label: string;
  readonly onLayout: (index: number, event: LayoutChangeEvent) => void;
  readonly onPress: (index: number) => void;
  readonly progress: SharedValue<number>;
  readonly testID: string;
};

function TabButton({
  index,
  label,
  onLayout,
  onPress,
  progress,
  testID,
}: TabButtonProperties) {
  const handleLayout = (event: LayoutChangeEvent) => {
    onLayout(index, event);
  };
  const handlePress = () => {
    onPress(index);
  };

  const textStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    const ratio = Math.min(distance, 1);
    const color = interpolateColor(
      ratio,
      [0, 1],
      ['#FFFFFF', TEXT_TAB_INACTIVE],
    );
    return { color };
  });

  const borderStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    const ratio = Math.min(distance, 1);
    const color = interpolateColor(
      ratio,
      [0, 1],
      ['transparent', Colors.primary],
    );
    const width = interpolate(ratio, [0, 1], [0, 1]);
    return { borderColor: color, borderWidth: width };
  });

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[styles.tab, borderStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.tabButton}
        testID={testID}
      >
        <Animated.Text style={[styles.tabText, textStyle]}>{label}</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

type Properties = {
  readonly labels: readonly string[];
  readonly onChange: (index: number) => void;
  readonly testIDs: readonly string[];
  readonly value: number;
};

function AnimatedTabs({ labels, onChange, testIDs, value }: Properties) {
  const progress = useSharedValue(value);
  const [layouts, setLayouts] = useState<readonly (TabLayout | undefined)[]>(
    () => labels.map(() => undefined),
  );

  const onTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    setLayouts(previous => {
      const current = previous[index];
      if (current && current.width === width && current.x === x) {
        return previous;
      }
      const next = [...previous];
      next[index] = { width, x };
      return next;
    });
  };

  const onPressTab = (index: number) => {
    progress.value = withTiming(index, {
      duration: TAB_TIMING_DURATION,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
    onChange(index);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const lower = Math.floor(progress.value);
    const upper = Math.min(lower + 1, layouts.length - 1);
    const ratio = progress.value - lower;
    const lowerLayout = layouts[lower];
    const upperLayout = layouts[upper];
    if (!lowerLayout || !upperLayout) {
      return { opacity: 0 };
    }
    const x =
      lowerLayout.x + (upperLayout.x - lowerLayout.x) * ratio - TAB_ROW_PADDING;
    const width =
      lowerLayout.width + (upperLayout.width - lowerLayout.width) * ratio;
    return {
      opacity: 1,
      transform: [{ translateX: x }],
      width,
    };
  });

  return (
    <View style={styles.tabRow}>
      <Animated.View
        pointerEvents="none"
        style={[styles.tabIndicator, indicatorStyle]}
      />
      {labels.map((label, index) => (
        <TabButton
          index={index}
          key={label}
          label={label}
          onLayout={onTabLayout}
          onPress={onPressTab}
          progress={progress}
          testID={testIDs[index] ?? `announcement-tab-${index}`}
        />
      ))}
    </View>
  );
}

export default React.memo(AnimatedTabs);

const styles = StyleSheet.create({
  tab: {
    borderRadius: ScaleSize(20),
    borderWidth: 1,
    height: ScaleSize(34),
    minWidth: ScaleSize(72),
    paddingHorizontal: ScaleSize(16),
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabIndicator: {
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(20),
    bottom: ScaleSize(12),
    height: ScaleSize(34),
    left: ScaleSize(16),
    position: 'absolute',
    top: ScaleSize(12),
  },
  tabRow: {
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(12),
  },
  tabText: {
    color: TEXT_TAB_INACTIVE,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});
