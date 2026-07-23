import type { WalletTransaction } from '@hooks/useSourceOfFund';

import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';

const AMOUNT_COLORS: Record<WalletTransaction['type'], string> = {
  charge: '#2F7CF6',
  point: '#2E8B4A',
  spend: '#E14B4B',
};

function formatAmount(transaction: WalletTransaction): string {
  const { amount, type } = transaction;
  const sign = amount > 0 ? '+' : '';
  if (type === 'point') {
    return `${sign}${formatCurrency(amount)}P`;
  }
  return `${sign}${formatCurrency(amount)}원`;
}

function TransactionRow({
  transaction,
}: {
  readonly transaction: WalletTransaction;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.rowTitle}>{transaction.title}</Text>
        <Text style={styles.method}>{transaction.method}</Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[styles.amount, { color: AMOUNT_COLORS[transaction.type] }]}
        >
          {formatAmount(transaction)}
        </Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}

type Properties = {
  readonly onViewAllTransactions: () => void;
  readonly transactions: readonly WalletTransaction[];
};

function TransactionHistories({
  onViewAllTransactions,
  transactions,
}: Properties) {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{t('source_of_fund.recent_history')}</Text>
        <AppButton
          onPress={onViewAllTransactions}
          style={styles.manageButton}
          testID="source-of-fund-view-all"
        >
          <Text style={styles.manageText}>{t('source_of_fund.view_all')}</Text>
        </AppButton>
      </View>

      <View style={styles.list}>
        {transactions?.length > 0 ? (
          transactions.map(transaction => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text style={styles.desc}>{t('source_of_fund.no_history')}</Text>
        )}
      </View>
    </>
  );
}

export default React.memo(TransactionHistories);

const styles = StyleSheet.create({
  amount: {
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  date: {
    color: '#9B9B9B',
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  desc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(28),
    paddingHorizontal: ScaleSize(20),
  },
  left: {
    flex: 1,
  },
  list: {
    paddingHorizontal: ScaleSize(20),
  },
  manageButton: {
    borderColor: '#DBDBDB',
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
  },
  manageText: {
    color: '#717171',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  method: {
    color: '#9B9B9B',
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(6),
  },
  right: {
    alignItems: 'flex-end',
  },
  row: {
    alignItems: 'center',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: ScaleSize(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(16),
  },
  rowTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '800',
  },
});
