import type { IVoucher } from '@type/account';
import type { ListRenderItem } from 'react-native';

import { Colors } from '@constants';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import VoucherCard from './VoucherCard';
import EmptyView from '@components/EmptyView';
import imageNames from '@assets/images/names';

const END_REACHED_THRESHOLD = 0.3;

type Properties = {
  readonly loading?: boolean;
  readonly loadingMore?: boolean;
  readonly onLoadMore?: () => void;
  readonly onRefresh?: () => void;
  readonly onUse: (voucher: IVoucher) => void;
  readonly refreshing?: boolean;
  readonly vouchers: readonly IVoucher[];
};

const keyExtractor = (voucher: IVoucher) => voucher.id;

function VoucherList({
  loading,
  loadingMore = false,
  onLoadMore,
  onRefresh,
  onUse,
  refreshing = false,
  vouchers,
}: Properties) {
  const { t } = useTranslation();

  const renderItem = useCallback<ListRenderItem<IVoucher>>(
    ({ item }) => <VoucherCard onUse={onUse} voucher={item} />,
    [onUse],
  );

  const renderEmpty = useCallback(
    () =>
      loading ? undefined : (
        <EmptyView desc={t('common.no_data')} icon={imageNames.ic_vouchers} />
      ),
    [loading],
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <ActivityIndicator
          color={Colors.primary}
          style={styles.footerLoading}
        />
      );
    }
    return vouchers.length === 0 ? undefined : (
      <Text style={styles.footer}>
        {t('vouchers.holding_count', { count: vouchers.length })}
      </Text>
    );
  }, [loadingMore, t, vouchers.length]);

  return (
    <FlatList
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.content}
      data={vouchers}
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

export default React.memo(VoucherList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  footer: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  footerLoading: {
    marginTop: ScaleSize(12),
  },
});
