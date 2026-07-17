import type { Product } from '@type/store';

import { ProgressiveImage } from '@components';
import { Globals, ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import LinearGradient from 'react-native-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import isNumber from 'lodash/isNumber';

const PRODUCT_THUMB = ScaleSize(112);

const BANNER_OVERLAY_COLORS = ['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.05)'];

type Properties = {
  readonly onPressProduct: (productId: number) => void;
  readonly products: Product[];
  readonly storeId: number;
  readonly style?: ViewStyle | ViewStyle[];
};

function ProductList({ onPressProduct, style, products, storeId }: Properties) {
  return (
    <ScrollView
      contentContainerStyle={[styles.productList, style]}
      horizontal
      onTouchStart={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = true;
        }
      }}
      onScrollEndDrag={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = false;
        }
      }}
      showsHorizontalScrollIndicator={false}
    >
      {(products || []).map((product: Product) => {
        const thumbUri = product.thumbnail?.fileUrl;
        const originalPrice = isNumber(product.discountPrice)
          ? product.discountPrice
          : product.sellingPrice || 0;
        return (
          <TouchableOpacity
            activeOpacity={0.85}
            key={product.id}
            onPress={() => {
              onPressProduct(product.id);
            }}
            style={styles.productCard}
            testID={`store-${storeId}-product-${product.id}`}
          >
            <View style={styles.productCardInner}>
              <ProgressiveImage
                height={PRODUCT_THUMB}
                resizeMode="cover"
                style={styles.productThumb}
                url={thumbUri}
                name="img_product_default"
                width={PRODUCT_THUMB}
              />
            </View>
            <LinearGradient
              colors={BANNER_OVERLAY_COLORS}
              end={{ x: 0, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.bannerOverlayGradient}
            />
            <View
              style={{
                position: 'absolute',
                left: ScaleSize(10),
                top: ScaleSize(5),
                zIndex: 11,
              }}
            >
              <Text style={styles.productName} numberOfLines={4}>
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                {ProductUtils.formatCurrency(originalPrice)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default React.memo(ProductList);

const styles = StyleSheet.create({
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
  productList: {
    gap: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(8),
  },
  productName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  bannerOverlayGradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: ScaleSize(12),
  },
  productOverlay: {
    // height: '45%',
    justifyContent: 'flex-start',
    left: 0,
    padding: ScaleSize(10),
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
  productThumb: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
