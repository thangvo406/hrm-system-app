import type { IconName } from '@assets/icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { Colors } from '@constants';
import { Image } from '@components';
import { CommonActions } from '@react-navigation/native';
import { DeviceUtils } from '@kits/core/utils';
import { Paths } from '@navigation/paths';
import React, { useCallback } from 'react';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const { ifAndroid, ifIphoneX } = DeviceUtils;

const TAB_ICON_SIZE = ScaleSize(24);
const ACTIVE_COLOR = Colors.blue04;
const INACTIVE_COLOR = Colors.gray24;

type TabItem = {
  readonly icon: IconName;
  readonly key: string;
  readonly labelKey: string;
};

const TABS: readonly TabItem[] = [
  { icon: 'ic_home', key: Paths.Home, labelKey: 'home.tab_home' },
  {
    icon: 'ic_clock',
    key: Paths.Attendance,
    labelKey: 'home.tab_attendance',
  },
  { icon: 'ic_document', key: Paths.Requests, labelKey: 'home.tab_requests' },
  { icon: 'ic_bell', key: Paths.Notifications, labelKey: 'home.tab_notify' },
  { icon: 'user', key: Paths.Profile, labelKey: 'home.tab_profile' },
];

function BottomTabBar({ insets, navigation, state }: BottomTabBarProps) {
  const { t } = useTranslation();
  const activeRoute = state.routes[state.index];

  const handlePress = useCallback(
    (routeName: string) => {
      navigation.dispatch(CommonActions.navigate(routeName));
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = activeRoute?.name === tab.key;
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.75}
            onPress={() => handlePress(tab.key)}
            style={[
              styles.tabItem,
              { paddingBottom: ifAndroid(16, ifIphoneX(insets.bottom, 10)) },
            ]}
            testID={`bottom-tab-${tab.key}`}
          >
            <Image
              color={color}
              height={TAB_ICON_SIZE}
              name={tab.icon}
              type="svg"
              width={TAB_ICON_SIZE}
            />
            <Text style={[styles.label, { color }]}>{t(tab.labelKey)}</Text>
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
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray19,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingTop: ScaleSize(10),
  },
  label: {
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
});
