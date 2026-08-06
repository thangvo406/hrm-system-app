import type { TranslationKeys } from '@translations/i18next';
import type { ITransactionMovement } from '@type';

import { Colors } from '@constants';
import { TRANSACTION_DETAIL_DISPLAY } from '@constants/config';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';

const DIRECTION_CREDIT = 'credit';
const DIRECTION_DEBIT = 'debit';
const POINT_AMOUNT_COLOR = '#2E8B4A';
const EMPTY_VALUE = '-';

const AMOUNT_COLORS: Record<string, string | undefined> = {
  [DIRECTION_DEBIT]: '#E14B4B',
  [DIRECTION_CREDIT]: '#2F7CF6',
};

const DETAIL_LABELS: Record<string, string | undefined> =
  TRANSACTION_DETAIL_DISPLAY;

type AmountProps = {
  readonly amount: number;
  readonly direction: string;
  readonly isPoint: boolean;
};

/** Signed amount, colored by direction (point entries get their own color). */
function TransactionAmount({ amount, direction, isPoint }: AmountProps) {
  const { t } = useTranslation();
  const normalizedDirection = direction?.toLowerCase();
  const sign = normalizedDirection === DIRECTION_CREDIT ? '+' : '-';
  let color;
  if (isPoint) {
    color =
      normalizedDirection === DIRECTION_DEBIT
        ? AMOUNT_COLORS[normalizedDirection]
        : POINT_AMOUNT_COLOR;
  } else {
    color = AMOUNT_COLORS[normalizedDirection] ?? Colors.black;
  }

  return (
    <Text style={[styles.amount, { color }]}>
      {isPoint
        ? `${sign}${formatCurrency(amount)}P`
        : `${sign}${t('common.display_price', { amount: formatCurrency(amount) })}`}
    </Text>
  );
}

type Properties = {
  readonly transaction: ITransactionMovement;
  readonly onPress: (data: any) => void;
};

function TransactionItem({ transaction, onPress }: Properties) {
  const { t } = useTranslation();
  const isPoint = transaction.entryType?.includes('POINT');
  const detailLabel = DETAIL_LABELS[transaction.entryType];

  return (
    <AppButton style={styles.row} onPress={() => onPress?.(transaction)}>
      <View style={styles.left}>
        <Text style={styles.rowTitle}>
          {transaction.storeName || EMPTY_VALUE}
        </Text>
        <Text style={styles.method}>
          {detailLabel ? t(detailLabel as TranslationKeys) : EMPTY_VALUE}
        </Text>
      </View>
      <View style={styles.right}>
        <TransactionAmount
          amount={transaction.amount}
          direction={transaction.direction}
          isPoint={isPoint}
        />
        <Text style={styles.date}>
          {dayjs(transaction.occurredAt).format('YYYY-MM-DD')}
        </Text>
      </View>
    </AppButton>
  );
}

export default React.memo(TransactionItem);

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
  rowTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
