import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePaymentCompleted } from '@hooks';
import { useTranslation } from 'react-i18next';
import AppNavigator from '@navigation/AppNavigator';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';

import InfoCard from './InfoCard';
import SuccessHero from './SuccessHero';

const onPressBack = () => {
  AppNavigator.goBack();
};

function PaymentCompleted(props: RootScreenProps<Paths.PaymentCompleted>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { amount, onConfirm, paymentAt, paymentMethod, storeName } =
    usePaymentCompleted(props);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <RegisterHeader onBack={onPressBack} showBtnBack />
      </View>

      <View style={styles.content}>
        <SuccessHero amount={amount} />

        <View style={styles.cardWrap}>
          <InfoCard
            paymentAt={paymentAt}
            paymentMethod={paymentMethod}
            storeName={storeName}
          />
        </View>

        <Button
          onPress={onConfirm}
          style={styles.confirm}
          testID="payment-completed-confirm"
          title={t('payment_completed.confirm')}
          type="primary"
        />
      </View>

      <View style={{ height: insets.bottom }} />
    </View>
  );
}

export default PaymentCompleted;

const styles = StyleSheet.create({
  cardWrap: {
    marginTop: ScaleSize(28),
  },
  confirm: {
    borderRadius: ScaleSize(28),
    marginTop: ScaleSize(24),
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(72),
  },
  headerWrap: {
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});
