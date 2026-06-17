import type { NotificationItem, NotificationKind } from '@hooks';
import type { Profile as ProfileType } from '@services/request/account';
import type { ListRenderItem } from 'react-native';

import { Image, HomeHeader } from '@components';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useNotifications } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_BG = '#E6F4EA';
const ICON_COLOR = '#2FA94A';
const ICON_CIRCLE_SIZE = ScaleSize(56);
const ICON_SIZE = ScaleSize(28);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';
const TEXT_DATE = '#7A7A7A';

const ICON_BY_KIND: Record<NotificationKind, 'ic_clock' | 'ic_store' | 'send'> =
  {
    contribution_done: 'send',
    delivery_done: 'ic_clock',
    payment_done: 'ic_store',
  };

const onOpenMenu = () => {
  AppNavigator.showMenu();
};

const keyExtractor = (item: NotificationItem) => item.id;

type CardProps = {
  readonly item: NotificationItem;
};

function NotificationCard({ item }: CardProps) {
  return (
    <View style={styles.card} testID={`notification-${item.id}`}>
      <View style={styles.iconCircle}>
        <Image
          color={ICON_COLOR}
          height={ICON_SIZE}
          name={ICON_BY_KIND[item.kind]}
          type="svg"
          width={ICON_SIZE}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );
}

const MemoCard = React.memo(NotificationCard);

const renderItem: ListRenderItem<NotificationItem> = ({ item }) => (
  <MemoCard item={item} />
);

function ListEmpty({ loading }: { readonly loading: boolean }) {
  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={ICON_COLOR} />
      </View>
    );
  }
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>알림이 없습니다.</Text>
    </View>
  );
}

function Notifications() {
  const profile: ProfileType | undefined = useAppSelector(
    AccountSelector.getProfile,
  );
  const insets = useSafeAreaInsets();
  const { data, loading, refresh } = useNotifications();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HomeHeader
        isShowLabelMember
        onOpenMenu={onOpenMenu}
        profile={profile}
        hideIconNotify
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<ListEmpty loading={loading} />}
        refreshControl={
          <RefreshControl
            colors={[ICON_COLOR]}
            onRefresh={refresh}
            refreshing={loading}
            tintColor={ICON_COLOR}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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
    color: TEXT_DATE,
    fontSize: ScaleSize(12),
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
