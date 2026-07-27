import type { DialogOptions } from './types';

import { DIALOG_COLORS, DIALOG_SIZES, DIALOG_TIMING } from './constants';
import { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_SCALE = 0.96;
const BACKDROP_OPACITY = 0.5;

type DialogOverlayProps = {
  readonly cancelable: boolean;
  readonly isFullScreen: boolean;
  readonly onDismiss: () => void;
  readonly options: DialogOptions;
  readonly transparent: boolean;
  readonly zIndex: number;
};

/**
 * Hosts a single dialog instance. The dialog is just chrome:
 *   - animated backdrop (dismisses on tap when `cancelable`)
 *   - card wrapper (centered by default, full-bleed when `isFullScreen`, or
 *     stripped to a bare transparent box when `transparent` so the screen
 *     content shows through — useful for floating widgets like loaders)
 *   - the screen component (whatever the caller passed)
 *   - an `onRequestClose` callback the screen can invoke to dismiss
 *
 * The screen itself decides what to render — title, description, form,
 * date picker, spinner, etc. — and never has to know it's inside a dialog.
 */
function DialogOverlay({
  cancelable,
  isFullScreen,
  onDismiss,
  options,
  transparent,
  zIndex,
}: DialogOverlayProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(INITIAL_SCALE);
  // Pull framework keys out of the options bag; the rest is forwarded to the
  // screen verbatim.
  const {
    screen: Screen,
    onDidAppear,
    onDismiss: dismissCallback,
    overlayColor,
    ...screenProps
  } = options;

  // Khi caller truyền `overlayColor`, dùng làm màu nền backdrop và cho hiện ở
  // full opacity (màu tự quyết alpha). Không truyền thì giữ backdrop mặc định
  // với độ mờ dim sẵn có.
  const backdropColor = overlayColor ?? DIALOG_COLORS.backdrop;
  const backdropMaxOpacity = overlayColor ? 1 : BACKDROP_OPACITY;

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: DIALOG_TIMING.animationDuration,
    });
    scale.value = withTiming(1, {
      duration: DIALOG_TIMING.animationDuration,
      easing: Easing.out(Easing.cubic),
    });
    const appearTimer = setTimeout(() => {
      onDidAppear?.();
    }, DIALOG_TIMING.animationDuration);
    return () => {
      clearTimeout(appearTimer);
    };
  }, [onDidAppear, opacity, scale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * backdropMaxOpacity,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleDismiss = useCallback(() => {
    dismissCallback?.();
    onDismiss();
  }, [dismissCallback, onDismiss]);

  const handleBackdropPress = useCallback(() => {
    if (cancelable) {
      handleDismiss();
    }
  }, [cancelable, handleDismiss]);

  const cardStyleSheet = transparent
    ? styles.cardTransparent
    : isFullScreen
      ? styles.cardFullScreen
      : styles.cardCentered;
  const safeAreaStyle =
    isFullScreen && !transparent
      ? { paddingBottom: insets.bottom, paddingTop: insets.top }
      : {};

  return (
    <Animated.View
      pointerEvents={cancelable ? 'auto' : 'box-none'}
      style={[styles.overlay, { zIndex }]}
      testID="dialog-overlay"
    >
      <Animated.View
        style={[
          styles.backdrop,
          { backgroundColor: backdropColor },
          backdropStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="dialog-dismiss"
          disabled={!cancelable}
          onPress={handleBackdropPress}
          style={styles.backdropPressable}
          testID="dialog-backdrop"
        />
      </Animated.View>
      <Animated.View style={[cardStyleSheet, safeAreaStyle, cardStyle]}>
        {isFullScreen && !transparent && insets.top > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.fullScreenTopInset, { height: insets.top }]}
          />
        ) : undefined}
        <Screen
          {...(screenProps as Record<string, unknown>)}
          onRequestClose={handleDismiss}
        />
      </Animated.View>
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
  cardCentered: {
    alignSelf: 'center',
    backgroundColor: DIALOG_COLORS.card,
    borderRadius: DIALOG_SIZES.cardRadius,
    elevation: 12,
    maxWidth: DIALOG_SIZES.cardMaxWidth,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000000',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    width: '86%',
  },
  cardFullScreen: {
    // backgroundColor: DIALOG_COLORS.card,
    flex: 1,
    width: '100%',
  },
  cardTransparent: {
    // No background, no border, no shadow, no padding. The backdrop is
    // still rendered, so the underlying screen is dimmed and the screen
    // content (e.g. a centered loader) appears to float over it.
  },
  fullScreenTopInset: {
    backgroundColor: '#FFFFFF',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DialogOverlay;
