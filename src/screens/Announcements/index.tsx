import type { ListRenderItem } from 'react-native';
import type { AnnouncementItem } from '@hooks';

import { EmptyView, AnnouncementLoading, HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAnnouncements } from '@hooks';

import AnimatedTabs from './AnimatedTabs';
import AnnouncementRow from './AnnouncementRow';
import BannerCarousel from './BannerCarousel';
import ItemSeparator from './ItemSeparator';
import imageNames from '@assets/images/names';

const TEXT_MUTED = '#9E9E9E';

const keyExtractor = (item: AnnouncementItem) => String(item.id);

const TAB_TEST_IDS: readonly string[] = [
  'announcement-tab-all',
  'announcement-tab-notice',
  'announcement-tab-event',
];

function Announcements() {
  const { t } = useTranslation();
  const {
    onLoadMore,
    loading,
    onChangeTab,
    data,
    banners,
    tabIndex,
    onPressBannerItem,
    onPressNoticeItem,
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
    <View style={styles.safeArea}>
      <HeaderDetail title={t('announcements.title')} />
      <AnimatedTabs
        labels={labels}
        onChange={onChangeTab}
        testIDs={TAB_TEST_IDS}
        value={tabIndex}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BannerCarousel
          banners={banners}
          onPressItem={onPressBannerItem}
          tabIndex={tabIndex}
        />
        {loading ? (
          <AnnouncementLoading />
        ) : data?.length > 0 ? (
          <FlatList
            ItemSeparatorComponent={ItemSeparator}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={onLoadMore}
            onEndReachedThreshold={1.5}
          />
        ) : (
          <EmptyView
            icon={imageNames.ic_mega_phone}
            desc={t('common.no_data')}
            style={{
              marginTop: ScaleSize(banners?.length > 0 ? 40 : 0),
            }}
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
