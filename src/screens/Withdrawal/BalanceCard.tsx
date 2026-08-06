import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import { IWallet } from '@type';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const BORDER_COLOR = '#E0E0E0';

type Properties = {
  readonly walletBalance?: IWallet;
};

function BalanceCard({ walletBalance }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.balanceLabel}>{t('withdrawal.balance_label')}</Text>
        <Text style={styles.balanceValue} testID="withdrawal-wallet-balance">
          {t('common.display_price', {
            amount: formatCurrency(walletBalance?.balance),
          })}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.mutedLabel}>{t('withdrawal.bonus_label')}</Text>
        <Text style={styles.mutedValue} testID="withdrawal-bonus-amount">
          {t('common.display_price', {
            amount: formatCurrency(walletBalance?.bonusBalance),
          })}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.withdrawableLabel}>
          {t('withdrawal.withdrawable_label')}
        </Text>
        <Text
          style={styles.withdrawableValue}
          testID="withdrawal-withdrawable-amount"
        >
          {t('common.display_price', {
            amount: formatCurrency(walletBalance?.withdrawableBalance),
          })}
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  withdrawableLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  withdrawableValue: {
    color: Colors.primary,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
});
