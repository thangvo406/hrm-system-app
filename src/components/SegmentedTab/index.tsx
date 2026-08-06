import type { IconName } from '@assets/icons';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from '@components/Image';
import React, { useEffect, useMemo, useState } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';

const ACTIVE_INK = '#FFFFFF';
const DIVIDER_COLOR = Colors.gray07;
const DIVIDER_INSET = ScaleSize(11);
const ICON_GAP = ScaleSize(8);
const ICON_SIZE = ScaleSize(18);
const INACTIVE_INK = Colors.gray4;
const INDICATOR_DURATION = 220;
const PILL_RADIUS = ScaleSize(100);
const TABS_PADDING = ScaleSize(4);
const TRACK_BACKGROUND = '#F5F6F7';

type TabItem<T extends string> = {
  readonly icon?: IconName;
  readonly id: T;
  readonly label: string;
  readonly render?: () => React.ReactNode;
  readonly testID?: string;
};

type SegmentedTabProps<T extends string> = {
  readonly activeTab: T;
  readonly onTabChange: (tab: T) => void;
  readonly style?: ViewStyle;
  readonly tabs: readonly TabItem<T>[];
};

type TabContentInnerProps = {
  readonly render: () => React.ReactNode;
};

const TabContentInner = React.memo(function TabContentInner({
  render,
}: TabContentInnerProps) {
  return <>{render()}</>;
});

function SegmentedTab<T extends string>({
  activeTab,
  onTabChange,
  style,
  tabs,
}: SegmentedTabProps<T>) {
  const [tabsWidth, setTabsWidth] = useState(0);
  const [mountedTabs, setMountedTabs] = useState<ReadonlySet<T>>(
    () => new Set([activeTab]),
  );
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;
  const progress = useMemo(() => new Animated.Value(safeIndex), []);

  useEffect(() => {
    Animated.timing(progress, {
      duration: INDICATOR_DURATION,
      easing: Easing.out(Easing.ease),
      toValue: Math.max(0, activeIndex),
      useNativeDriver: true,
    }).start();
  }, [activeIndex, progress]);

  const handleTabChange = (tab: T) => {
    if (!mountedTabs.has(tab)) {
      setMountedTabs(prev => new Set([...prev, tab]));
    }
    onTabChange(tab);
  };

  const tabCount = tabs.length;
  const indicatorWidth =
    tabsWidth > 0 && tabCount > 0
      ? (tabsWidth - TABS_PADDING * 2) / tabCount
      : 0;

  const indicatorStyle =
    tabCount > 1
      ? {
          transform: [
            {
              translateX: progress.interpolate({
                inputRange: tabs.map((_, index) => index),
                outputRange: tabs.map((_, index) => index * indicatorWidth),
              }),
            },
          ],
        }
      : undefined;

  const onTabsLayout = (event: LayoutChangeEvent) => {
    setTabsWidth(event.nativeEvent?.layout?.width);
  };

  return (
    <>
      <View onLayout={onTabsLayout} style={[styles.tabs, style]}>
        {indicatorWidth > 0 ? (
          <Animated.View
            style={[
              styles.tabIndicator,
              { width: indicatorWidth },
              indicatorStyle,
            ]}
          />
        ) : undefined}
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={tab.id}
              onPress={() => {
                handleTabChange(tab.id);
              }}
              style={styles.tab}
              testID={tab.testID}
            >
              {tab.icon === undefined ? undefined : (
                <Image
                  color={isActive ? ACTIVE_INK : INACTIVE_INK}
                  height={ICON_SIZE}
                  name={tab.icon}
                  type="svg"
                  width={ICON_SIZE}
                />
              )}
              <Text
                numberOfLines={1}
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {tabs.some(tab => tab.render !== undefined) &&
        tabs.map(tab =>
          tab.render === undefined ? undefined : (
            <View
              key={tab.id}
              style={
                activeTab === tab.id
                  ? styles.tabContent
                  : styles.tabContentHidden
              }
            >
              {mountedTabs.has(tab.id) ? (
                <TabContentInner render={tab.render} />
              ) : undefined}
            </View>
          ),
        )}
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: DIVIDER_COLOR,
    bottom: DIVIDER_INSET,
    position: 'absolute',
    top: DIVIDER_INSET,
    width: 1,
    zIndex: 0,
  },
  tab: {
    alignItems: 'center',
    columnGap: ICON_GAP,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: ScaleSize(11),
    zIndex: 2,
  },
  tabContent: {
    flex: 1,
  },
  tabContentHidden: {
    display: 'none',
  },
  tabIndicator: {
    backgroundColor: Colors.green02,
    borderRadius: PILL_RADIUS,
    bottom: TABS_PADDING,
    left: TABS_PADDING,
    position: 'absolute',
    top: TABS_PADDING,
    zIndex: 1,
  },
  tabs: {
    backgroundColor: TRACK_BACKGROUND,
    borderRadius: PILL_RADIUS,
    elevation: 2,
    flexDirection: 'row',
    padding: TABS_PADDING,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabText: {
    color: INACTIVE_INK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  tabTextActive: {
    color: ACTIVE_INK,
    fontWeight: '700',
  },
});

export default React.memo(SegmentedTab) as typeof SegmentedTab;
