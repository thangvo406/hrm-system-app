import type { ListRenderItem } from 'react-native';
import type { IDividendHistory } from '@type';

import { AppButton, EmptyView } from '@components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import imageNames from '@assets/images/names';
import { TransactionHistoriesLoading } from '@components';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const AMOUNT_TRAN_FAILED = '#D32F2F';

const TransactionRow = React.memo(
  ({
    item,
    onPress,
  }: {
    readonly item: IDividendHistory;
    readonly onPress?: (data: any) => void;
  }) => {
    const { t } = useTranslation();
    return (
      <AppButton
        onPress={() => onPress?.(item)}
        style={styles.row}
        testID={`pay-card-transaction-${item.id}`}
      >
        <View style={styles.topRow}>
          <Text style={styles.amount}>
            {formatCurrency(item.totalDividend)} 원
          </Text>
          <Text style={styles.date}>
            {dayjs(item.paidAt).format('YYYY-MM-DD hh:mmA')}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.description}>{item.fiscalYear}</Text>
          <Text style={styles.balance}>
            {t('contribute_history.dividend_row.contribution_dividend', {
              amount: formatCurrency(item.contributionDividend),
            })}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.balance}>
            {t('contribute_history.dividend_row.usage_dividend', {
              amount: formatCurrency(item.usageDividend),
            })}
          </Text>
          <Text style={styles.balance}>
            {t('contribute_history.dividend_row.cumulative_dividend', {
              amount: formatCurrency(item.balanceAfter),
            })}
          </Text>
        </View>
      </AppButton>
    );
  },
);

const keyExtractor = (item: IDividendHistory) => String(item.id);

type TransactionListProps = {
  readonly data: IDividendHistory[];
  readonly loading: boolean;
  readonly onLoadMore?: () => void;
  readonly onPressItem: (data: any) => void;
};

function TransactionList({
  data,
  onLoadMore,
  onPressItem,
  loading,
}: TransactionListProps) {
  const { t } = useTranslation();
  const renderItem: ListRenderItem<IDividendHistory> = ({ item }) => (
    <TransactionRow onPress={onPressItem} item={item} />
  );

  return (
    <>
      {loading ? (
        <TransactionHistoriesLoading />
      ) : data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyView
          desc={t('common.no_data')}
          icon={imageNames.ic_tran_history}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  balance: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(16),
    marginBottom: ScaleSize(8),
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  date: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  description: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(16),
    marginRight: ScaleSize(8),
  },
  failedText: {
    alignSelf: 'flex-end',
    color: AMOUNT_TRAN_FAILED,
    fontSize: ScaleSize(16),
    marginTop: ScaleSize(8),
  },
  row: {
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    paddingVertical: ScaleSize(16),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TransactionList;
