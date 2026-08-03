import type { IProduct } from '@type/products';

import { Globals } from '@utils';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';

import ProductCard from './ProductCard';

type Properties = {
  readonly onPressProduct: (productId: number) => void;
  readonly products: IProduct[];
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
      onTouchCancel={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = false;
        }
      }}
      onTouchEnd={() => {
        if (Globals.isScrollingRef) {
          Globals.isScrollingRef.current = false;
        }
      }}
      showsHorizontalScrollIndicator={false}
    >
      {(products || []).map((product: IProduct) => (
        <ProductCard
          key={product.id}
          onPressProduct={onPressProduct}
          product={product}
          storeId={storeId}
        />
      ))}
    </ScrollView>
  );
}

export default React.memo(ProductList);

const styles = StyleSheet.create({
  productList: {
    gap: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(8),
  },
});
