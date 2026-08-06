import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';
import type {
  TPayPointAmountTone,
  TPayPointTagType,
} from '@hooks/usePayPointHistories';
import { IPointPayHistory } from '@type';
import { TRANSACTION_DETAIL_DISPLAY } from '@constants/config';
import { TranslationKeys } from '@translations/i18next';
import PointItem from './PointItem';

type Properties = {
  readonly item: IPointPayHistory;
};

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9AA0A6';
const EXPIRY_HIGHLIGHT = '#E0872B';
const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';
const EMPTY_VALUE = '-';
const TAG_STYLE: Record<
  TPayPointTagType,
  { readonly background: string; readonly color: string; readonly key: string }
> = {
  accrue: { background: '#DFF3E1', color: '#2DB34A', key: 'tag_accrue' },
  event: { background: '#FBEAD7', color: '#D98A2B', key: 'tag_event' },
  expire: { background: '#FBE0E0', color: '#D9534F', key: 'tag_expire' },
  use: { background: '#ECECEC', color: '#6B6B6B', key: 'tag_use' },
  welfare: { background: '#DEEBFB', color: '#3B82C4', key: 'tag_welfare' },
};

const POINT_TAG_STYLE = {
  POINT_EXPIRE: {
    background: '#FBE0E0',
    color: '#D9534F',
    title: 'pay_point.tags.point_expired',
  },
  POINT_USE: {
    background: '#ECECEC',
    color: '#6B6B6B',
    title: 'pay_point.tags.point_use',
  },
  POINT_EARN: {
    background: '#DFF3E1',
    color: '#2DB34A',
    title: 'pay_point.tags.point_accrue',
  },
};

const COLORS_AMOUNT = {
  POINT_EXPIRE: '#D9534F',
  POINT_USE: '#6B6B6B',
  POINT_EARN: '#2DB34A',
};

const PointTagItem = ({ entryType }: any) => {
  const { t } = useTranslation();
  const tag = POINT_TAG_STYLE[entryType];
  return (
    <View style={[styles.tag, { backgroundColor: tag?.color }]}>
      <Text style={styles.tagText}>{t(tag?.title)}</Text>
    </View>
  );
};

const formatSigned = (item: IPointPayHistory, type) => {
  const suffix = type != 'point' ? '원' : ' P';
  const sign = item.amount > 0 ? '+' : '';
  return `${sign}${formatCurrency(item.amount)}${suffix}`;
};

const DETAIL_LABELS: Record<string, string | undefined> =
  TRANSACTION_DETAIL_DISPLAY;

function HistoryCard({ item, type }: Properties) {
  const { t } = useTranslation();

  if (type == 'point') {
    return <PointItem item={item} />;
  }

  // const tag = TAG_STYLE[item.tag];
  const TagComponent = type == 'point' ? PointTagItem : PointTagItem;

  const detailLabel = DETAIL_LABELS[item.entryType];
  const amountColor = COLORS_AMOUNT[item.entryType];
  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <TagComponent entryType={item?.entryType} />
        <Text style={[styles.amount, { color: amountColor }]}>
          {formatSigned(item, type)}
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
            amount: formatCurrency(item.balanceAfter),
          })}
        </Text>
        {item.expiry ? (
          <Text
            style={[styles.expiry, item.expiryHighlight && styles.expiryStrong]}
          >
            {t('pay_point.expiry', { value: item.expiry })}
          </Text>
        ) : undefined}
      </View>
    </View>
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
  expiry: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
    textAlign: 'right',
  },
  expiryStrong: {
    color: EXPIRY_HIGHLIGHT,
    fontWeight: '700',
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
