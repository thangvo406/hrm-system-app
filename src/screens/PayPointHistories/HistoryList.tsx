import type { ListRenderItem } from 'react-native';

import { Colors } from '@constants';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import imageNames from '@assets/images/names';
import HistoryCard, { type PayPointHistoryType } from './HistoryCard';
import { IPointPayHistory } from '@type';
import { EmptyView } from '@components';
import PointNotice from './PointNotice';

const END_REACHED_THRESHOLD = 0.3;
const TEXT_COLOR_WARNING = '#B8730D';

type Properties = {
  readonly histories: readonly IPointPayHistory[];
  readonly loading?: boolean;
  readonly expiringAmount?: number;
  readonly loadingMore?: boolean;
  readonly onLoadMore?: () => void;
  readonly onViewExpireDetail?: () => void;
  readonly onRefresh?: () => void;
  readonly onPressItem: (item: any) => void;
  readonly refreshing?: boolean;
  readonly type: PayPointHistoryType;
};

const keyExtractor = (item: IPointPayHistory) => String(item.id);

function HistoryList({
  histories,
  loading = false,
  loadingMore = false,
  onLoadMore,
  onRefresh,
  onPressItem,
  onViewExpireDetail,
  expiringAmount,
  type,
  refreshing = false,
}: Properties) {
  const { t } = useTranslation();

  const renderItem: ListRenderItem<IPointPayHistory> = ({ item }) => (
    <HistoryCard onPressItem={onPressItem} item={item} type={type} />
  );
  const renderEmpty = useCallback(
    () =>
      loading ? undefined : (
        <EmptyView
          desc={t('pay_point.empty')}
          icon={imageNames.ic_placeholder_transaction}
          style={styles.empty}
        />
      ),
    [loading, t],
  );

  const renderFooter = useCallback(
    () =>
      loadingMore ? (
        <ActivityIndicator
          color={Colors.primary}
          style={styles.footerLoading}
        />
      ) : undefined,
    [loadingMore],
  );

  if (loading && histories.length === 0) {
    return <ActivityIndicator color={Colors.primary} style={styles.loading} />;
  }

  return (
    <FlatList
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.content}
      data={histories}
      ListHeaderComponent={
        <PointNotice amount={expiringAmount} onDismiss={onViewExpireDetail} />
      }
      keyExtractor={keyExtractor}
      onEndReached={onLoadMore}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          tintColor={Colors.primary}
        />
      }
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

export default React.memo(HistoryList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(6),
  },
  empty: {
    paddingVertical: ScaleSize(40),
  },
  footerLoading: {
    marginVertical: ScaleSize(12),
  },
  loading: {
    marginTop: ScaleSize(40),
  },
  warningBanner: {
    alignItems: 'center',
    backgroundColor: '#FEF6E1',
    borderRadius: ScaleSize(10),
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  warningIcon: {
    fontSize: ScaleSize(14),
  },
  linkText: {
    color: Colors.primary,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  warningText: {
    color: TEXT_COLOR_WARNING,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});
