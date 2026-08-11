import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  COLORS_POINT_AMOUNT,
  EMPTY_VALUE,
  POINT_TAG_STYLE,
  TRANSACTION_DETAIL_DISPLAY,
} from '@constants/config';
import { TranslationKeys } from '@translations/i18next';
import { formatTransactionPoint } from '@utils/common';
import { IPointPayHistory } from '@type';
import dayjs from 'dayjs';
import AppButton from '@components/AppButton';

type Properties = {
  readonly item: IPointPayHistory;
  readonly onPressItem: (item: any) => () => void;
};

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9AA0A6';
const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';

const DETAIL_LABELS: Record<string, string | undefined> =
  TRANSACTION_DETAIL_DISPLAY;

function PointHistoryRow({ item, onPressItem }: Properties) {
  const { t } = useTranslation();
  const tag = POINT_TAG_STYLE[item?.entryType];
  const detailLabel = DETAIL_LABELS[item.entryType];
  const amountColor = COLORS_POINT_AMOUNT[item.entryType];
  return (
    <AppButton style={styles.row} onPress={onPressItem?.(item)}>
      <View style={styles.leftColumn}>
        <Text style={styles.type}>{t(tag?.title as TranslationKeys)}</Text>
        <Text style={styles.description}>
          {detailLabel ? t(detailLabel as TranslationKeys) : EMPTY_VALUE}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {formatTransactionPoint(item)}
        </Text>
        <Text style={styles.date}>
          {dayjs(item.createdDate).format(DATE_FORMAT)}
        </Text>
      </View>
    </AppButton>
  );
}

export default React.memo(PointHistoryRow);

const styles = StyleSheet.create({
  amount: {
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  date: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  description: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    alignItems: 'flex-end',
    marginLeft: ScaleSize(12),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(16),
  },
  type: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
