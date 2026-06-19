import type { ListRenderItem } from 'react-native';
import type { AnnouncementItem } from '@hooks';

import { HomeHeader, AnnouncementLoading } from '@components';
import { ScaleSize } from '@kits/core';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useAnnouncements } from '@hooks';

import AnimatedTabs from './AnimatedTabs';
import AnnouncementRow from './AnnouncementRow';
import BannerCarousel from './BannerCarousel';
import ItemSeparator from './ItemSeparator';

const TEXT_MUTED = '#9E9E9E';

const keyExtractor = (item: AnnouncementItem) => String(item.id);

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
    loading,
    onChangeTab,
    data,
    banners,
    tabIndex,
    onPressBannerItem,
    onPressNoticeItem,
    onOpenMenu,
  } = useAnnouncements();

  const renderItem: ListRenderItem<AnnouncementItem> = useCallback(
    ({ item }) => <AnnouncementRow item={item} onPress={onPressNoticeItem} />,
    [],
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
        <BannerCarousel
          banners={banners}
          onPressItem={onPressBannerItem}
          tabIndex={tabIndex}
        />
        {loading ? (
          <AnnouncementLoading />
        ) : data?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('announcements.empty')}</Text>
          </View>
        ) : (
          <FlatList
            ItemSeparatorComponent={ItemSeparator}
            data={data}
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
  empty: {
    alignItems: 'center',
    paddingVertical: ScaleSize(48),
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
});
