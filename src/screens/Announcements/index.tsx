import type { LayoutChangeEvent, ListRenderItem } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { Carousel, HomeHeader } from '@components';
import type { CarouselHandle } from '@components/Carousel';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAnnouncements } from '@hooks';
import type { AnnouncementItem } from '@hooks';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNER_HORIZONTAL_PADDING = ScaleSize(16);
const BANNER_WIDTH = SCREEN_WIDTH - BANNER_HORIZONTAL_PADDING * 2;
const BANNER_HEIGHT = ScaleSize(220);

const TEXT_DARK = '#1A1A1A';
const TEXT_DATE = '#9E9E9E';
const TEXT_TAB_INACTIVE = '#5C5C5C';
const TEXT_MUTED = '#9E9E9E';
const DIVIDER_COLOR = '#EFEFEF';

type TabKey = 'all' | 'event' | 'notice';

type Banner = {
  readonly color: string;
  readonly id: string;
};

const BANNERS: readonly Banner[] = [
  { color: '#F8C8DC', id: 'b1' },
  { color: '#FFD9B7', id: 'b2' },
  { color: '#C8E6C9', id: 'b3' },
  { color: '#BBDEFB', id: 'b4' },
  { color: '#E1BEE7', id: 'b5' },
];

const onOpenMenu = () => {
  AppNavigator.showMenu();
};

const keyExtractor = (item: AnnouncementItem) => item.id;
const bannerKeyExtractor = (item: Banner) => item.id;

type RowProps = {
  readonly item: AnnouncementItem;
};

function AnnouncementRow({ item }: RowProps) {
  return (
    <View style={styles.row} testID={`announcement-${item.id}`}>
      <Text style={styles.rowIcon}>{item.icon}</Text>
      <Text numberOfLines={1} style={styles.rowTitle}>
        {item.title}
      </Text>
      <Text style={styles.rowDate}>{item.date}</Text>
    </View>
  );
}

const MemoRow = React.memo(AnnouncementRow);

const renderItem: ListRenderItem<AnnouncementItem> = ({ item }) => (
  <MemoRow item={item} />
);

function ItemSeparator() {
  return <View style={styles.separator} />;
}

type TabButtonProps = {
  readonly index: number;
  readonly label: string;
  readonly onLayout: (index: number, event: LayoutChangeEvent) => void;
  readonly onPress: (index: number) => void;
  readonly progress: SharedValue<number>;
  readonly testID: string;
};

const TAB_TIMING_DURATION = 280;

function TabButton({
  index,
  label,
  onLayout,
  onPress,
  progress,
  testID,
}: TabButtonProps) {
  const handleLayout = (event: LayoutChangeEvent) => {
    onLayout(index, event);
  };
  const handlePress = () => {
    onPress(index);
  };

  const textStyle = useAnimatedStyle(() => {
    const distance = Math.abs(progress.value - index);
    const ratio = Math.min(distance, 1);
    const color = interpolateColor(
      ratio,
      [0, 1],
      ['#FFFFFF', TEXT_TAB_INACTIVE],
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onLayout={handleLayout}
      onPress={handlePress}
      style={styles.tab}
      testID={testID}
    >
      <Animated.Text style={[styles.tabText, textStyle]}>{label}</Animated.Text>
    </TouchableOpacity>
  );
}

type TabLayout = {
  readonly width: number;
  readonly x: number;
};

const TAB_ROW_PADDING = ScaleSize(16);

type AnimatedTabsProps = {
  readonly labels: readonly string[];
  readonly onChange: (index: number) => void;
  readonly testIDs: readonly string[];
  readonly value: number;
};

function AnimatedTabs({ labels, onChange, testIDs, value }: AnimatedTabsProps) {
  const progress = useSharedValue(value);
  const [layouts, setLayouts] = useState<readonly (TabLayout | undefined)[]>(
    () => labels.map(() => undefined),
  );

  const onTabLayout = (index: number, event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    setLayouts(previous => {
      const current = previous[index];
      if (current && current.width === width && current.x === x) {
        return previous;
      }
      const next = [...previous];
      next[index] = { width, x };
      return next;
    });
  };

  const onPressTab = (index: number) => {
    progress.value = withTiming(index, {
      duration: TAB_TIMING_DURATION,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
    onChange(index);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const lower = Math.floor(progress.value);
    const upper = Math.min(lower + 1, layouts.length - 1);
    const ratio = progress.value - lower;
    const lowerLayout = layouts[lower];
    const upperLayout = layouts[upper];
    if (!lowerLayout || !upperLayout) {
      return { opacity: 0 };
    }
    const x =
      lowerLayout.x + (upperLayout.x - lowerLayout.x) * ratio - TAB_ROW_PADDING;
    const width =
      lowerLayout.width + (upperLayout.width - lowerLayout.width) * ratio;
    return {
      opacity: 1,
      transform: [{ translateX: x }],
      width,
    };
  });

  return (
    <View style={styles.tabRow}>
      <Animated.View
        pointerEvents="none"
        style={[styles.tabIndicator, indicatorStyle]}
      />
      {labels.map((label, index) => (
        <TabButton
          index={index}
          key={label}
          label={label}
          onLayout={onTabLayout}
          onPress={onPressTab}
          progress={progress}
          testID={testIDs[index] ?? `announcement-tab-${index}`}
        />
      ))}
    </View>
  );
}

const renderBanner: ListRenderItem<Banner> = ({ item }) => (
  <View
    style={[styles.bannerSlide, { backgroundColor: item.color }]}
    testID={`announcement-banner-${item.id}`}
  >
    <View style={styles.bannerOverlay}>
      <Text style={styles.bannerKicker}>한국대학교 학사지원팀</Text>
      <Text style={styles.bannerTitle}>2026년 봄 학기</Text>
      <Text style={styles.bannerTitle}>개강 및 학사 일정 공지!</Text>
      <View style={styles.bannerInfoBox}>
        <Text style={styles.bannerInfoLine}>📅 3월 4일 (월) 개강!</Text>
        <Text style={styles.bannerInfoLine}>
          📝 수강 신청 확인 및 변경 기간:
        </Text>
        <Text style={styles.bannerInfoSub}>3월 4일(월) ~ 3월 8일(금)</Text>
        <Text style={styles.bannerInfoLine}>📚 등록금 납부 기간:</Text>
        <Text style={styles.bannerInfoSub}>3월 11일(월) ~ 3월 15일(금)</Text>
        <Text style={styles.bannerInfoLine}>📖 1학기 중간고사:</Text>
        <Text style={styles.bannerInfoSub}>4월 22일(월) ~ 4월 26일(금)</Text>
      </View>
    </View>
  </View>
);

function BannerCarousel({ tabIndex }: { readonly tabIndex: number }) {
  const carouselReference = useRef<CarouselHandle>(null);

  useEffect(() => {
    carouselReference.current?.scrollToIndex(0);
  }, [tabIndex]);

  return (
    <Carousel
      data={BANNERS}
      horizontalPadding={BANNER_HORIZONTAL_PADDING}
      itemWidth={BANNER_WIDTH}
      keyExtractor={bannerKeyExtractor}
      ref={carouselReference}
      renderItem={renderBanner}
      style={styles.bannerWrap}
      testID="announcement-carousel"
    />
  );
}

const TAB_KEYS: readonly TabKey[] = ['all', 'notice', 'event'];
const TAB_TEST_IDS: readonly string[] = [
  'announcement-tab-all',
  'announcement-tab-notice',
  'announcement-tab-event',
];

function Announcements() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tabIndex, setTabIndex] = useState(0);
  const ownerProfile = useAppSelector(AccountSelector.getProfile);
  const { data, loading } = useAnnouncements();

  const tab = TAB_KEYS[tabIndex];

  const filtered = useMemo(() => {
    if (tab === 'all') {
      return data;
    }
    return data.filter(item => item.kind === tab);
  }, [data, tab]);

  const labels = useMemo(
    () => [
      t('announcements.tab_all'),
      t('announcements.tab_notice'),
      t('announcements.tab_event'),
    ],
    [t],
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HomeHeader
        hideIconNotify
        onOpenMenu={onOpenMenu}
        profile={ownerProfile}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedTabs
          labels={labels}
          onChange={setTabIndex}
          testIDs={TAB_TEST_IDS}
          value={tabIndex}
        />
        <BannerCarousel tabIndex={tabIndex} />
        {loading && filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('announcements.loading')}</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('announcements.empty')}</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default Announcements;

const styles = StyleSheet.create({
  bannerInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: ScaleSize(10),
    gap: ScaleSize(2),
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(8),
  },
  bannerInfoLine: {
    color: TEXT_DARK,
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  bannerInfoSub: {
    color: '#5C5C5C',
    fontSize: ScaleSize(10),
    marginLeft: ScaleSize(14),
  },
  bannerKicker: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: ScaleSize(8),
    color: TEXT_DARK,
    fontSize: ScaleSize(10),
    overflow: 'hidden',
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(2),
  },
  bannerOverlay: {
    flex: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  bannerSlide: {
    borderRadius: ScaleSize(14),
    height: BANNER_HEIGHT,
    marginRight: 0,
    overflow: 'hidden',
    width: BANNER_WIDTH,
  },
  bannerTitle: {
    color: '#C2185B',
    fontSize: ScaleSize(20),
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  bannerWrap: {
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: ScaleSize(48),
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  rowDate: {
    color: TEXT_DATE,
    fontSize: ScaleSize(12),
  },
  rowIcon: {
    fontSize: ScaleSize(16),
  },
  rowTitle: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
  separator: {
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginHorizontal: ScaleSize(16),
  },
  tab: {
    alignItems: 'center',
    borderRadius: ScaleSize(20),
    height: ScaleSize(34),
    justifyContent: 'center',
    minWidth: ScaleSize(72),
    paddingHorizontal: ScaleSize(16),
  },
  tabIndicator: {
    backgroundColor: TEXT_DARK,
    borderRadius: ScaleSize(20),
    bottom: ScaleSize(12),
    height: ScaleSize(34),
    left: ScaleSize(16),
    position: 'absolute',
    top: ScaleSize(12),
  },
  tabRow: {
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(12),
  },
  tabText: {
    color: TEXT_TAB_INACTIVE,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});
