import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const BORDER_COLOR = '#E0E0E0';

type Properties = {
  readonly bonusAmount: number;
  readonly refundableAmount: number;
  readonly walletBalance: number;
};

function BalanceCard({
  bonusAmount,
  refundableAmount,
  walletBalance,
}: Properties) {
  const { t } = useTranslation();
  const currency = t('refund_request.currency');

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.balanceLabel}>
          {t('refund_request.balance_label')}
        </Text>
        <Text style={styles.balanceValue} testID="refund-wallet-balance">
          {`${formatCurrency(walletBalance)}${currency}`}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.mutedLabel}>{t('refund_request.bonus_label')}</Text>
        <Text style={styles.mutedValue} testID="refund-bonus-amount">
          {`${formatCurrency(bonusAmount)}${currency}`}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.refundableLabel}>
          {t('refund_request.refundable_label')}
        </Text>
        <Text style={styles.refundableValue} testID="refund-refundable-amount">
          {`${formatCurrency(refundableAmount)}${currency}`}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(BalanceCard);

const styles = StyleSheet.create({
  balanceLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  balanceValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  card: {
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    gap: ScaleSize(14),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  divider: {
    backgroundColor: BORDER_COLOR,
    height: 1,
  },
  mutedLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
  },
  mutedValue: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  refundableLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  refundableValue: {
    color: Colors.primary,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
