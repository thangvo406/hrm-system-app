import type { LayoutChangeEvent, ViewStyle } from 'react-native';

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Colors } from '@constants';

const TABS_PADDING = 4;
const INDICATOR_DURATION = 220;

type TabItem<T extends string> = {
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
        {tabs.map(tab => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={tab.id}
            onPress={() => {
              handleTabChange(tab.id);
            }}
            style={styles.tab}
            testID={tab.testID}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 11,
    zIndex: 2,
  },
  tabContent: {
    flex: 1,
  },
  tabContentHidden: {
    display: 'none',
  },
  tabIndicator: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    bottom: TABS_PADDING,
    left: TABS_PADDING,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    top: TABS_PADDING,
    zIndex: 1,
  },
  tabs: {
    backgroundColor: Colors.gray3,
    borderRadius: 10,
    flexDirection: 'row',
    padding: TABS_PADDING,
  },
  tabText: {
    color: '#7A7A7A',
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});

export default React.memo(SegmentedTab) as typeof SegmentedTab;
