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
import { scheduleOnRN } from 'react-native-worklets';
import { ScaleSize } from '@kits/core';

const ANIMATION_DURATION = 300;
const AUTO_DISMISS_DELAY = 4000;
const ICON_SIZE = 40;

type SnackbarProps = {
  readonly message: string;
  readonly onDismiss: () => void;
  readonly visible: boolean;
};

function Snackbar({ message, onDismiss, visible }: SnackbarProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION });
      translateY.value = withTiming(0, { duration: ANIMATION_DURATION });

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
        translateY.value = withTiming(
          -20,
          { duration: ANIMATION_DURATION },
          finished => {
            if (finished) {
              scheduleOnRN(onDismiss);
            }
          },
        );
      }, AUTO_DISMISS_DELAY);

      return () => {
        clearTimeout(timer);
      };
    }
    opacity.value = 0;
    translateY.value = -20;
  }, [visible, onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return undefined;

  return (
    <Animated.View
      style={[styles.container, animatedStyle, { bottom: insets.bottom + 12 }]}
    >
      <View style={styles.iconWrapper}>
        <Image
          name={imageNames.ic_info_white}
          height={ScaleSize(22)}
          width={ScaleSize(22)}
        />
      </View>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        hitSlop={8}
        onPress={onDismiss}
        style={styles.closeWrapper}
        testID="snackbar-dismiss"
      >
        <Image
          name={imageNames.ic_outlet_close_white}
          height={ScaleSize(22)}
          width={ScaleSize(22)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  closeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#C0392B',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    left: 16,
    padding: 16,
    position: 'absolute',
    right: 16,
    zIndex: 99_999,
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
    color: '#FFFFFF',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
});

export default Snackbar;
