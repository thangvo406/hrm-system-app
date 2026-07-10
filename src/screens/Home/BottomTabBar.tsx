import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { Paths } from '@navigation/paths';
import { DeviceUtils } from '@kits/core/utils';
import CartTabIcon from './CartTabIcon';

const { ifAndroid } = DeviceUtils;

const TAB_ICON_SIZE = ScaleSize(32);
const TAB_PAY_BUTTON_SIZE = ScaleSize(56);
const TAB_COUNT = 5;
const CENTER_INDEX = 2;
const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = '#9E9E9E';
const TAB_BG = '#FFFFFF';
const CIRCLE_RAISE = ScaleSize(12);
const INDICATOR_HEIGHT = 2;
const INDICATOR_WIDTH = ScaleSize(40);
const SPRING_TENSION = 60;
const SPRING_FRICTION = 9;
const CONTAINER_PADDING_TOP =
  TAB_PAY_BUTTON_SIZE / 2 - TAB_ICON_SIZE / 2 - CIRCLE_RAISE;

type TabItem = {
  readonly icon: string;
  readonly isCart?: boolean;
  readonly isCenter?: boolean;
  readonly key: string;
  readonly labelKey: string;
};

const TABS: readonly TabItem[] = [
  { icon: 'ic_home', key: Paths.Home, labelKey: 'home.tab_home' },
  { icon: 'ic_cart', isCart: true, key: Paths.Carts, labelKey: 'home.tab_order' },
  {
    icon: 'ic_wallet',
    isCenter: true,
    key: Paths.QRCodePayment,
    labelKey: 'home.tab_pay',
  },
  { icon: 'ic_star', key: Paths.Vouchers, labelKey: 'home.tab_vouchers' },
  { icon: 'user', key: Paths.Profile, labelKey: 'home.tab_mypage' },
];

function BottomTabBar({ insets, navigation, state }: BottomTabBarProps) {
  const { t } = useTranslation();
  const activeRoute = state.routes[state.index];

  const indicatorX = useRef(new Animated.Value(0)).current;
  const containerWidthRef = useRef(0);

  const getIndicatorX = useCallback((index: number, containerWidth: number) => {
    const tabWidth = containerWidth / TAB_COUNT;
    return index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2;
  }, []);

  const handleContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      containerWidthRef.current = width;
      indicatorX.setValue(getIndicatorX(state.index, width));
    },
    [indicatorX, getIndicatorX, state.index],
  );

  useEffect(() => {
    const width = containerWidthRef.current;
    if (width === 0) return;
    Animated.spring(indicatorX, {
      friction: SPRING_FRICTION,
      tension: SPRING_TENSION,
      toValue: getIndicatorX(state.index, width),
      useNativeDriver: true,
    }).start();
  }, [state.index, indicatorX, getIndicatorX]);

  const handlePress = useCallback(
    (routeName: string) => {
      navigation.dispatch(CommonActions.navigate(routeName));
    },
    [navigation],
  );

  return (
    <View
      onLayout={handleContainerLayout}
      style={[
        styles.container,
        { paddingBottom: ifAndroid(16, insets.bottom + 8) },
      ]}
    >
      {/* Animated indicator line at the top of the active tab */}
      <Animated.View
        style={[styles.indicator, { transform: [{ translateX: indicatorX }] }]}
      />

      {/* Fixed circle at center tab */}
      <View style={styles.floatingCircle} pointerEvents="none">
        <Image
          color="#FFFFFF"
          height={TAB_ICON_SIZE}
          name="ic_wallet"
          type="svg"
          width={TAB_ICON_SIZE}
        />
      </View>

      {TABS.map((tab, index) => {
        const isActive = activeRoute?.name === tab.key;
        const isCenter = index === CENTER_INDEX;
        const isCart = tab.isCart === true;
        const iconColor = isCenter
          ? 'transparent'
          : isActive
            ? ACTIVE_COLOR
            : INACTIVE_COLOR;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.75}
            onPress={() => handlePress(tab.key)}
            style={styles.tabItem}
            testID={`bottom-tab-${tab.key}`}
          >
            <View
              style={isCenter ? styles.iconWrapperCenter : styles.iconWrapper}
            >
              {!isCenter && (
                isCart ? (
                  <CartTabIcon color={iconColor} size={TAB_ICON_SIZE} />
                ) : (
                  <Image
                    color={iconColor}
                    height={TAB_ICON_SIZE}
                    name={tab.icon as any}
                    type="svg"
                    width={TAB_ICON_SIZE}
                  />
                )
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR },
              ]}
            >
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default React.memo(BottomTabBar);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: TAB_BG,
    borderTopColor: '#EBEBEB',
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 8,
    flexDirection: 'row',
    paddingTop: CONTAINER_PADDING_TOP,
    shadowColor: '#000000',
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  floatingCircle: {
    alignItems: 'center',
    backgroundColor: ACTIVE_COLOR,
    borderRadius: TAB_PAY_BUTTON_SIZE / 2,
    elevation: 6,
    height: TAB_PAY_BUTTON_SIZE,
    justifyContent: 'center',
    left: `${((CENTER_INDEX + 0.5) / TAB_COUNT) * 100}%` as any,
    marginLeft: -(TAB_PAY_BUTTON_SIZE / 2),
    position: 'absolute',
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    top: -CIRCLE_RAISE,
    width: TAB_PAY_BUTTON_SIZE,
    zIndex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    height: TAB_PAY_BUTTON_SIZE,
    justifyContent: 'center',
    width: TAB_PAY_BUTTON_SIZE,
  },
  iconWrapperCenter: {
    alignItems: 'center',
    height: TAB_PAY_BUTTON_SIZE,
    justifyContent: 'center',
    width: TAB_PAY_BUTTON_SIZE,
  },
  indicator: {
    backgroundColor: ACTIVE_COLOR,
    borderRadius: INDICATOR_HEIGHT / 2,
    height: INDICATOR_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: INDICATOR_WIDTH,
    zIndex: 2,
  },
  label: {
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(2),
    textAlign: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: ScaleSize(2),
  },
});
