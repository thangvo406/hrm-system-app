import type { BottomSheetOptions } from './types';

import {
  BOTTOM_SHEET_SIZES,
  BOTTOM_SHEET_TIMING,
  DIALOG_COLORS,
} from './constants';
import { useCallback, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKDROP_OPACITY = 0.5;

type BottomSheetOverlayProps = {
  readonly cancelable: boolean;
  readonly draggable: boolean;
  readonly onDismiss: () => void;
  readonly options: BottomSheetOptions;
  readonly zIndex: number;
};

/**
 * Hosts a single bottom sheet instance. Slides up from the bottom edge with
 * a fade-in backdrop and supports drag-down-to-dismiss (toggleable via
 * `draggable`). The screen component receives the same `onRequestClose`
 * injection that `DialogOverlay` provides, so any screen written for the
 * dialog system works here without modification.
 */
function BottomSheetOverlay({
  cancelable,
  draggable,
  onDismiss,
  options,
  zIndex,
}: BottomSheetOverlayProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(screenHeight);

  // Pull framework keys out of the options bag; the rest is forwarded to
  // the screen verbatim — mirrors `DialogOverlay`.
  const {
    screen: Screen,
    onDidAppear,
    onDismiss: dismissCallback,
    ...screenProps
  } = options;

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: BOTTOM_SHEET_TIMING.animationDuration,
    });
    translateY.value = withTiming(0, {
      duration: BOTTOM_SHEET_TIMING.animationDuration,
      easing: Easing.out(Easing.cubic),
    });
    const appearTimer = setTimeout(() => {
      onDidAppear?.();
    }, BOTTOM_SHEET_TIMING.animationDuration);
    return () => {
      clearTimeout(appearTimer);
    };
  }, [onDidAppear, opacity, translateY]);

  const handleDismiss = useCallback(() => {
    dismissCallback?.();
    onDismiss();
  }, [dismissCallback, onDismiss]);

  const handleBackdropPress = useCallback(() => {
    if (cancelable) {
      handleDismiss();
    }
  }, [cancelable, handleDismiss]);

  const pan = Gesture.Pan()
    .enabled(draggable && cancelable)
    .onUpdate(event => {
      'worklet';
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd(event => {
      'worklet';
      const shouldDismiss =
        event.translationY > BOTTOM_SHEET_SIZES.translateDismissThreshold ||
        event.velocityY > BOTTOM_SHEET_SIZES.snapVelocityThreshold;
      if (shouldDismiss) {
        translateY.value = withTiming(screenHeight, {
          duration: BOTTOM_SHEET_TIMING.animationDuration,
        });
        opacity.value = withTiming(0, {
          duration: BOTTOM_SHEET_TIMING.animationDuration,
        });
        scheduleOnRN(handleDismiss);
      } else {
        translateY.value = withTiming(0, {
          duration: BOTTOM_SHEET_TIMING.animationDuration,
        });
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * BACKDROP_OPACITY,
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents={cancelable ? 'auto' : 'box-none'}
      style={[styles.overlay, { zIndex }]}
      testID="bottom-sheet-overlay"
    >
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        testID="bottom-sheet-backdrop"
      >
        <TouchableOpacity
          accessibilityLabel="bottom-sheet-dismiss"
          accessibilityRole="button"
          disabled={!cancelable}
          onPress={handleBackdropPress}
          style={styles.backdropPressable}
          testID="bottom-sheet-backdrop-press"
        />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.card,
            {
              maxHeight: screenHeight * BOTTOM_SHEET_SIZES.maxHeightRatio,
              paddingBottom: insets.bottom,
            },
            cardStyle,
          ]}
          testID="bottom-sheet-card"
        >
          <View style={styles.handle} testID="bottom-sheet-handle" />
          <Screen
            {...(screenProps as Record<string, unknown>)}
            onRequestClose={handleDismiss}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: DIALOG_COLORS.backdrop,
  },
  backdropPressable: {
    flex: 1,
  },
  card: {
    backgroundColor: DIALOG_COLORS.card,
    borderTopLeftRadius: BOTTOM_SHEET_SIZES.cardRadius,
    borderTopRightRadius: BOTTOM_SHEET_SIZES.cardRadius,
    elevation: 16,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    width: '100%',
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 2,
    height: BOTTOM_SHEET_SIZES.handleHeight,
    marginBottom: 8,
    width: BOTTOM_SHEET_SIZES.handleWidth,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
});

export default BottomSheetOverlay;
