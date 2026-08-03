import type { ListRenderItem } from 'react-native';
import type { IContributeHistory, TransactionHistory } from '@type';

import { AppButton, EmptyView } from '@components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import imageNames from '@assets/images/names';
import { TransactionHistoriesLoading } from '@components';
import isNumber from 'lodash/isNumber';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const AMOUNT_CREDIT_COLOR = '#3eb44a';
const AMOUNT_DEBIT_COLOR = 'rgba(211, 47, 47, 0.5)';
const AMOUNT_TRAN_FAILED = '#D32F2F';
const AMOUNT_TRAN_PENDING = '#c9c42e';

function TransactionRow({
  item,
  onPress,
}: {
  readonly item: IContributeHistory;
  readonly onPress?: (data: any) => void;
}) {
  const { t } = useTranslation();
  const isSuccess = item.status === 'APPROVED';
  const isPending = item.status === 'PENDING';
  const isCredit = item.type == 'INCREASE';

  const amountColor = isPending
    ? AMOUNT_TRAN_PENDING
    : !isSuccess
      ? AMOUNT_TRAN_FAILED
      : isCredit
        ? AMOUNT_CREDIT_COLOR
        : AMOUNT_DEBIT_COLOR;

  return (
    <AppButton
      onPress={() => onPress?.(item)}
      style={styles.row}
      testID={`pay-card-transaction-${item.id}`}
    >
      <View style={styles.topRow}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isNumber(item.amount)
            ? `${isCredit ? '+' : '-'} ${formatCurrency(item.amount)}`
            : '-'}
        </Text>
        <Text style={styles.date}>
          {dayjs(item.occurredAt).format('YYYY-MM-DD hh:mmA')}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.description}>{item.displayType}</Text>
        <Text style={styles.balance}>
          {!isNumber(item.balanceAfter)
            ? '-'
            : t('pay_card.balance_after', {
                amount: formatCurrency(item.balanceAfter),
              })}
        </Text>
      </View>
      {isPending || isSuccess ? undefined : (
        <Text style={styles.failedText}>
          {t('pay_card.transaction_failed')}
        </Text>
      )}
    </AppButton>
  );
}

export const MemoTransactionRow = React.memo(TransactionRow);

const keyExtractor = (item: TransactionHistory) => String(item.id);

type TransactionListProps = {
  readonly data: TransactionHistory[];
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
  const renderItem: ListRenderItem<TransactionHistory> = ({ item }) => (
    <MemoTransactionRow onPress={onPressItem} item={item} />
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
