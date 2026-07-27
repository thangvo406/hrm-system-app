import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Colors } from '@constants';

type Properties = {
  readonly balance: number;
};

function PayMoneyCard({ balance }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.balanceLabel}>{t('payment.order_amount')}</Text>
          <Text style={styles.balanceValue}>
            {t('common.display_price', { amount: formatCurrency(balance) })}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(PayMoneyCard);

const styles = StyleSheet.create({
  balanceLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(13),
  },
  balanceValue: {
    color: '#1A1A1A',
    fontSize: ScaleSize(18),
    fontWeight: '800',
  },
  card: {
    backgroundColor: Colors.gray10,
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(8),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray10,
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
    borderWidth: 2,
    alignSelf: 'flex-end',
  },
});
