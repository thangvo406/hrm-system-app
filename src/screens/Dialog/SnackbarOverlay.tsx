import type { SnackbarOptions, SnackbarType } from './types';

import { DIALOG_COLORS, DIALOG_TIMING } from './constants';
import imageNames from '@assets/images/names';
import Image from '@components/Image';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaleSize } from '@kits/core';

const TRANSLATE_OFFSET = -20;
const SNACKBAR_HORIZONTAL_MARGIN = 16;
const SNACKBAR_BOTTOM_OFFSET = 12;
const ICON_SIZE = 40;
const AUTO_DISMISS_DELAY = 4000;

const typeBackground: Readonly<Record<SnackbarType, string>> = {
  failed: '#C0392B',
  info: DIALOG_COLORS.toast,
  success: DIALOG_COLORS.toastSuccess,
};

type SnackbarOverlayProps = {
  readonly onDismiss: () => void;
  readonly options: SnackbarOptions;
  readonly zIndex: number;
};

function SnackbarOverlay({ onDismiss, options, zIndex }: SnackbarOverlayProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(TRANSLATE_OFFSET);
  const type: SnackbarType = options.type;

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: DIALOG_TIMING.animationDuration,
    });
    translateY.value = withTiming(0, {
      duration: DIALOG_TIMING.animationDuration,
    });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: DIALOG_TIMING.animationDuration,
      });
      translateY.value = withTiming(TRANSLATE_OFFSET, {
        duration: DIALOG_TIMING.animationDuration,
      });
      onDismiss();
    }, AUTO_DISMISS_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { zIndex }]}
      testID="snackbar-host"
    >
      <Animated.View
        style={[
          styles.snackbar,
          { backgroundColor: typeBackground[type] },
          { bottom: insets.bottom + SNACKBAR_BOTTOM_OFFSET },
          animatedStyle,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Image
            height={ScaleSize(22)}
            name={imageNames.ic_info_white}
            width={ScaleSize(22)}
          />
        </View>
        <Text style={styles.message}>{options.message}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="snackbar-dismiss"
          hitSlop={8}
          onPress={onDismiss}
          style={styles.closeWrapper}
          testID="snackbar-dismiss"
        >
          <Image
            height={ScaleSize(22)}
            name={imageNames.ic_outlet_close_white}
            width={ScaleSize(22)}
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  closeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  host: {
    ...StyleSheet.absoluteFillObject,
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: ICON_SIZE / 2,
    height: ICON_SIZE,
    justifyContent: 'center',
    width: ICON_SIZE,
  },
  message: {
    color: DIALOG_COLORS.toastText,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  snackbar: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    left: SNACKBAR_HORIZONTAL_MARGIN,
    marginHorizontal: SNACKBAR_HORIZONTAL_MARGIN,
    padding: 16,
    position: 'absolute',
    right: SNACKBAR_HORIZONTAL_MARGIN,
  },
});

export default SnackbarOverlay;
