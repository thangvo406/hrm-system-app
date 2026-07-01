import type { Product } from '@hooks';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import imageNames from '@assets/images/names';
import { ProductUtils } from '@utils';

const PRODUCT_THUMB_SIZE = ScaleSize(96);

const TEXT_DARK = '#1A1A1A';
const TEXT_PRICE = '#1A1A1A';

type Properties = {
  readonly item: Product;
  readonly isFirst: boolean;
  readonly onPress: (item: any) => void;
};

function ProductRow({ item, isFirst, onPress }: Properties) {
  const thumbUri = item.thumbnail?.fileUrl;

  const handlePress = () => {
    onPress(item);
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
          {ProductUtils.formatCurrency(item.sellingPrice)}
        </Text>
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
    fontSize: ScaleSize(13),
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
});
