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
const { ifAndroid } = DeviceUtils;
const TAB_ICON_SIZE = ScaleSize(32);
const TAB_PAY_BUTTON_SIZE = ScaleSize(56);
const TAB_COUNT = 5;
const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = '#9E9E9E';
const TAB_BG = '#FFFFFF';
const SPRING_TENSION = 60;
const SPRING_FRICTION = 9;
// Circle floats this many px above the container top border
const CIRCLE_RAISE = ScaleSize(12);
// paddingTop so icon center aligns with circle center:
// paddingTop = TAB_PAY_BUTTON_SIZE/2 - TAB_ICON_SIZE/2 - CIRCLE_RAISE
const CONTAINER_PADDING_TOP =
  TAB_PAY_BUTTON_SIZE / 2 - TAB_ICON_SIZE / 2 - CIRCLE_RAISE;

type TabItem = {
  readonly icon: string;
  readonly isCenter?: boolean;
  readonly key: string;
  readonly labelKey: string;
};
const INIT_ICON_ACTIVE = 'ic_wallet';
const TABS: readonly TabItem[] = [
  { icon: 'ic_home', key: Paths.Home, labelKey: 'home.tab_home' },
  { icon: 'ic_cart', key: Paths.Carts, labelKey: 'home.tab_order' },
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

  const circleX = useRef(new Animated.Value(0)).current;
  const containerWidthRef = useRef(0);
  const iconActive = useRef<string>(INIT_ICON_ACTIVE);

  const getCircleX = useCallback((index: number, containerWidth: number) => {
    const tabWidth = containerWidth / TAB_COUNT;
    return index * tabWidth + (tabWidth - TAB_PAY_BUTTON_SIZE) / 2;
  }, []);

  const handleContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      containerWidthRef.current = width;
      circleX.setValue(getCircleX(state.index, width));
    },
    [circleX, getCircleX, state.index],
  );

  useEffect(() => {
    const width = containerWidthRef.current;
    if (width === 0) return;
    Animated.spring(circleX, {
      friction: SPRING_FRICTION,
      tension: SPRING_TENSION,
      toValue: getCircleX(state.index, width),
      useNativeDriver: true,
    }).start();
  }, [state.index, circleX, getCircleX]);

  const handlePress = useCallback(
    (routeName: string, icon: string) => {
      iconActive.current = icon;
      navigation.dispatch(CommonActions.navigate(routeName));
    },
    [navigation],
  );

  return (
    <View
      onLayout={handleContainerLayout}
      style={[
        styles.container,
        { paddingBottom: ifAndroid(16, insets.bottom) },
      ]}
    >
      <Animated.View
        style={[
          styles.floatingCircle,
          { transform: [{ translateX: circleX }] },
        ]}
      >
        {!!iconActive.current && (
          <Image
            color="#FFFFFF"
            height={TAB_ICON_SIZE}
            name={iconActive.current as any}
            type="svg"
            // style={isActive ? styles.iconWrapperActive : {}}
            width={TAB_ICON_SIZE}
          />
        )}
      </Animated.View>

      {TABS.map(tab => {
        const isActive = activeRoute?.name === tab.key;
        const iconColor = isActive ? '#FFFFFF' : INACTIVE_COLOR;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.75}
            onPress={() => handlePress(tab.key, tab.icon)}
            style={styles.tabItem}
            testID={`bottom-tab-${tab.key}`}
          >
            <View style={styles.iconWrapper}>
              <Image
                color={iconColor}
                height={TAB_ICON_SIZE}
                name={tab.icon as any}
                type="svg"
                style={isActive ? styles.iconWrapperActive : {}}
                width={TAB_ICON_SIZE}
              />
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
    backgroundColor: ACTIVE_COLOR,
    borderRadius: TAB_PAY_BUTTON_SIZE / 2,
    elevation: 6,
    height: TAB_PAY_BUTTON_SIZE,
    left: 0,
    position: 'absolute',
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 1,
    top: -CIRCLE_RAISE,
    width: TAB_PAY_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    height: TAB_PAY_BUTTON_SIZE,
    justifyContent: 'center',
    width: TAB_PAY_BUTTON_SIZE,
  },
  iconWrapperActive: {
    marginTop: -CIRCLE_RAISE - 14,
    // marginBottom: -CIRCLE_RAISE,
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
