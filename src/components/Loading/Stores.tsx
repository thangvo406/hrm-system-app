import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';
import React from 'react';

const SKELETON_CARD_COUNT = 5;
const PRODUCT_THUMB = ScaleSize(112);
const PRODUCTS_PER_CARD = 4;
const PRODUCT_GAP = ScaleSize(10);
const PADDING_HORIZONTAL = ScaleSize(20);

const buildCardRows = (index: number): ICustomViewStyle[] => [
  {
    flexDirection: 'row',
    height: PRODUCT_THUMB,
    key: `products-${index}`,
    marginTop: index === 0 ? ScaleSize(12) : ScaleSize(20),
    paddingHorizontal: PADDING_HORIZONTAL,
    children: Array.from({ length: PRODUCTS_PER_CARD }, (_, productIndex) => ({
      borderRadius: ScaleSize(10),
      height: PRODUCT_THUMB,
      key: `product-${index}-${productIndex}`,
      marginRight: productIndex === PRODUCTS_PER_CARD - 1 ? 0 : PRODUCT_GAP,
      width: PRODUCT_THUMB,
    })),
  },
  {
    borderRadius: 4,
    height: ScaleSize(20),
    key: `name-${index}`,
    marginHorizontal: PADDING_HORIZONTAL,
    marginTop: ScaleSize(14),
    width: ScaleSize(120),
  },
  {
    flexDirection: 'row',
    height: ScaleSize(14),
    key: `meta-${index}`,
    marginTop: ScaleSize(10),
    paddingHorizontal: PADDING_HORIZONTAL,
    children: [
      {
        borderRadius: 4,
        height: ScaleSize(14),
        key: `meta-eta-${index}`,
        marginRight: ScaleSize(20),
        width: ScaleSize(120),
      },
      {
        borderRadius: 4,
        height: ScaleSize(14),
        key: `meta-min-${index}`,
        width: ScaleSize(120),
      },
    ],
  },
];

const SKELETON_LAYOUT: ICustomViewStyle[] = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => buildCardRows(index),
).flat();

function StoresLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(StoresLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
