import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Properties = {
  readonly onPay: () => void;
  readonly disabled: boolean;
};

function PayButton({ onPay, disabled }: Properties) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { bottom: insets.bottom || 20 }]}>
      <Button
        onPress={onPay}
        disabled={disabled}
        testID="payment-offline-pay-action"
        title={t('payment_offline.pay_action')}
        type="primary"
      />
    </View>
  );
}

export default React.memo(PayButton);

const styles = StyleSheet.create({
  wrap: {
    marginTop: ScaleSize(32),
    position: 'absolute',
    left: 20,
    right: 20,
  },
});
