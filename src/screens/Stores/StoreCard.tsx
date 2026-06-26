import type { StoreItem } from '@hooks';
import type { Product } from '@type/store';

import { Image, ProductList } from '@components';
import { ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';

const ICON_SIZE = ScaleSize(18);
const TEXT_DARK = '#1A1A1A';

type Properties = {
  readonly onPressProduct: (store: StoreItem, productId: number) => void;
  readonly onPressStore: (store: StoreItem) => void;
  readonly store: StoreItem;
};

function StoreCard({ onPressProduct, onPressStore, store }: Properties) {
  const { t } = useTranslation();
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
          {store.receiveMethod?.length > 0 ? (
            store.receiveMethod?.map(item => (
              <View key={item} style={styles.containerDeliver}>
                <Text style={styles.labelDeliver}>
                  {t(`stores.delivery_label.${item?.toLowerCase()}`)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.metaText}>--</Text>
          )}
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
  containerDeliver: {
    paddingVertical: ScaleSize(4),
    paddingHorizontal: ScaleSize(8),
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(30),
  },
  labelDeliver: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ScaleSize(20),
    marginTop: ScaleSize(8),
    paddingHorizontal: ScaleSize(20),
  },
  metaText: {
    color: 'black',
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
