import type { IProduct } from '@type/products';

import { Colors } from '@constants';
import { ProgressiveImage } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Properties = {
  readonly product: IProduct;
};

const FULL_SIZE = '100%';
const THUMB_SIZE = ScaleSize(64);

function ProductRow({ product }: Properties) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.thumb}>
        {product.productThumbnail?.fileUrl ? (
          <ProgressiveImage
            height={FULL_SIZE}
            url={product?.productThumbnail?.fileUrl}
            width={FULL_SIZE}
          />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        {product.selectedAttributes?.map(item => (
          <Text key={item.attributeItemId} style={styles.attr}>
            {item.attributeName}
          </Text>
        ))}
        <Text style={styles.qty}>x{product?.quantity}</Text>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
        }}
      >
        <Text style={styles.price}>
          {t('common.display_price', { amount: formatCurrency(product.price) })}
        </Text>
        {!!product?.discountEligible && (
          <Text style={styles.discountPrice}>
            {t('order_history_detail.price_detail.memberDiscountPrice')}
            {` -${t('common.display_price', {
              amount: formatCurrency(product.discountMemberAmount),
            })}`}
          </Text>
        )}
      </View>
    </View>
  );
}

export default React.memo(ProductRow);

const styles = StyleSheet.create({
  attr: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  content: {
    flex: 1,
    marginLeft: ScaleSize(10),
  },
  name: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  discountPrice: {
    color: Colors.red03,
    fontSize: ScaleSize(9),
    fontWeight: '600',
  },
  price: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  qty: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: ScaleSize(10),
  },
  thumb: {
    backgroundColor: Colors.gray20,
    borderRadius: ScaleSize(8),
    height: THUMB_SIZE,
    overflow: 'hidden',
    width: THUMB_SIZE,
  },
  thumbPlaceholder: {
    backgroundColor: Colors.gray07,
    flex: 1,
  },
});
