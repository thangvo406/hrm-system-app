import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Colors } from '@constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceUtils } from '@kits/core/utils';
import { formatCurrency } from '@utils/product';
import LinearGradient from 'react-native-linear-gradient';

import DiscountSummary from './DiscountSummary';
import { IPriceDetail } from '@type';

const { ifAndroid } = DeviceUtils;

const SHADOW_GRADIENT = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)'];
type Properties = {
  readonly priceDetail?: IPriceDetail;
  readonly onPay: () => void;
  readonly disableBtn: boolean;
};

function PayButton({ disableBtn, onPay, priceDetail }: Properties) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: ifAndroid(16, insets.bottom || 20),
        },
      ]}
    >
      <LinearGradient
        colors={SHADOW_GRADIENT}
        pointerEvents="none"
        style={styles.topShadow}
      />
      <DiscountSummary data={priceDetail} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: ScaleSize(20),
        }}
      >
        <Text style={styles.labelAmount}>{t('payment.final_amount')}</Text>
        <Text style={styles.amount}>
          {t('common.display_price', {
            amount: formatCurrency(priceDetail?.finalMoney),
          })}
        </Text>
      </View>
      <Button
        onPress={onPay}
        disabled={disableBtn}
        testID="payment-pay-action"
        title={t('payment.pay_action')}
        type="primary"
      />
    </View>
  );
}

export default React.memo(PayButton);

const styles = StyleSheet.create({
  wrap: {
    marginTop: ScaleSize(32),
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: ScaleSize(20),
  },
  topShadow: {
    height: ScaleSize(12),
    left: 0,
    position: 'absolute',
    right: 0,
    top: -ScaleSize(12),
  },
  labelAmount: {
    fontWeight: 'bold',
    fontSize: ScaleSize(15),
    color: Colors.black,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: ScaleSize(18),
    color: Colors.black,
  },
});
