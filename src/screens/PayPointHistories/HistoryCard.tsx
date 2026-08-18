import type { IPointPayHistory } from '@type';
import type { TranslationKeys } from '@translations/i18next';

import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';

import PointItem from './PointItem';
import AppButton from '@components/AppButton';
import { SIGN_PREFIX_TRANSACTION } from '@constants/config';

export type PayPointHistoryType = 'pay' | 'point';

type Properties = {
  readonly item: IPointPayHistory;
  readonly type: PayPointHistoryType;
  readonly onPressItem: (item: any) => void;
};

type PayItemProperties = {
  readonly item: IPointPayHistory;
  readonly onPressItem: (item: any) => void;
};

const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';
const EMPTY_VALUE = '-';
const POINT_TYPE: PayPointHistoryType = 'point';

// Tag label + colour per ledger direction: money spent vs money topped up.
const TAG_STYLE: Record<
  string,
  { readonly color: string; readonly title: TranslationKeys }
> = {
  DEBIT: { color: Colors.red03, title: 'pay_point.tags.money_use' },
  CREDIT: { color: Colors.green02, title: 'pay_point.tags.money_charge' },
};

const COLORS_AMOUNT: Record<string, string> = {
  CREDIT: Colors.red03,
  DEBIT: Colors.green02,
};

function PayItem({ item, onPressItem }: PayItemProperties) {
  const { t } = useTranslation();
  const tag = TAG_STYLE[item?.transactionDirection];
  const amountColor = COLORS_AMOUNT[item?.transactionDirection];
  const sign = SIGN_PREFIX_TRANSACTION[item?.transactionDirection] || '';

  return (
    <AppButton style={styles.card} onPress={() => onPressItem?.(item)}>
      <View style={styles.leftColumn}>
        {tag ? (
          <View style={[styles.tag, { backgroundColor: tag.color }]}>
            <Text style={styles.tagText}>{t(tag.title)}</Text>
          </View>
        ) : undefined}
        <Text style={[styles.amount, { color: amountColor }]}>
          {`${sign}${t('common.display_price', {
            amount: formatCurrency(item.amount),
          })}`}
        </Text>
        <Text style={styles.description}>{item?.storeName || EMPTY_VALUE}</Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.date}>
          {dayjs(item.createdDate).format(DATE_FORMAT)}
        </Text>
        <Text style={styles.balance}>
          {t('pay_point.balance_after', {
            amount: formatCurrency(item.balanceAfter),
          })}
        </Text>
      </View>
    </AppButton>
  );
}

function HistoryCard({ item, type, onPressItem }: Properties) {
  if (type === POINT_TYPE) {
    return <PointItem item={item} onPressItem={onPressItem} />;
  }
  return <PayItem item={item} onPressItem={onPressItem} />;
}

export default React.memo(HistoryCard);

const styles = StyleSheet.create({
  amount: {
    fontSize: ScaleSize(18),
    fontWeight: '800',
    marginTop: ScaleSize(8),
  },
  balance: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
    textAlign: 'right',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(14),
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: ScaleSize(16),
    marginVertical: ScaleSize(6),
    padding: ScaleSize(16),
    shadowColor: Colors.black,
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  date: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
    textAlign: 'right',
  },
  description: {
    color: Colors.gray23,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
  },
  leftColumn: {
    alignItems: 'flex-start',
    flex: 1,
  },
  rightColumn: {
    alignItems: 'flex-end',
    marginLeft: ScaleSize(12),
  },
  tag: {
    borderRadius: ScaleSize(3),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
  },
  tagText: {
    color: Colors.white,
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
});
