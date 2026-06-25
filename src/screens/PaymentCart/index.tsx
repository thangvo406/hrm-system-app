import { Button, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency } from '@utils/product';
import { usePaymentCart } from '@hooks';
import PaymentMethod from './components/PaymentMethod';
import ProductInfo from './components/ProductInfo';
import Shipping from './components/Shipping';

const TEXT_DARK = '#1A1A1A';
const SCREEN_BG = '#F2F2F2';

function PaymentCart(props: any) {
  const {
    deliveryTab,
    paymentMethod,
    data,
    pickupTime,
    shippingTabs,
    setDeliveryTab,
    setPaymentMethod,
    onPressPickupTime,
    onPressOrder,
  } = usePaymentCart(props);

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title="Payment" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProductInfo items={data?.items} />

        <View style={styles.spacer} />

        <Shipping
          onPressPickupTime={onPressPickupTime}
          onTabChange={setDeliveryTab}
          pickupTime={pickupTime}
          tab={deliveryTab}
          tabs={shippingTabs}
        />

        <View style={styles.spacer} />

        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceColumn}>
          <Text style={styles.finalPrice}>
            {formatCurrency(data?.subtotal)}
          </Text>
          <Text style={styles.originalPrice}>
            {formatCurrency(data?.subtotal)}
          </Text>
        </View>
        <Button
          onPress={onPressOrder}
          style={styles.orderButton}
          testID="payment-order-now"
          title="Order Now"
          type="primary"
        />
      </View>
    </View>
  );
}

export default PaymentCart;

const styles = StyleSheet.create({
  bottomBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: Colors.gray2,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
  },
  finalPrice: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  orderButton: {
    borderRadius: ScaleSize(28),
    flex: 1,
  },
  originalPrice: {
    color: Colors.gray1,
    fontSize: ScaleSize(13),
    textDecorationLine: 'line-through',
  },
  priceColumn: {
    gap: ScaleSize(2),
  },
  safeArea: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  scrollContent: {
    gap: ScaleSize(8),
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  spacer: {
    height: 0,
  },
});
