import type { StoreItem } from '@hooks';
import type { Product } from '@type/store';

import { Image, ProductList } from '@components';
import { ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const ICON_SIZE = ScaleSize(18);
const META_ICON_SIZE = ScaleSize(14);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#5C5C5C';

const DEFAULT_ESTIMATE_TIME = '약 15분 소요 예상';

type Properties = {
  readonly onPressProduct: (store: StoreItem, productId: number) => void;
  readonly onPressStore: (store: StoreItem) => void;
  readonly store: StoreItem;
};

function StoreCard({ onPressProduct, onPressStore, store }: Properties) {
  const handlePressStore = () => {
    onPressStore(store);
  };

  const handlePressProduct = (productId: number) => {
    onPressProduct(store, productId);
  };

  const minOrderText = store.minOrder
    ? `최소주문 : ${ProductUtils.formatCurrency(store.minOrder)}`
    : '';

  return (
    <View style={styles.card} testID={`store-${store.id}`}>
      <ProductList
        onPressProduct={handlePressProduct}
        products={store.products as Product[]}
        storeId={store.id}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePressStore}
        style={styles.nameRow}
        testID={`store-${store.id}-title`}
      >
        <Image
          color={TEXT_DARK}
          height={ICON_SIZE}
          name="ic_store"
          type="svg"
          width={ICON_SIZE}
        />
        <Text style={styles.storeName}>{store.name}</Text>
      </TouchableOpacity>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Image
            color={TEXT_MUTED}
            height={META_ICON_SIZE}
            name="ic_clock"
            type="svg"
            width={META_ICON_SIZE}
          />
          <Text style={styles.metaText}>
            {store.estimateTime || DEFAULT_ESTIMATE_TIME}
          </Text>
        </View>
        {minOrderText ? (
          <Text style={styles.metaText}>{minOrderText}</Text>
        ) : undefined}
      </View>
    </View>
  );
}

export default React.memo(StoreCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingTop: ScaleSize(16),
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(20),
    marginTop: ScaleSize(8),
    paddingHorizontal: ScaleSize(20),
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
});
