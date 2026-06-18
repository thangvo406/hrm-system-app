import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const PRODUCT_THUMB_SIZE = ScaleSize(96);
const SKELETON_ROW_COUNT = 6;

const buildRowLayout = (index: number): ICustomViewStyle => ({
  alignItems: 'center',
  flexDirection: 'row',
  key: `row-${index}`,
  paddingHorizontal: ScaleSize(20),
  paddingVertical: ScaleSize(20),
  children: [
    {
      children: [
        {
          borderRadius: 4,
          height: ScaleSize(16),
          key: `name-${index}`,
          marginBottom: ScaleSize(6),
          width: '60%',
        },
        {
          borderRadius: 4,
          height: ScaleSize(13),
          key: `desc-${index}`,
          marginBottom: ScaleSize(12),
          width: '90%',
        },
        {
          borderRadius: 4,
          height: ScaleSize(16),
          key: `price-${index}`,
          width: '40%',
        },
      ],
      flex: 1,
      key: `info-${index}`,
      paddingRight: ScaleSize(12),
    },
    {
      borderRadius: ScaleSize(8),
      height: PRODUCT_THUMB_SIZE,
      key: `thumb-${index}`,
      width: PRODUCT_THUMB_SIZE,
    },
  ],
});

const SKELETON_LAYOUT: ICustomViewStyle[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => buildRowLayout(index),
);

function ProductsLoading() {
  return (
    <View style={styles.container}>
      <Skeleton
        animationType="shiver"
        isLoading
        layout={SKELETON_LAYOUT}
      />
    </View>
  );
}

export default ProductsLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});