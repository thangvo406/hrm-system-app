import type { Product } from '@hooks';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import imageNames from '@assets/images/names';
import { ProductUtils } from '@utils';
import isNumber from 'lodash/isNumber';

const PRODUCT_THUMB_SIZE = ScaleSize(96);

const TEXT_DARK = '#1A1A1A';
const TEXT_PRICE = '#1A1A1A';
const PRIMARY_COLOR = '#5BB85C';
const STEPPER_BORDER = '#E5E5E5';

type Properties = {
  readonly item: Product;
  readonly isFirst: boolean;
  readonly onPress: (item: any) => void;
};

function ProductRow({ item, isFirst, onPress }: Properties) {
  const thumbUri = item.thumbnail?.fileUrl;
  const [quantity, setQuantity] = useState(item?.cartItemInfo?.quantity);
  const originalPrice = isNumber(item.discountPrice)
    ? item.discountPrice
    : item.sellingPrice || 0;
  const handlePress = () => {
    onPress(item);
  };

  const _onChangeQuantity = (delta: number) => () => {
    if (quantity + delta > item.stockQuantity) {
      // setError(
      //   t('product_detail.max_quantity_error', { count: maxQuantity }),
      // );
      return;
    }
    setQuantity(quantity + delta);
    // setError('');
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
              onPress={_onChangeQuantity(-1)}
            >
              <View style={styles.stepperBar} />
            </AppButton>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <AppButton
              style={styles.stepperIcon}
              onPress={_onChangeQuantity(1)}
            >
              <View style={styles.stepperBar} />
              <View style={[styles.stepperBar, styles.stepperBarVertical]} />
            </AppButton>
          </View>
        ) : undefined}
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
    borderColor: STEPPER_BORDER,
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
