import type { WalletTransaction } from '@hooks/useSourceOfFund';

import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '@utils/product';

const AMOUNT_COLORS: Record<WalletTransaction['type'], string> = {
  charge: '#2F7CF6',
  point: '#2E8B4A',
  spend: '#E14B4B',
};

type Properties = {
  readonly transaction: WalletTransaction;
};

function formatAmount(transaction: WalletTransaction): string {
  const { amount, type } = transaction;
  const sign = amount > 0 ? '+' : '';
  if (type === 'point') {
    return `${sign}${formatCurrency(amount)}P`;
  }
  return `${sign}${formatCurrency(amount)}원`;
}

function TransactionRow({ transaction }: Properties) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.method}>{transaction.method}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: AMOUNT_COLORS[transaction.type] }]}>
          {formatAmount(transaction)}
        </Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
    </View>
  );
}

export default React.memo(TransactionRow);

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
  left: {
    flex: 1,
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
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
