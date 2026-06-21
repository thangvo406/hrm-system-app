import type { NotificationItem } from '@hooks';
import type { ListRenderItem } from 'react-native';

import {
  Image,
  HeaderDetail,
  EmptyView,
  NotificationsLoading,
  AppButton,
} from '@components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@hooks';
import dayjs from 'dayjs';
import { Colors } from '@constants';

const ICON_BG = '#E6F4EA';
const ICON_COLOR = '#2FA94A';
const ICON_CIRCLE_SIZE = ScaleSize(56);
const ICON_SIZE = ScaleSize(28);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = Colors.gray4;

const keyExtractor = (item: NotificationItem) => item.id;

type CardProps = {
  readonly item: NotificationItem;
  readonly onPressItem: (item: NotificationItem) => void;

};

function NotificationCard({ item, onPressItem }: CardProps) {
  const backgroundColor = item.read ? 'white' : 'rgba(188, 188, 188, 0.8)'
  return (
    <AppButton style={[styles.card, { backgroundColor }]} testID={`notification-${item.id}`}
      onPress={() => onPressItem?.(item)}>
      <View style={styles.iconCircle}>
        <Image
          color={ICON_COLOR}
          height={ICON_SIZE}
          // name={ICON_BY_KIND[item.type]}
          name="send"
          type="svg"
          width={ICON_SIZE}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.date}>
            {dayjs(item.createdDate).format('YYYY.MM.DD HH:mmA')}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.description}>
          {item.message}
        </Text>
      </View>
    </AppButton>
  );
}

const MemoCard = React.memo(NotificationCard);


function Notifications() {
  const { t } = useTranslation();
  const { data, disabledBtnReadAll, loading, onPressItem, onMarkReadAll, onLoadMore } = useNotifications();


const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
  <MemoCard onPressItem={onPressItem} item={item} />
);


  return (
    <View style={styles.safeArea}>
      <HeaderDetail disabledBtnReadAll={disabledBtnReadAll} onPressReadAll={onMarkReadAll} showIconReadAll hideNotify title={t('notifications.title')} />

      {loading ? (
        <NotificationsLoading />
      ) : data?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={keyExtractor}
          onEndReached={onLoadMore}
          onEndReachedThreshold={1.5}
          // refreshControl={
          //   <RefreshControl
          //     colors={[ICON_COLOR]}
          //     onRefresh={refresh}
          //     refreshing={loading}
          //     tintColor={ICON_COLOR}
          //   />
          // }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyView
          icon="ic_notify_gray"
          type="svg"
          desc={t('common.no_data')}
        />
      )}
    </View>
  );
}

export default Notifications;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(18),
    elevation: 2,
    flexDirection: 'row',
    gap: ScaleSize(14),
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(18),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
    gap: ScaleSize(6),
  },
  date: {
    color: 'black',
    fontSize: ScaleSize(10),
    fontWeight: 'bold',
  },
  description: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScaleSize(48),
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    height: ICON_CIRCLE_SIZE,
    justifyContent: 'center',
    width: ICON_CIRCLE_SIZE,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(8),
  },
  safeArea: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    color: TEXT_DARK,
    flexShrink: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginRight: ScaleSize(8),
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
