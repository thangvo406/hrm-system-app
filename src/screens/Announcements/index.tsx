import type { LayoutChangeEvent, ListRenderItem } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { HomeHeader, AnnouncementLoading, ProgressiveImage } from '@components';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Carousel, {
  type CarouselRenderItem,
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { useAnnouncements } from '@hooks';
import type { AnnouncementImage, AnnouncementItem } from '@hooks';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNER_HORIZONTAL_PADDING = ScaleSize(16);
const BANNER_WIDTH = SCREEN_WIDTH - BANNER_HORIZONTAL_PADDING * 2;
const BANNER_HEIGHT = ScaleSize(220);

const TEXT_DARK = '#1A1A1A';
const TEXT_DATE = '#9E9E9E';
const TEXT_TAB_INACTIVE = '#5C5C5C';
const TEXT_MUTED = '#9E9E9E';
const DIVIDER_COLOR = '#EFEFEF';
const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_INACTIVE_COLOR = '#E0E0E0';
const DOT_ACTIVE_COLOR = '#54C158';

const onOpenMenu = () => {
  AppNavigator.showMenu();
};

const keyExtractor = (item: AnnouncementItem) => String(item.id);

type RowProps = {
  readonly item: AnnouncementItem;
};

function AnnouncementRow({ item }: RowProps) {
  return (
    <View style={styles.row} testID={`announcement-${item.id}`}>
      <Text numberOfLines={1} style={styles.rowTitle}>
        {item.title}
      </Text>
      <Text style={styles.rowDate}>
        {dayjs(item.createdDate).format('YY-MM-DD')}
      </Text>
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

const renderBanner: CarouselRenderItem<AnnouncementImage> = ({ item }) => (
  <View style={styles.bannerSlide} testID={`announcement-banner-${item.id}`}>
    <ProgressiveImage
      height={BANNER_HEIGHT}
      url={item.fileUrl}
      resizeMode="stretch"
      width={BANNER_WIDTH}
    />
  </View>
);

function BannerCarousel({
  tabIndex,
  banners,
}: {
  readonly banners: readonly AnnouncementImage[];
  readonly tabIndex: number;
}) {
  const carouselReference = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  useEffect(() => {
    carouselReference.current?.scrollTo({ animated: true, index: 0 });
  }, [tabIndex]);

  return (
    <View style={styles.bannerContainer}>
      <Carousel
        ref={carouselReference}
        data={banners as AnnouncementImage[]}
        height={BANNER_HEIGHT}
        loop
        autoPlay
        pagingEnabled
        renderItem={renderBanner}
        style={styles.bannerWrap}
        testID="announcement-carousel"
        width={BANNER_WIDTH}
        onProgressChange={progress}
      />
      <PaginationDots
        activeColor={DOT_ACTIVE_COLOR}
        activeWidth={DOT_ACTIVE_WIDTH}
        count={banners?.length || 0}
        gap={ScaleSize(3)}
        inactiveColor={DOT_INACTIVE_COLOR}
        progress={progress}
        size={DOT_SIZE}
      />
    </View>
  );
}

type PaginationDotProps = {
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly index: number;
  readonly progress: SharedValue<number>;
  readonly size: number;
};

function PaginationDot({
  activeColor,
  activeWidth,
  gap,
  inactiveColor,
  index,
  progress,
  size,
}: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const val = Math.abs(progress.value - index);
    return {
      backgroundColor: interpolateColor(
        val,
        [0, 0.5, 1],
        [activeColor, inactiveColor, inactiveColor],
      ),
      marginHorizontal: gap,
      width: interpolate(
        val,
        [0, 0.5, 1],
        [activeWidth, size, size],
        Extrapolation.CLAMP,
      ),
    };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
}

type PaginationDotsProps = {
  readonly activeColor: string;
  readonly activeWidth: number;
  readonly count: number;
  readonly gap: number;
  readonly inactiveColor: string;
  readonly progress: SharedValue<number>;
  readonly size: number;
};

function PaginationDots({
  activeColor,
  activeWidth,
  count,
  gap,
  inactiveColor,
  progress,
  size,
}: PaginationDotsProps) {
  return (
    <View style={styles.paginationRow}>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationDot
          activeColor={activeColor}
          activeWidth={activeWidth}
          gap={gap}
          inactiveColor={inactiveColor}
          index={index}
          progress={progress}
          size={size}
          // eslint-disable-next-line react/no-array-index-key -- static positions, no reordering
          key={`pagination-dot-${index}`}
        />
      ))}
    </View>
  );
}

const TAB_TEST_IDS: readonly string[] = [
  'announcement-tab-all',
  'announcement-tab-notice',
  'announcement-tab-event',
];

function Announcements() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const ownerProfile = useAppSelector(AccountSelector.getProfile);
  const {
    onLoadMore,
    onRefreshBanners,
    loading,
    onChangeTab,
    data,
    banners,
    tabIndex,
  } = useAnnouncements();

  useFocusEffect(
    useCallback(() => {
      onRefreshBanners();
    }, [onRefreshBanners]),
  );

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
          onChange={onChangeTab}
          testIDs={TAB_TEST_IDS}
          value={tabIndex}
        />
        <BannerCarousel banners={banners} tabIndex={tabIndex} />
        {loading ? (
          <AnnouncementLoading />
        ) : data?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('announcements.empty')}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            onEndReached={onLoadMore}
            onEndReachedThreshold={1.5}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default Announcements;

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  bannerInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: ScaleSize(10),
    bottom: ScaleSize(36),
    gap: ScaleSize(4),
    left: ScaleSize(14),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(8),
    position: 'absolute',
    right: ScaleSize(14),
  },
  bannerInfoColumn: {
    flex: 1,
  },
  bannerInfoIcon: {
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(1),
  },
  bannerInfoLine: {
    color: TEXT_DARK,
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  bannerInfoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  bannerInfoSub: {
    color: '#5C5C5C',
    fontSize: ScaleSize(10),
    marginLeft: ScaleSize(2),
    marginTop: ScaleSize(1),
  },
  bannerKicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: ScaleSize(8),
    color: TEXT_DARK,
    fontSize: ScaleSize(10),
    fontWeight: '600',
    lineHeight: ScaleSize(13),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
    textAlign: 'center',
  },
  bannerScrim: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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
    textShadowColor: 'rgba(255, 255, 255, 0.85)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 3,
  },
  bannerTitleWrap: {
    alignItems: 'center',
    left: ScaleSize(16),
    paddingRight: ScaleSize(80),
    position: 'absolute',
    right: ScaleSize(16),
    top: ScaleSize(8),
  },
  bannerTopRow: {
    position: 'absolute',
    right: ScaleSize(16),
    top: ScaleSize(8),
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
  paginationDot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
  },
  paginationRow: {
    alignSelf: 'center',
    bottom: ScaleSize(10),
    flexDirection: 'row',
    position: 'absolute',
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
    borderWidth: 1,
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
