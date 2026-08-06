import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';
import type { IPointPayHistory } from '@type';
import { COLORS_POINT_AMOUNT, EMPTY_VALUE, POINT_TAG_STYLE, TRANSACTION_DETAIL_DISPLAY } from '@constants/config';
import type { TranslationKeys } from '@translations/i18next';
import { getDaysUntil } from '@utils/date';
import { Colors } from '@constants';
import isNumber from 'lodash/isNumber';
import AppButton from '@components/AppButton';
import { formatTransactionPoint } from '@utils/common';

type Properties = {
  readonly item: IPointPayHistory;
  readonly onPressItem: (item: any) => void;
};

const TEXT_MUTED = '#9AA0A6';
const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';


const DETAIL_LABELS: Record<string, string | undefined> =
  TRANSACTION_DETAIL_DISPLAY;

function HistoryCard({ item, onPressItem }: Properties) {
  const { t } = useTranslation();

  const tag = POINT_TAG_STYLE[item?.entryType];

  const detailLabel = DETAIL_LABELS[item.entryType];
  const amountColor = COLORS_POINT_AMOUNT[item.entryType];
  const isEarn = item.entryType == 'POINT_EARN';
  const dayReaming =
    isEarn && item.pointExpiresAt
      ? getDaysUntil(item.pointExpiresAt)
      : undefined;
  return (
    <AppButton style={styles.card} onPress={() => onPressItem?.(item)}>
      <View style={styles.leftColumn}>
        {tag ? (
          <View style={[styles.tag, { backgroundColor: tag.color }]}>
            <Text style={styles.tagText}>{t(tag.title)}</Text>
          </View>
        ) : undefined}
        <Text style={[styles.amount, { color: amountColor }]}>
          {formatTransactionPoint(item)}
        </Text>
        <Text style={styles.description}>
          {detailLabel ? t(detailLabel as TranslationKeys) : EMPTY_VALUE}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.date}>
          {dayjs(item.createdDate).format(DATE_FORMAT)}
        </Text>
        <Text style={styles.balance}>
          {t('pay_point.balance_after', {
            amount: isNumber(item.pointAfter)
              ? formatCurrency(item.pointAfter)
              : '-',
          })}
        </Text>
        {!!item.pointExpiresAt && (
          <Text style={styles.expiry}>
            {t('pay_point.expiry', {
              value: dayjs(item.pointExpiresAt).format('YYYY-MM-DD'),
            })}
          </Text>
        )}

        {!!dayReaming && (
          <Text style={styles.dayReaming}>
            {t('pay_point.point_day_reaming', {
              value: dayReaming,
            })}
          </Text>
        )}
      </View>
    </AppButton>
  );
}

export default React.memo(HistoryCard);

const styles = StyleSheet.create({
  amount: {
    fontSize: ScaleSize(18),
    fontWeight: '800',
    marginTop: ScaleSize(8),
  },
  balance: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(14),
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: ScaleSize(16),
    marginVertical: ScaleSize(6),
    padding: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  date: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    textAlign: 'right',
  },
  description: {
    color: '#4A4A4A',
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
  },
  dayReaming: {
    color: Colors.yellow02,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
    textAlign: 'right',
  },
  expiry: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
    textAlign: 'right',
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
    color: '#FFFFFF',
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
});
