import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';

type OrderSummaryProperties = {
  readonly deliveryFee?: number;
  readonly subTotal: number | undefined;
};

function OrderSummary({ deliveryFee, subTotal }: OrderSummaryProperties) {
  const { t } = useTranslation();
  const hasFee = typeof deliveryFee === 'number';
  const subtotalAmount = t('common.display_price', {
    amount: formatCurrency(subTotal),
  });
  const feeAmount = deliveryFee
    ? t('common.display_price', {
        amount: formatCurrency(deliveryFee),
      })
    : t('order_history_detail.shipping_fee_free');
  const totalAmount = t('common.display_price', {
    amount: formatCurrency((subTotal ?? 0) + (hasFee ? deliveryFee : 0)),
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('payment_cart.summary_title')}</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>{t('payment_cart.summary_subtotal')}</Text>
        <Text style={styles.value}>{subtotalAmount}</Text>
      </View>
      {hasFee ? (
        <View style={[styles.row, styles.feeRow]}>
          <Text style={styles.label}>
            {t('payment_cart.summary_delivery_fee')}
          </Text>
          <Text style={styles.value}>{feeAmount}</Text>
        </View>
      ) : undefined}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>{t('payment_cart.summary_total')}</Text>
        <Text style={styles.totalValue}>{totalAmount}</Text>
      </View>
    </View>
  );
}

export default React.memo(OrderSummary);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: 3,
    padding: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  divider: {
    backgroundColor: Colors.gray3,
    height: 1,
    marginVertical: ScaleSize(12),
  },
  feeRow: {
    marginTop: ScaleSize(8),
  },
  label: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  totalLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  totalValue: {
    color: Colors.primary,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  value: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
