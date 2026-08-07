import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Properties = {
  readonly expiringWindowDays: number;
  readonly nearestExpiryDate: string | undefined;
  readonly totalAmount: number;
};

function ExpiringSummaryCard({
  expiringWindowDays,
  nearestExpiryDate,
  totalAmount,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        {t('point_expiring.summary_label', { days: expiringWindowDays })}
      </Text>

      <View style={styles.amountRow}>
        <Text style={styles.amount}>{formatCurrency(totalAmount)}</Text>
        <Text style={styles.unit}>{t('point_expiring.point_unit')}</Text>
      </View>

      {!!nearestExpiryDate && (
        <Text style={styles.caption}>
          {t('point_expiring.nearest_date', { date: nearestExpiryDate })}
        </Text>
      )}
    </View>
  );
}

export default React.memo(ExpiringSummaryCard);

const styles = StyleSheet.create({
  amount: {
    color: Colors.red01,
    fontSize: ScaleSize(28),
    fontWeight: '800',
  },
  amountRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(6),
  },
  caption: {
    color: Colors.red05,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(8),
  },
  card: {
    backgroundColor: Colors.red02,
    borderRadius: ScaleSize(14),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  label: {
    color: Colors.red04,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  unit: {
    color: Colors.red01,
    fontSize: ScaleSize(20),
    fontWeight: '800',
    marginBottom: ScaleSize(2),
    marginLeft: ScaleSize(4),
  },
});
