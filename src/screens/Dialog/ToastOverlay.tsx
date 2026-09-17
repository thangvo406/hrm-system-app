import type { ToastOptions, ToastVariant } from './types';

import { DIALOG_COLORS, DIALOG_SIZES, DIALOG_TIMING } from './constants';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TRANSLATE_OFFSET = 40;
const TOAST_HORIZONTAL_MARGIN = 16;
const TOAST_BOTTOM_OFFSET = 12;

const variantAccent: Readonly<Record<ToastVariant, string>> = {
  default: DIALOG_COLORS.toast,
  error: DIALOG_COLORS.toastDanger,
  success: DIALOG_COLORS.toastSuccess,
};

type ToastOverlayProps = {
  readonly onDismiss: () => void;
  readonly options: ToastOptions;
  readonly zIndex: number;
};

function ToastOverlay({ onDismiss, options, zIndex }: ToastOverlayProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translate = useSharedValue(TRANSLATE_OFFSET);
  const variant: ToastVariant = options.variant ?? 'default';
  const position = options.position ?? 'bottom';
  const duration = options.duration ?? DIALOG_TIMING.defaultToastDuration;

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: DIALOG_TIMING.animationDuration,
    });
    translate.value = withTiming(0, {
      duration: DIALOG_TIMING.animationDuration,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setTimeout(onDismiss, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onDismiss, opacity, translate]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  const verticalOffset =
    position === 'top'
      ? insets.top + TOAST_BOTTOM_OFFSET
      : insets.bottom + TOAST_BOTTOM_OFFSET;
  const verticalStyle =
    position === 'top' ? { top: verticalOffset } : { bottom: verticalOffset };
  const accentColor = variantAccent[variant];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { zIndex }]}
      testID="toast-host"
    >
      <Animated.View
        style={[
          styles.toast,
          { backgroundColor: accentColor },
          verticalStyle,
          animatedStyle,
          Platform.OS === 'ios' ? styles.toastIOS : {},
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="toast-dismiss"
          onPress={onDismiss}
          style={styles.pressable}
          testID="toast-pressable"
        >
          {options.icon ? (
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>{options.icon}</Text>
            </View>
          ) : undefined}
          <View style={styles.textWrapper}>
            <Text numberOfLines={1} style={styles.title}>
              {options.title}
            </Text>
            {options.description ? (
              <Text numberOfLines={2} style={styles.description}>
                {options.description}
              </Text>
            ) : undefined}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  description: {
    color: DIALOG_COLORS.toastText,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    opacity: 0.9,
  },
  host: {
    ...StyleSheet.absoluteFillObject,
  },
  iconText: {
    color: DIALOG_COLORS.toastText,
    fontSize: 16,
    fontWeight: '700',
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    height: 28,
    justifyContent: 'center',
    marginRight: 10,
    width: 28,
  },
  pressable: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: DIALOG_SIZES.toastVerticalPadding,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    color: DIALOG_COLORS.toastText,
    fontSize: 15,
    fontWeight: '700',
  },
  toast: {
    borderRadius: DIALOG_SIZES.toastRadius,
    elevation: 8,
    left: TOAST_HORIZONTAL_MARGIN,
    marginHorizontal: TOAST_HORIZONTAL_MARGIN,
    maxWidth: DIALOG_SIZES.toastMaxWidth,
    position: 'absolute',
    right: TOAST_HORIZONTAL_MARGIN,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  toastIOS: {
    shadowOpacity: 0.25,
  },
});

export default ToastOverlay;
