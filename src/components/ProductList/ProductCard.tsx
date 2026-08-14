import type { IProduct } from '@type/products';

import { AppButton, ProgressiveImage } from '@components';
import { ScaleSize } from '@kits/core';
import isNumber from 'lodash/isNumber';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProductUtils } from '@utils';

import SoldOutBadge from './SoldOutBadge';
import SoldOutThumb from './SoldOutThumb';
import { useTranslation } from 'react-i18next';

const PRODUCT_THUMB = ScaleSize(112);

const BANNER_OVERLAY_COLORS = ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.05)'];
const SOLD_OUT_OVERLAY_COLOR = 'rgba(255,255,255,0.4)';

type Properties = {
  readonly onPressProduct: (productId: number) => void;
  readonly product: IProduct;
  readonly storeId: number;
};

function ProductCard({ onPressProduct, product, storeId }: Properties) {
  const thumbUri = product.thumbnail?.fileUrl;
  const {
    isStockManaged,
    stockQuantity,
    isForStudent,
    discountPrice,
    isSoldToday,
    sellingPrice,
  } = product || {};
  const { t } = useTranslation();
  const isSoldOut = !isStockManaged
    ? false
    : !isNumber(stockQuantity) || stockQuantity <= 0;
  const originalPrice = isNumber(discountPrice)
    ? discountPrice
    : sellingPrice || 0;

  const textSoldOut = useMemo(() => {
    if (isSoldOut) {
      return t('products.sold_out');
    } else if (isForStudent && isSoldToday) {
      return t('products.limit_reached');
    }
    return '';
  }, [isSoldOut, t]);

  const isDisableItem = !!textSoldOut;

  return (
    <AppButton
      disabled={isDisableItem}
      onPress={() => {
        onPressProduct(product.id);
      }}
      style={styles.productCard}
      testID={`store-${storeId}-product-${product.id}`}
    >
      <View style={styles.productCardInner}>
        {isDisableItem ? (
          <SoldOutThumb size={PRODUCT_THUMB} uri={thumbUri} />
        ) : (
          <ProgressiveImage
            height={PRODUCT_THUMB}
            resizeMode="cover"
            url={thumbUri ?? ''}
            name="img_product_default"
            width={PRODUCT_THUMB}
          />
        )}
      </View>
      <LinearGradient
        colors={BANNER_OVERLAY_COLORS}
        end={{ x: 0, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.bannerOverlayGradient}
      />
      <View style={styles.productTitleWrap}>
        <Text style={styles.productName} numberOfLines={4}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>
          {ProductUtils.formatCurrency(originalPrice)}
        </Text>
      </View>
      {isDisableItem ? (
        <>
          <View pointerEvents="none" style={styles.soldOutOverlay} />
          <SoldOutBadge text={textSoldOut} />
        </>
      ) : undefined}
    </AppButton>
  );
}

export default React.memo(ProductCard);

const styles = StyleSheet.create({
  bannerOverlayGradient: {
    borderRadius: ScaleSize(12),
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  productCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: ScaleSize(12),
    elevation: 6,
    height: PRODUCT_THUMB,
    marginHorizontal: ScaleSize(4),
    marginVertical: ScaleSize(6),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    width: PRODUCT_THUMB,
  },
  productCardInner: {
    backgroundColor: '#F2F2F2',
    borderRadius: ScaleSize(12),
    height: PRODUCT_THUMB,
    overflow: 'hidden',
    width: PRODUCT_THUMB,
    zIndex: 1,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
  productTitleWrap: {
    left: ScaleSize(10),
    position: 'absolute',
    top: ScaleSize(5),
    zIndex: 11,
  },
  soldOutOverlay: {
    backgroundColor: SOLD_OUT_OVERLAY_COLOR,
    borderRadius: ScaleSize(12),
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
