import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

type Properties = {
  readonly onPay: () => void;
};

function PayButton({ onPay }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <Button
        onPress={onPay}
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
  },
});
