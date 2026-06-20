import type { StoreItem } from '@hooks';
import type { Product } from '@type/store';

import { Image } from '@components';
import { ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

const ICON_SIZE = ScaleSize(18);
const META_ICON_SIZE = ScaleSize(14);
const PRODUCT_THUMB = ScaleSize(112);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#5C5C5C';

const PRODUCT_COLORS = [
  '#3A2E2A',
  '#C9B79C',
  '#D7B98E',
  '#E8C8B0',
] as const;

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

  const minOrderText = store.minOrder
    ? `최소주문 : ${ProductUtils.formatCurrency(store.minOrder)}`
    : '';

  return (
    <View style={styles.card} testID={`store-${store.id}`}>
      <ScrollView
        contentContainerStyle={styles.productList}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {(store.products || []).map((product: Product, index: number) => {
          const thumbUri = product.thumbnail?.fileUrl;
          const fallbackColor = PRODUCT_COLORS[index % PRODUCT_COLORS.length];
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              key={product.id}
              onPress={() => {
                onPressProduct(store, product.id);
              }}
              style={styles.productCard}
              testID={`store-${store.id}-product-${product.id}`}
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
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
});
