import { Button, EmptyView, HeaderDetail } from '@components';
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
import { DeviceUtils } from '@kits/core/utils';

const SCREEN_BG = '#F2F2F2';
const TEXT_DARK = '#1A1A1A';
const DELIVERY_FEE = 0;
const { ifAndroid } = DeviceUtils;

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
    isOutsideOpenHour,
    reopenText,
    onBack,
    onPressOrder,
    onPressPayment,
    onChangeQuantity,
  } = useCartDetail(props);

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
          {!!isOutsideOpenHour && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 9,
                backgroundColor: 'rgba(255,255,255,0.5)',
              }}
            />
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!!isOutsideOpenHour && (
              <Text
                numberOfLines={2}
                style={styles.labelClosed}
                testID="store-closed-label"
              >
                {t('products.store_closed')}
                {reopenText ? (
                  <Text style={styles.detail}>
                    {` · ${t('products.store_reopen_at', { time: reopenText })}`}
                  </Text>
                ) : undefined}
              </Text>
            )}

            <StoreHeader method={deliveryTab} storeName={data?.storeName} />

            {products?.map((item: IProductCart) => (
              <CartProductCard
                item={item}
                key={item.id}
                onChangeQuantity={onChangeQuantity}
                isOutsideOpenHour={isOutsideOpenHour}
                readOnly={isShowConfirmPayment}
              />
            ))}

            <OrderSummary
              deliveryFee={isShowConfirmPayment ? DELIVERY_FEE : undefined}
              subTotal={data?.subTotal}
              totalProduct={data?.totalQuantity}
            />
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              { paddingBottom: ifAndroid(16, insets.bottom || ScaleSize(20)) },
            ]}
          >
            <Button
              onPress={isShowConfirmPayment ? onPressPayment : onPressOrder}
              style={styles.orderButton}
              disabled={isOutsideOpenHour}
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
  labelClosed: {
    color: Colors.red03,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: 'bold',
    // marginLeft: ScaleSize(20),
    marginBottom: ScaleSize(10),
  },
  detail: {
    color: Colors.red04,
    fontWeight: 'bold',
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
