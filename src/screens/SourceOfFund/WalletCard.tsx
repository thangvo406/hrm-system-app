import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { formatCurrency } from '@utils/product';

// const CARD_GRADIENT = ['#2E8B4A', '#1F6E38'];
const CARD_GRADIENT = ['#1F6E38', '#166932'];

type Properties = {
  readonly balance: number;
  readonly onCharge: () => void;
  readonly onChargeHistory: () => void;
  readonly onUse: () => void;
  readonly toggleUnRegister: () => void;
  readonly point: number;
  readonly isShowUnRegister: boolean;
};

function WalletCard({
  balance,
  onCharge,
  onChargeHistory,
  onUse,
  point,
  toggleUnRegister,
  isShowUnRegister,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <LinearGradient
        colors={CARD_GRADIENT}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <Text style={styles.walletName}>
            {t('source_of_fund.wallet_name')}
          </Text>
          <AppButton style={styles.pointPill} onPress={toggleUnRegister}>
            <Text style={styles.pointText}>
              {t('source_of_fund.point_held', { point: formatCurrency(point) })}
            </Text>
          </AppButton>
        </View>

        <Text style={styles.balanceLabel}>{t('source_of_fund.balance')}</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <Text style={styles.currency}>{t('source_of_fund.currency')}</Text>
        </View>

        {!isShowUnRegister && (
          <AppButton
            onPress={onUse}
            style={styles.useButton}
            testID="source-of-fund-use"
          >
            <Text style={styles.useButtonText}>{t('source_of_fund.use')}</Text>
          </AppButton>
        )}

        <View style={styles.actionRow}>
          <AppButton
            onPress={onCharge}
            style={styles.actionButton}
            testID="source-of-fund-charge"
          >
            <Text style={styles.actionButtonText}>
              {t('source_of_fund.charge')}
            </Text>
          </AppButton>
          {!isShowUnRegister && (
            <AppButton
              onPress={onChargeHistory}
              style={styles.actionButton}
              testID="source-of-fund-charge-history"
            >
              <Text style={styles.actionButtonText}>
                {t('source_of_fund.charge_history')}
              </Text>
            </AppButton>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

export default React.memo(WalletCard);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: ScaleSize(10),
    flex: 1,
    height: ScaleSize(46),
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(10),
    marginHorizontal: ScaleSize(20),
    paddingBottom: ScaleSize(20),
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(18),
    paddingHorizontal: ScaleSize(20),
  },
  balanceRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(6),
    justifyContent: 'center',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: ScaleSize(40),
    fontWeight: '800',
  },
  card: {
    borderRadius: ScaleSize(18),
    overflow: 'hidden',
    // padding: ScaleSize(20),
  },
  currency: {
    color: '#FFFFFF',
    fontSize: ScaleSize(18),
    fontWeight: '600',
    marginBottom: ScaleSize(4),
    marginLeft: ScaleSize(6),
  },
  pointPill: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    borderRadius: ScaleSize(14),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(5),
  },
  pointText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  useButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: ScaleSize(10),
    height: ScaleSize(46),
    justifyContent: 'center',
    marginTop: ScaleSize(22),
    marginHorizontal: ScaleSize(20),
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  walletName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
