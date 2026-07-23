import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

const CARD_GRADIENT = ['#4EBE5B', '#39AD48'];

type Properties = {
  readonly balance: number;
  readonly onUse: () => void;
};

function PointBalanceCard({ balance, onUse }: Properties) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
      }}
    >
      <LinearGradient
        colors={CARD_GRADIENT}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <Text style={styles.label}>{t('point_main.balance_label')}</Text>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <Text style={styles.unit}>{t('point_main.point_unit')}</Text>
        </View>

        <AppButton
          onPress={onUse}
          style={styles.useButton}
          testID="point-main-use"
        >
          <Text style={styles.useButtonText}>{t('point_main.use_action')}</Text>
        </AppButton>
      </LinearGradient>
    </View>
  );
}

export default React.memo(PointBalanceCard);

const styles = StyleSheet.create({
  balanceRow: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(6),
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: ScaleSize(40),
    fontWeight: '800',
  },
  card: {
    borderRadius: ScaleSize(22),

    overflow: 'hidden',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: ScaleSize(13),
    paddingTop: ScaleSize(20),
    paddingLeft: ScaleSize(20),
    fontWeight: '600',
  },
  unit: {
    color: '#FFFFFF',
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginBottom: ScaleSize(6),
    marginLeft: ScaleSize(6),
  },
  useButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: ScaleSize(10),
    height: ScaleSize(46),
    justifyContent: 'center',
    marginTop: ScaleSize(16),
    width: '80%',
    alignSelf: 'center',
    marginBottom: ScaleSize(20),
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
});
