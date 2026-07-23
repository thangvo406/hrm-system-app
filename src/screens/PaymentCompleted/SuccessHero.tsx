import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

const BADGE_SIZE = ScaleSize(56);
const CHECK_SIZE = ScaleSize(30);
const ACCENT_COLOR = '#3DBE5F';

type Properties = {
  readonly amount: number;
};

function SuccessHero({ amount }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Image
          color="#FFFFFF"
          height={CHECK_SIZE}
          name="ic_check"
          type="svg"
          width={CHECK_SIZE}
        />
      </View>

      <Text style={styles.title}>{t('payment_completed.title')}</Text>

      <Text style={styles.amount}>
        {`${formatCurrency(amount)}${t('payment.won_unit')}`}
      </Text>
    </View>
  );
}

export default React.memo(SuccessHero);

const styles = StyleSheet.create({
  amount: {
    color: '#1A1A1A',
    fontSize: ScaleSize(30),
    fontWeight: '800',
    marginTop: ScaleSize(10),
  },
  badge: {
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: BADGE_SIZE / 2,
    height: BADGE_SIZE,
    justifyContent: 'center',
    width: BADGE_SIZE,
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(20),
    fontWeight: '800',
    marginTop: ScaleSize(20),
  },
  wrap: {
    alignItems: 'center',
  },
});
