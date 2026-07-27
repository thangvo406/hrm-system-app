import { HeaderDetail, PointUsageCard } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { usePayment } from '@hooks';
import { useTranslation } from 'react-i18next';
import GeneralPaymentSection from './GeneralPaymentSection';
import BankAccounts from './BankAccounts';
import PayButton from './PayButton';
import PayMoneyCard from './PayMoneyCard';
import PointCouponCard from './PointCouponCard';
import SimplePaymentSection from './SimplePaymentSection';

function Payment(props: any) {
  const { t } = useTranslation();
  const {
    initialIndex,
    onPay,
    onSelectCard,
    onSelectGeneralMethod,
    onSelectedEasyPay,
    pointHolding,
    pointUsed,
    usePoints,
    bankAccounts,
    selectedCardId,
    selectedEasyPayId,
    selectedCoupon,
    payloadRequest,
    disableBtnSubmit,
    onSelectCoupon,
    onChangePointUsed,
    onToggleUsePoints,
  } = usePayment(props);

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('payment.title')} usePaddingTop />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PayMoneyCard balance={payloadRequest?.totalAmount} />

        <PointCouponCard
          coupon={selectedCoupon}
          onSelectCoupon={onSelectCoupon}
        />

        <View style={styles.pointSection}>
          <PointUsageCard
            onChangePointUsed={onChangePointUsed}
            onToggleUsePoints={onToggleUsePoints}
            pointHolding={pointHolding}
            pointUsed={pointUsed}
            usePoints={usePoints}
          />
        </View>

        <View style={styles.fullBleed}>
          <BankAccounts
            cards={bankAccounts}
            initialIndex={initialIndex}
            onSelect={onSelectCard}
            selectedId={selectedCardId}
          />
        </View>

        <GeneralPaymentSection onSelectMethod={onSelectGeneralMethod} />

        <SimplePaymentSection
          onSelect={onSelectedEasyPay}
          selectedId={selectedEasyPayId}
        />
      </ScrollView>
      <PayButton
        onPay={onPay}
        totalAmount={payloadRequest?.totalAmount}
        disableBtn={disableBtnSubmit}
      />
    </View>
  );
}

export default Payment;

const styles = StyleSheet.create({
  fullBleed: {
    marginHorizontal: -ScaleSize(20),
    marginTop: ScaleSize(20),
  },
  wrap: {
    marginTop: ScaleSize(32),
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 30,
  },
  pointSection: {
    marginTop: ScaleSize(12),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(200),
    paddingHorizontal: ScaleSize(20),
  },
});
