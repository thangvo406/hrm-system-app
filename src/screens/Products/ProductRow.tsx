import type { IProduct } from '@type/products';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import imageNames from '@assets/images/names';
import { ProductUtils } from '@utils';
import isNumber from 'lodash/isNumber';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
const PRODUCT_THUMB_SIZE = ScaleSize(96);

const TEXT_DARK = '#1A1A1A';
const TEXT_PRICE = '#1A1A1A';
const PRIMARY_COLOR = '#5BB85C';

type Properties = {
  readonly item: IProduct;
  readonly isFirst: boolean;
  readonly index: number;
  readonly onPress: (item: any) => void;
  readonly onChangeQuantity: (item: any, index: number) => void;
};

function ProductRow({
  item,
  index,
  isFirst,
  onChangeQuantity,
  onPress,
}: Properties) {
  const thumbUri = item.thumbnail?.fileUrl;
  const [quantity, setQuantity] = useState(0);
  const [errorMaxQuantity, setErrorMaxQuantity] = useState('');
  const { t } = useTranslation();
  const originalPrice = isNumber(item.discountPrice)
    ? item.discountPrice
    : item.sellingPrice || 0;

  const handlePress = () => {
    onPress(item);
  };

  useEffect(() => {
    if (item?.cartItemInfo) {
      setQuantity(item?.cartItemInfo?.quantity);
    } else {
      setQuantity(0);
    }
  }, [item?.cartItemInfo]);

  useEffect(() => {
    if (!item.cartItemInfo || item.cartItemInfo?.quantity == quantity) {
      return;
    }
    const debounceId = debounce(() => {
      onChangeQuantity?.(
        {
          ...item,
          cartItemInfo: {
            ...item.cartItemInfo,
            quantity,
          },
        },
        index,
      );
    }, 350);
    debounceId();
    return () => debounceId.cancel();
  }, [quantity, index]);

  const _onChangeQuantity = (type: string) => () => {
    const newQuantity = Math.max(
      0,
      type === 'plus' ? quantity + 1 : quantity - 1,
    );

    if (newQuantity > item.stockQuantity) {
      setErrorMaxQuantity(
        t('product_detail.max_quantity_error', { count: item.stockQuantity }),
      );
      return;
    }
    setQuantity(newQuantity);
    setErrorMaxQuantity('');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.productRow, isFirst && { marginTop: 20 }]}
      testID={`product-${item.id}`}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>
          {ProductUtils.formatCurrency(originalPrice)}
        </Text>
        {quantity > 0 ? (
          <View style={styles.stepper}>
            <AppButton
              style={styles.stepperIcon}
              onPress={_onChangeQuantity('')}
            >
              <View style={styles.stepperBar} />
            </AppButton>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <AppButton
              style={styles.stepperIcon}
              onPress={_onChangeQuantity('plus')}
            >
              <View style={styles.stepperBar} />
              <View style={[styles.stepperBar, styles.stepperBarVertical]} />
            </AppButton>
          </View>
        ) : undefined}
        {!!errorMaxQuantity && (
          <Text style={styles.errorMaxQuantity}>{errorMaxQuantity}</Text>
        )}
      </View>
      {thumbUri ? (
        <Image
          height={PRODUCT_THUMB_SIZE}
          style={styles.productThumb}
          testID={`product-${item.id}-thumb`}
          url={thumbUri}
          width={PRODUCT_THUMB_SIZE}
        />
      ) : (
        <Image
          height={PRODUCT_THUMB_SIZE}
          name={imageNames.img_product_default}
          style={styles.productThumb}
          testID={`product-${item.id}-thumb`}
          width={PRODUCT_THUMB_SIZE}
        />
      )}
    </TouchableOpacity>
  );
}

export default React.memo(ProductRow);

const styles = StyleSheet.create({
  productDescription: {
    color: 'black',
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  productInfo: {
    flex: 1,
    paddingRight: ScaleSize(12),
  },
  errorMaxQuantity: {
    color: 'red',
    fontSize: ScaleSize(14),
    fontWeight: '400',
    marginTop: ScaleSize(8),
  },
  productName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
  },
  productPrice: {
    color: TEXT_PRICE,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
    marginTop: ScaleSize(12),
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(20),
  },
  productThumb: {
    borderRadius: ScaleSize(10),
    height: PRODUCT_THUMB_SIZE,
    width: PRODUCT_THUMB_SIZE,
  },
  stepper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: Colors.primary,
    borderRadius: ScaleSize(24),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(12),
    // paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(5),
    width: ScaleSize(120),
  },
  stepperBar: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: ScaleSize(1.5),
    height: ScaleSize(2.5),
    width: ScaleSize(14),
  },
  stepperBarVertical: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  stepperIcon: {
    alignItems: 'center',
    height: ScaleSize(20),
    justifyContent: 'center',
    width: ScaleSize(20),
    flex: 1,
  },
  stepperValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
