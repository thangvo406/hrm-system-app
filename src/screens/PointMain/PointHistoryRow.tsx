import type { IPointHistory, TPointHistoryType } from '@hooks/usePointMain';

import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Properties = {
  readonly item: IPointHistory;
};

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9AA0A6';

const AMOUNT_COLOR: Record<TPointHistoryType, string> = {
  accrue: '#2DB34A',
  expire: '#9AA0A6',
  use: '#E05353',
};

const formatSigned = (amount: number) => {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${sign}${formatCurrency(Math.abs(amount))}P`;
};

function PointHistoryRow({ item }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.leftColumn}>
        <Text style={styles.type}>{t(`point_main.type_${item.type}`)}</Text>
        <Text style={styles.description}>
          {t(`point_main.desc_${item.type}`)}
        </Text>
      </View>

      <View style={styles.rightColumn}>
        <Text style={[styles.amount, { color: AMOUNT_COLOR[item.type] }]}>
          {formatSigned(item.amount)}
        </Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
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
