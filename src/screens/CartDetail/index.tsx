import { AppButton, Button, EmptyView, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCartDetail } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { IProductCart } from '@type';
import CartProductCard from './CartProductCard';
import OrderSummary from './OrderSummary';
import StoreHeader from './StoreHeader';
import imageNames from '@assets/images/names';

const SCREEN_BG = '#F2F2F2';
const TEXT_DARK = '#1A1A1A';
const DELIVERY_FEE = 0;

const METHOD_LABEL_KEYS: Readonly<Record<string, string>> = {
  DELIVERY: 'order_method.method_delivery',
  DINE_IN: 'order_method.method_dinein',
  PICKUP: 'order_method.method_pickup',
};

function CartDetail(props: any) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    deliveryTab,
    data,
    products,
    loading,
    error,
    isShowConfirmPayment,
    addressDelivery,
    onBack,
    onPressOrder,
    onPressPayment,
    onPressSelectAddress,
    onChangeQuantity,
  } = useCartDetail(props);

  const methodLabel = t(
    METHOD_LABEL_KEYS[deliveryTab ?? 'DELIVERY'] ??
      'order_method.method_delivery',
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail
        title={t(
          isShowConfirmPayment
            ? 'payment_cart.confirm_title'
            : 'payment_cart.title',
        )}
        onPressBack={onBack}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <EmptyView desc={error} icon={imageNames.ic_shopping_error} />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <StoreHeader method={deliveryTab} storeName={data?.storeName} />

            {isShowConfirmPayment ? (
              <View style={styles.deliveryCard}>
                <Text style={styles.deliveryEta}>
                  {t('payment_cart.confirm_delivery_eta', {
                    method: methodLabel,
                  })}
                </Text>
                <View style={styles.deliveryAddressRow}>
                  <View style={styles.deliveryAddressInfo}>
                    <Text style={styles.deliveryAddressLabel}>
                      {t('order_method.address_section_title')}
                    </Text>
                    <Text style={styles.deliveryAddressValue}>
                      {addressDelivery}
                    </Text>
                  </View>
                  <AppButton
                    onPress={onPressSelectAddress}
                    testID="confirm-change-address"
                  >
                    <Text style={styles.changeText}>
                      {t('order_method.change')}
                    </Text>
                  </AppButton>
                </View>
              </View>
            ) : undefined}

            {products?.map((item: IProductCart) => (
              <CartProductCard
                item={item}
                key={item.id}
                onChangeQuantity={onChangeQuantity}
                readOnly={isShowConfirmPayment}
              />
            ))}

            <OrderSummary
              deliveryFee={isShowConfirmPayment ? DELIVERY_FEE : undefined}
              subTotal={data?.subTotal}
            />
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              { paddingBottom: insets.bottom + ScaleSize(12) },
            ]}
          >
            <Button
              onPress={isShowConfirmPayment ? onPressPayment : onPressOrder}
              style={styles.orderButton}
              testID="cart-order-now"
              title={t(
                isShowConfirmPayment
                  ? 'payment_cart.pay_button'
                  : 'payment_cart.order_button',
              )}
              type="primary"
            />
          </View>
        </>
      )}
    </View>
  );
}

export default CartDetail;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: SCREEN_BG,
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
  },
  changeText: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  deliveryAddressInfo: {
    flex: 1,
  },
  deliveryAddressLabel: {
    color: Colors.gray4,
    fontSize: ScaleSize(12),
  },
  deliveryAddressRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(12),
  },
  deliveryAddressValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    marginTop: ScaleSize(4),
  },
  deliveryCard: {
    backgroundColor: Colors.green03,
    borderRadius: ScaleSize(16),
    marginBottom: ScaleSize(12),
    padding: ScaleSize(16),
  },
  deliveryEta: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    marginTop: ScaleSize(24),
  },
  orderButton: {
    borderRadius: ScaleSize(14),
  },
  safeArea: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
});
