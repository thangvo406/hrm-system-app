import { AppButton } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { IWallet } from '@type';

type Properties = {
  readonly onPressWithdrawal: () => void;
  readonly summary: IWallet;
};

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#707070';
const TEXT_DANGER = '#E05353';

function SummaryHeader({ onPressWithdrawal, summary }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t('pay_point.title')}</Text>
        <AppButton
          onPress={onPressWithdrawal}
          style={styles.withdrawalButton}
          testID="pay-point-withdrawal"
        >
          <Text style={styles.withdrawalText}>{t('pay_point.withdrawal')}</Text>
        </AppButton>
      </View>

      <Text style={styles.balance}>
        {t('pay_point.balance', { amount: formatCurrency(summary?.balance) })}
      </Text>

      <Text style={styles.pointRow}>
        <Text style={styles.pointLabel}>{t('pay_point.point_label')}</Text>
        <Text style={styles.pointSpacer}>{'  '}</Text>
        <Text style={styles.pointBalance}>
          {t('pay_point.point_balance', {
            amount: formatCurrency(summary?.pointBalance),
          })}
        </Text>
      </Text>

      <Text style={styles.expiring}>
        {t('pay_point.point_expiring', {
          amount: formatCurrency(summary.pointBalance),
        })}
      </Text>
    </View>
  );
}

export default React.memo(SummaryHeader);

const styles = StyleSheet.create({
  balance: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginTop: ScaleSize(14),
  },
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
  expiring: {
    color: TEXT_DANGER,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(6),
  },
  pointBalance: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  pointLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  pointRow: {
    marginTop: ScaleSize(8),
  },
  pointSpacer: {
    fontSize: ScaleSize(14),
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '800',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  withdrawalButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(18),
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(8),
  },
  withdrawalText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
