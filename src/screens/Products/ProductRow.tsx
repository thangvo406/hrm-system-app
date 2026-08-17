import type { IProduct } from '@type/products';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import imageNames from '@assets/images/names';
import { ProductUtils } from '@utils';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import SoldOutRibbon from './SoldOutRibbon';
const PRODUCT_THUMB_SIZE = ScaleSize(96);

const TEXT_DARK = '#1A1A1A';
const TEXT_PRICE = '#1A1A1A';
const PRIMARY_COLOR = '#5BB85C';
const SOLD_OUT_OVERLAY_COLOR = 'rgba(255,255,255,0.4)';

type Properties = {
  readonly item: IProduct;
  readonly isFirst: boolean;
  readonly index: number;
  readonly isOutsideOpenHour?: boolean;
  readonly onPress: (item: any) => void;
  readonly onChangeQuantity: (item: any, index: number) => void;
};

function ProductRow({
  item,
  index,
  isFirst,
  isOutsideOpenHour,
  onChangeQuantity,
  onPress,
}: Properties) {
  const thumbUri = item.thumbnail?.fileUrl;
  const quantity = item?.cartItemInfo?.quantity ?? 0;
  const [errorMaxQuantity, setErrorMaxQuantity] = useState('');
  const { t } = useTranslation();
  const originalPrice = isNumber(item.discountPrice)
    ? item.discountPrice
    : item.sellingPrice || 0;
  const isDisableUpdateQuantity = item.isForStudent;

  const isSoldOut = React.useMemo(
    () =>
      !item.isStockManaged
        ? false
        : !isNumber(item.stockQuantity) || item.stockQuantity <= 0,
    [item.isStockManaged, item.stockQuantity],
  );

  const { textSoldOut, descSoldOut } = useMemo(() => {
    let text = '';
    let descSoldOut = '';
    if (isSoldOut) {
      text = t('products.out_of_stock');
    } else if (item.isForStudent && item.isSoldToday) {
      text = t('products.limit_reached');
      descSoldOut = t('products.limit_reached_desc');
    }
    return {
      textSoldOut: text,
      descSoldOut,
    };
  }, [isSoldOut, item.isForStudent, item.isSoldToday, t]);

  const isDisableItem = !!textSoldOut || isOutsideOpenHour;

  const handlePress = () => {
    onPress(item);
  };

  const _onChangeQuantity = (type: string) => () => {
    const newQuantity = Math.max(
      0,
      type === 'plus' ? quantity + 1 : quantity - 1,
    );
    if (item.isStockManaged && newQuantity > item.stockQuantity) {
      setErrorMaxQuantity(
        t('product_detail.max_quantity_error', { count: item.stockQuantity }),
      );
      return;
    }

    setErrorMaxQuantity('');
    onChangeQuantity?.(
      {
        ...item,
        cartItemInfo: {
          ...item.cartItemInfo,
          quantity: newQuantity,
        },
      },
      index,
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={isDisableItem}
      style={[styles.productRow, isFirst && { marginTop: 20 }]}
      testID={`product-${item.id}`}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>
          {ProductUtils.formatCurrency(originalPrice)}
        </Text>
        {descSoldOut ? (
          <Text style={styles.descSoldOut}>{descSoldOut}</Text>
        ) : null}
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
              disabled={isDisableUpdateQuantity}
              style={styles.stepperIcon}
              onPress={_onChangeQuantity('plus')}
            >
              <View
                style={[
                  styles.stepperBar,
                  isDisableUpdateQuantity && styles.btnDisable,
                ]}
              />
              <View
                style={[
                  styles.stepperBar,
                  styles.stepperBarVertical,
                  isDisableUpdateQuantity && styles.btnDisable,
                ]}
              />
            </AppButton>
          </View>
        ) : undefined}
        {!!errorMaxQuantity && (
          <Text style={styles.errorMaxQuantity}>{errorMaxQuantity}</Text>
        )}
      </View>
      <View style={styles.thumbWrap}>
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
        {textSoldOut ? <SoldOutRibbon text={textSoldOut} /> : undefined}
      </View>
      {isDisableItem ? (
        <View pointerEvents="none" style={styles.soldOutOverlay} />
      ) : undefined}
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
  descSoldOut: {
    fontSize: ScaleSize(13),
    color: Colors.red03,
    marginTop: ScaleSize(4),
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
  thumbWrap: {
    borderRadius: ScaleSize(10),
    height: PRODUCT_THUMB_SIZE,
    overflow: 'hidden',
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
  btnDisable: {
    backgroundColor: Colors.gray08,
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
  soldOutOverlay: {
    backgroundColor: SOLD_OUT_OVERLAY_COLOR,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  stepperValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
