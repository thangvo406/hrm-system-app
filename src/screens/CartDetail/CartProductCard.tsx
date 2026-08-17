import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import type { IAttributeCart, IProductCart } from '@type';
import React, { useEffect, useState } from 'react';
import { AppButton, Image } from '@components';
import AppNavigator from '@navigation/AppNavigator';
import Information from '@dialogs/Information';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';
const IMAGE_SIZE = ScaleSize(72);
const STEPPER_BTN_SIZE = ScaleSize(30);
const CLOSE_ICON_COLOR = '#B6B6B6';
const STEPPER_MINUS_BG = '#EDEDED';

type CartProductCardProperties = {
  readonly item: IProductCart;
  readonly onChangeQuantity: (item: IProductCart) => void;
  readonly readOnly?: boolean;
};

function CartProductCard({
  item,
  onChangeQuantity,
  ...restProps
}: CartProductCardProperties) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(item.quantity);
  const [error, setError] = useState('');
  const readOnly = item.isForStudent || restProps?.readOnly;

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const confirmRemove = () => {
    AppNavigator.showDialog({
      screen: Information,
      title: t('payment_cart.product_info.remove_dialog_title'),
      cancelTitle: t('payment_cart.product_info.remove_dialog_cancel'),
      confirmTitle: t('payment_cart.product_info.remove_dialog_confirm'),
      onConfirm: () => {
        onChangeQuantity({ ...item, quantity: 0 });
      },
    });
  };

  const onPressPlus = () => {
    const newQuantity = quantity + 1;
    if (newQuantity > item.productStockQuantity) {
      setError(t('payment_cart.product_info.max_quantity_reached'));
      return;
    }
    setError('');
    setQuantity(newQuantity);
    onChangeQuantity({ ...item, quantity: newQuantity });
  };

  const onPressMinus = () => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) {
      confirmRemove();
      return;
    }
    setError('');
    setQuantity(newQuantity);
    onChangeQuantity({ ...item, quantity: newQuantity });
  };

  return (
    <View style={styles.card}>
      <Image
        height={IMAGE_SIZE}
        name={imageNames.img_product_default}
        resizeMode="cover"
        style={styles.image}
        url={item.productThumbnailUrl?.fileUrl}
        width={IMAGE_SIZE}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.price}>
          {t('common.display_price', {
            amount: formatCurrency(item.unitPrice),
          })}
        </Text>
        {item.selectedAttributes?.map(
          (attribute: IAttributeCart, index: number) => (
            <Text style={styles.attribute} key={index}>
              {attribute.attributeName}
            </Text>
          ),
        )}
        {error ? <Text style={styles.error}>{error}</Text> : undefined}
      </View>

      {readOnly ? (
        <View style={styles.quantityBox}>
          <Text style={styles.quantityText}>
            {t('payment_cart.quantity_count', { value: quantity })}
          </Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <AppButton
            onPress={confirmRemove}
            style={styles.closeBtn}
            testID={`cart-remove-${item.id}`}
          >
            <Text style={styles.closeIcon}>×</Text>
          </AppButton>

          <View style={styles.stepper}>
            <AppButton
              onPress={onPressMinus}
              style={[styles.stepperBtn, styles.stepperPlus]}
              testID={`cart-minus-${item.id}`}
            >
              <Text style={styles.stepperPlusIcon}>−</Text>
            </AppButton>
            <Text style={styles.stepperCount}>{quantity}</Text>
            <AppButton
              onPress={onPressPlus}
              style={[styles.stepperBtn, styles.stepperPlus]}
              testID={`cart-plus-${item.id}`}
            >
              <Text style={styles.stepperPlusIcon}>+</Text>
            </AppButton>
          </View>
        </View>
      )}
    </View>
  );
}

export default React.memo(CartProductCard);

const styles = StyleSheet.create({
  actions: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginLeft: ScaleSize(8),
  },
  attribute: {
    color: Colors.gray1,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: 3,
    flexDirection: 'row',
    marginBottom: ScaleSize(12),
    padding: ScaleSize(14),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  closeBtn: {
    alignItems: 'center',
    height: ScaleSize(24),
    justifyContent: 'center',
    width: ScaleSize(24),
  },
  closeIcon: {
    color: CLOSE_ICON_COLOR,
    fontSize: ScaleSize(22),
    lineHeight: ScaleSize(24),
  },
  error: {
    color: '#E53935',
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(4),
  },
  image: {
    backgroundColor: Colors.gray3,
    borderRadius: ScaleSize(10),
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: ScaleSize(12),
  },
  name: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  price: {
    color: Colors.primary,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(6),
  },
  quantityBox: {
    alignSelf: 'center',
    marginLeft: ScaleSize(8),
  },
  quantityText: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepperBtn: {
    alignItems: 'center',
    borderRadius: ScaleSize(8),
    height: STEPPER_BTN_SIZE,
    justifyContent: 'center',
    width: STEPPER_BTN_SIZE,
  },
  stepperCount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    minWidth: ScaleSize(28),
    textAlign: 'center',
  },
  stepperMinus: {
    backgroundColor: STEPPER_MINUS_BG,
  },
  stepperMinusIcon: {
    color: '#8A8A8A',
    fontSize: ScaleSize(18),
    lineHeight: ScaleSize(20),
  },
  stepperPlus: {
    backgroundColor: Colors.primary,
  },
  stepperPlusIcon: {
    color: Colors.white,
    fontSize: ScaleSize(18),
    lineHeight: ScaleSize(20),
  },
});
