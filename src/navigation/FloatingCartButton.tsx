import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScaleSize } from '@kits/core';
import Image from '@components/Image';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import AppButton from '@components/AppButton';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { DeviceUtils } from '@kits/core/utils';
const { ifIOS } = DeviceUtils;
const BUTTON_SIZE = ScaleSize(60);
const ICON_SIZE = ScaleSize(32);
const BADGE_SIZE = ScaleSize(22);
const EDGE_PADDING = ScaleSize(16);
const DRAG_THRESHOLD = 8;
const SPRING_CONFIG = { damping: 18, stiffness: 200, mass: 0.8 };
const SHOW_SPRING_CONFIG = { damping: 14, stiffness: 260, mass: 0.8 };
const HIDE_DURATION = 200;

export type FloatingCartButtonRef = {
  show: () => void;
  hide: () => void;
  resetPosition: () => void;
};

const FloatingCartButton = forwardRef<FloatingCartButtonRef>((_props, ref) => {
  const showFloatingCart = useAppSelector(state => state.app.showFloatingCart);
  const countStore = useAppSelector(AccountSelector.getTotalItemCart);
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

  const initialX = SCREEN_W - BUTTON_SIZE - EDGE_PADDING;
  const initialY =
    SCREEN_H - BUTTON_SIZE - insets.bottom - ScaleSize(ifIOS(24, -4));

  const pan = useRef(
    new Animated.ValueXY({ x: initialX, y: initialY }),
  ).current;

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const viewRef = useRef<Animated.LegacyRef<View>>(null);

  const isDragging = useRef(false);
  const isVisible = useRef(false);

  const show = () => {
    isVisible.current = true;
    (viewRef.current as any)?.setNativeProps?.({ pointerEvents: 'auto' });
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        ...SHOW_SPRING_CONFIG,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        ...SHOW_SPRING_CONFIG,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0,
        duration: HIDE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: HIDE_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isVisible.current = false;
      (viewRef.current as any)?.setNativeProps?.({ pointerEvents: 'none' });
    });
  };

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: initialX, y: initialY },
      ...SPRING_CONFIG,
      useNativeDriver: true,
    }).start();
  };

  useImperativeHandle(ref, () => ({ hide, resetPosition, show }));

  useEffect(() => {
    if (showFloatingCart) {
      show();
    } else {
      hide();
    }
  }, [showFloatingCart]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > DRAG_THRESHOLD || Math.abs(gs.dy) > DRAG_THRESHOLD,
      onPanResponderGrant: () => {
        isDragging.current = false;
        pan.stopAnimation();
        pan.extractOffset();
      },
      onPanResponderMove: (_, gs) => {
        if (
          Math.abs(gs.dx) > DRAG_THRESHOLD ||
          Math.abs(gs.dy) > DRAG_THRESHOLD
        ) {
          isDragging.current = true;
        }
        pan.setValue({ x: gs.dx, y: gs.dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();

        if (!isDragging.current) {
          AppNavigator.navigate(Paths.Carts);
          return;
        }

        const currentX = (pan.x as any)._value as number;
        const currentY = (pan.y as any)._value as number;

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

        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          ...SPRING_CONFIG,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      ref={viewRef as any}
      pointerEvents="none"
      style={[
        styles.button,
        {
          opacity,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
        },
      ]}
      // {...panResponder.panHandlers}
    >
      <AppButton
        onPress={() => AppNavigator.navigate(Paths.Carts)}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
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
  );
});

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
