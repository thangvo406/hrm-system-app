import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { usePayment } from '@hooks';
import { useTranslation } from 'react-i18next';
import Cards from './Cards';
import GeneralPaymentSection from './GeneralPaymentSection';
import MembershipCards from './MembershipCards';
import PayButton from './PayButton';
import PayMoneyCard from './PayMoneyCard';
import PointCouponCard from './PointCouponCard';
import SimplePaymentSection from './SimplePaymentSection';

function Payment() {
  const { t } = useTranslation();
  const {
    accounts,
    cards,
    initialIndex,
    isShowUnRegister,
    onPay,
    onRegisterAccount,
    onRegisterCard,
    onSelectGeneralMethod,
    payMoneyBalance,
    pointHolding,
    pointUsed,
    selectedCoupon,
    onSelectCoupon,
    onUsePoint,
  } = usePayment();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('payment.title')} usePaddingTop />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PayMoneyCard balance={payMoneyBalance} />

        <PointCouponCard
          coupon={selectedCoupon}
          onSelectCoupon={onSelectCoupon}
          onUsePoint={onUsePoint}
          pointHolding={pointHolding}
          pointUsed={pointUsed}
        />

        <View style={styles.fullBleed}>
          <MembershipCards
            cards={cards}
            initialIndex={initialIndex}
            isShowUnRegister={isShowUnRegister}
          />

          <Cards
            accounts={accounts}
            isShowUnRegister={isShowUnRegister}
            onRegisterAccount={onRegisterAccount}
            onRegisterCard={onRegisterCard}
          />
        </View>

        <GeneralPaymentSection onSelectMethod={onSelectGeneralMethod} />

        <SimplePaymentSection />

        <PayButton onPay={onPay} />
      </ScrollView>
    </View>
  );
}

export default Payment;

const styles = StyleSheet.create({
  fullBleed: {
    marginHorizontal: -ScaleSize(20),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(20),
  },
});
