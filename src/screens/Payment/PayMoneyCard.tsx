import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Properties = {
  readonly balance: number;
};

function PayMoneyCard({ balance }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{t('payment.pay_money_label')}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.balanceLabel}>{t('payment.balance_label')}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
            <Text style={styles.unit}>{t('payment.won_unit')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(PayMoneyCard);

const styles = StyleSheet.create({
  balanceLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(15),
  },
  balanceValue: {
    color: '#1A1A1A',
    fontSize: ScaleSize(22),
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: ScaleSize(24),
  },
  sectionLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
  unit: {
    color: '#8A8F94',
    fontSize: ScaleSize(15),
    marginLeft: ScaleSize(6),
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
});
