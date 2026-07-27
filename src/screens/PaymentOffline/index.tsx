import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePaymentOffline } from '@hooks';
import { useTranslation } from 'react-i18next';

import PayButton from './PayButton';
import PaymentMethodCarousel from './PaymentMethodCarousel';
import { PointUsageCard } from '@components';
import HeaderDetail from '@components/HeaderDetail';

function PaymentOffline() {
  const { t } = useTranslation();
  const {
    onAddMethod,
    onChangePointUsed,
    onPay,
    onSelectMethod,
    onToggleUsePoints,
    paymentMethods,
    pointHolding,
    pointUsed,
    selectedMethodId,
    usePoints,
  } = usePaymentOffline();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('payment_offline.title')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PointUsageCard
          onChangePointUsed={onChangePointUsed}
          onToggleUsePoints={onToggleUsePoints}
          pointHolding={pointHolding}
          pointUsed={pointUsed}
          usePoints={usePoints}
        />

        <Text style={styles.sectionLabel}>
          {t('payment_offline.method_label')}
        </Text>
        <Text style={styles.coopPayLabel}>
          {t('payment_offline.coop_pay_label')}
        </Text>

        <View style={styles.fullBleed}>
          <PaymentMethodCarousel
            methods={paymentMethods}
            onAddMethod={onAddMethod}
            onSelect={onSelectMethod}
            selectedId={selectedMethodId}
          />
        </View>

        <PayButton onPay={onPay} />
      </ScrollView>
    </View>
  );
}

export default PaymentOffline;

const styles = StyleSheet.create({
  coopPayLabel: {
    color: '#2DB34A',
    fontSize: ScaleSize(13),
    fontWeight: '600',
    marginTop: ScaleSize(10),
    marginBottom: ScaleSize(10),
  },
  fullBleed: {
    marginHorizontal: -ScaleSize(20),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingVertical: ScaleSize(32),
    paddingHorizontal: ScaleSize(20),
  },
  sectionLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(24),
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(24),
    fontWeight: '800',
    marginBottom: ScaleSize(20),
    marginTop: ScaleSize(12),
  },
});
