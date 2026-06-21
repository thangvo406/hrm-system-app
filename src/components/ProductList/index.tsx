import type { Product } from '@type/store';

import { Image } from '@components';
import { Globals, ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const PRODUCT_THUMB = ScaleSize(112);

const PRODUCT_COLORS = ['#3A2E2A', '#C9B79C', '#D7B98E', '#E8C8B0'] as const;

type Properties = {
  readonly onPressProduct: (productId: number) => void;
  readonly products: Product[];
  readonly storeId: number;
};

function ProductList({ onPressProduct, products, storeId }: Properties) {
  return (
    <ScrollView
      contentContainerStyle={styles.productList}
      horizontal
      onTouchStart={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = true;
        }
      }}
      onTouchEnd={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = false;
        }
      }}
      showsHorizontalScrollIndicator={false}
    >
      {(products || []).map((product: Product, index: number) => {
        const thumbUri = product.thumbnail?.fileUrl;
        const fallbackColor = PRODUCT_COLORS[index % PRODUCT_COLORS.length];
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
            {thumbUri ? (
              <Image
                height={PRODUCT_THUMB}
                resizeMode="cover"
                style={styles.productThumb}
                url={thumbUri}
                width={PRODUCT_THUMB}
              />
            ) : (
              <View
                style={[
                  styles.productThumb,
                  { backgroundColor: fallbackColor },
                ]}
              />
            )}
            <View style={styles.productOverlay}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>
                {ProductUtils.formatCurrency(product.price)}
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
    borderRadius: ScaleSize(10),
    height: PRODUCT_THUMB,
    overflow: 'hidden',
    width: PRODUCT_THUMB,
  },
  productList: {
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(20),
  },
  productName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  productOverlay: {
    left: 0,
    padding: ScaleSize(8),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  productThumb: {
    flex: 1,
    height: PRODUCT_THUMB,
    width: PRODUCT_THUMB,
  },
});
