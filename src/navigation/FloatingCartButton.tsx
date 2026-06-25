import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ScaleSize } from '@kits/core';
import Image from '@components/Image';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import AppButton from '@components/AppButton';
import { useEffect } from 'react';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';

const BUTTON_SIZE = ScaleSize(60);
const ICON_SIZE = ScaleSize(32);
const BADGE_SIZE = ScaleSize(22);
const EDGE_PADDING = ScaleSize(16);
const DRAG_THRESHOLD = 8;
const SPRING_CONFIG = { damping: 18, stiffness: 200, mass: 0.8 };
const SHOW_ANIMATION = { damping: 14, stiffness: 260, mass: 0.8 };
const HIDE_DURATION = 200;

function FloatingCartButton() {
  const showFloatingCart = useAppSelector(state => state.app.showFloatingCart);
  const countStore = useAppSelector(AccountSelector.getTotalItemCart);
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

  const initialX = SCREEN_W - BUTTON_SIZE - EDGE_PADDING;
  const initialY = SCREEN_H - BUTTON_SIZE - insets.bottom - ScaleSize(24);

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const startX = useSharedValue(initialX);
  const startY = useSharedValue(initialY);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showFloatingCart) {
      scale.value = withSpring(1, SHOW_ANIMATION);
      opacity.value = withSpring(1, SHOW_ANIMATION);
    } else {
      scale.value = withTiming(0, { duration: HIDE_DURATION });
      opacity.value = withTiming(0, { duration: HIDE_DURATION });
    }
  }, [showFloatingCart, scale, opacity]);

  const navigateToCart = () => AppNavigator.navigate(Paths.Carts);

  const pan = Gesture.Pan()
    .minDistance(DRAG_THRESHOLD)
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(e => {
      const currentX = startX.value + e.translationX;
      const currentY = startY.value + e.translationY;

      const snapX =
        currentX + BUTTON_SIZE / 2 < SCREEN_W / 2
          ? EDGE_PADDING
          : SCREEN_W - BUTTON_SIZE - EDGE_PADDING;

      const clampedY = Math.max(
        insets.top + EDGE_PADDING,
        Math.min(
          currentY,
          SCREEN_H - BUTTON_SIZE - insets.bottom - EDGE_PADDING,
        ),
      );

      translateX.value = withSpring(snapX, SPRING_CONFIG);
      translateY.value = withSpring(clampedY, SPRING_CONFIG);
    });

  const gesture = Gesture.Exclusive(pan);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <AppButton onPress={navigateToCart}>
          <Image
            color="#FFFFFF"
            height={ICON_SIZE}
            name="ic_cart"
            type="svg"
            width={ICON_SIZE}
          />
        </AppButton>
        {countStore > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {countStore > 99 ? '99+' : countStore}
            </Text>
          </View>
        ) : undefined}
      </Animated.View>
    </GestureDetector>
  );
}

export default FloatingCartButton;

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BADGE_SIZE / 2,
    height: BADGE_SIZE,
    justifyContent: 'center',
    minWidth: BADGE_SIZE,
    paddingHorizontal: ScaleSize(3),
    position: 'absolute',
    right: -(BADGE_SIZE / 4),
    top: -(BADGE_SIZE / 4),
  },
  badgeText: {
    color: '#1A1A1A',
    fontSize: ScaleSize(11),
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2FA94A',
    borderRadius: BUTTON_SIZE / 2,
    elevation: 8,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    width: BUTTON_SIZE,
  },
});
