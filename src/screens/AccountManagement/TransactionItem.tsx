import type { TranslationKeys } from '@translations/i18next';
import type { ITransactionMovement } from '@type';

import {
  HEADLINE_ACTIONS,
  SUMMARY_TRANSACTION_DETAIL_DISPLAY,
} from '@constants/config';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';

const EMPTY_VALUE = '-';

const AMOUNT_COLORS: Record<string, string | undefined> = {
  DEBIT: '#E14B4B',
  CREDIT: '#2F7CF6',
};

const TRANSACTION_AMOUNT_DISPLAY = {
  [HEADLINE_ACTIONS.CHARGE]: {
    amount: 'moneyInAmount',
    sign: '+',
  },
  [HEADLINE_ACTIONS.CHARGE_BONUS_POINT]: {
    amount: 'moneyInAmount',
    sign: '-',
  },
  [HEADLINE_ACTIONS.PAYMENT]: {
    amount: 'moneyOutAmount',
    sign: '-',
  },
  [HEADLINE_ACTIONS.WITHDRAWAL]: {
    amount: 'moneyOutAmount',
    sign: '-',
  },
  [HEADLINE_ACTIONS.POINT_EARN]: {
    amount: 'pointEarnedAmount',
    sign: '+',
  },
  [HEADLINE_ACTIONS.POINT_GRANT]: {
    amount: 'pointEarnedAmount',
    sign: '+',
  },
  [HEADLINE_ACTIONS.POINT_USE]: {
    amount: 'moneyOutAmount',
    sign: '-',
  },
  [HEADLINE_ACTIONS.POINT_EXPIRE]: {
    amount: 'pointUsedAmount',
    sign: '-',
  },
  [HEADLINE_ACTIONS.REFUND]: {
    amount: 'moneyInAmount',
    sign: '+',
  },
  [HEADLINE_ACTIONS.ADJUSTMENT]: {
    amount: 'moneyOutAmount',
    sign: '-',
  },
};

const DETAIL_LABELS: Record<string, string | undefined> =
  SUMMARY_TRANSACTION_DETAIL_DISPLAY;

type AmountProps = {
  readonly amount: string;
  readonly amountColor: string | undefined;
};

/** Signed amount, colored by direction (point entries get their own color). */
function TransactionAmount({ amount, amountColor }: AmountProps) {
  return <Text style={[styles.amount, { color: amountColor }]}>{amount}</Text>;
}

type Properties = {
  readonly transaction: ITransactionMovement;
  readonly onPress: (data: any) => void;
};

function TransactionItem({ transaction, onPress }: Properties) {
  const { t } = useTranslation();
  const detailLabel = DETAIL_LABELS[transaction.headlineAction];
  const { amountDisplay, amountColor } = useMemo(() => {
    const config =
      TRANSACTION_AMOUNT_DISPLAY[transaction.headlineAction] ||
      TRANSACTION_AMOUNT_DISPLAY[HEADLINE_ACTIONS.CHARGE];
    return {
      amountDisplay: t('common.display_price', {
        amount: `${config.sign}${formatCurrency(transaction[config.amount])}`,
      }),
      amountColor:
        config.sign == '-' ? AMOUNT_COLORS.DEBIT : AMOUNT_COLORS.CREDIT,
    };
  }, [transaction]);
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
        <TransactionAmount amount={amountDisplay} amountColor={amountColor} />
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
