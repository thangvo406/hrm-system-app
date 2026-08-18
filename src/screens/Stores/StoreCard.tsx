import type { IStoreItem } from '@type/store';
import type { IProduct } from '@type/products';

import { Image, ProductList } from '@components';
import { CommonUtils, ProductUtils } from '@utils';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { trimSeconds } from '@utils/date';

const ICON_SIZE = ScaleSize(18);
const TEXT_DARK = '#1A1A1A';

type Properties = {
  readonly onPressProduct: (store: IStoreItem, productId: number) => void;
  readonly onPressStore: (store: IStoreItem) => void;
  readonly store: IStoreItem;
};

function StoreCard({ onPressProduct, onPressStore, store }: Properties) {
  const { t } = useTranslation();
  const handlePressStore = () => {
    onPressStore(store);
  };

  const handlePressProduct = (productId: number) => {
    onPressProduct(store, productId);
  };

  const isOutsideOpenHour = useMemo(
    () => CommonUtils.isStoreOutsideOpenHour(store),
    [store],
  );
  const reopenText = useMemo(
    () =>
      CommonUtils.getStoreReopenText(
        store,
        t('products.store_reopen_date_format'),
      ),
    [store, t],
  );

  const openTime = useMemo(() => {
    let text = '';
    if (store?.openingTime) {
      text = trimSeconds(store.openingTime);
    }
    if (store?.closedTime) {
      text += `-${trimSeconds(store.closedTime)}`;
    }
    return text;
  }, [store?.closedTime, store?.openingTime]);

  const minOrderText = store.minOrder
    ? t('stores.min_order', {
        amount: ProductUtils.formatCurrency(store.minOrder),
      })
    : '';

  return (
    <View style={styles.card} testID={`store-${store.id}`}>
      <ProductList
        onPressProduct={handlePressProduct}
        products={store.products as IProduct[]}
        storeId={store.id}
        isOutsideOpenHour={isOutsideOpenHour}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePressStore}
        testID={`store-${store.id}-title`}
      >
        <View style={styles.nameRow}>
          <Image
            color={isOutsideOpenHour ? Colors.gray4 : TEXT_DARK}
            height={ICON_SIZE}
            name="ic_store"
            type="svg"
            width={ICON_SIZE}
          />
          <Text
            style={[styles.storeName, isOutsideOpenHour && styles.textGray]}
          >
            {store.name}
          </Text>
        </View>
        {!!openTime && (
          <Text style={styles.openTime}>
            {t('stores.open_hours', { time: openTime })}
          </Text>
        )}
        {!!isOutsideOpenHour && (
          <Text
            numberOfLines={2}
            style={styles.labelClosed}
            testID="store-closed-label"
          >
            {t('products.store_closed')}
            {reopenText ? (
              <Text style={styles.detail}>
                {` · ${t('products.store_reopen_at', { time: reopenText })}`}
              </Text>
            ) : undefined}
          </Text>
        )}

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
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(StoreCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingTop: ScaleSize(16),
  },
  detail: {
    color: Colors.red04,
    fontWeight: 'bold',
  },
  textGray: {
    color: Colors.gray4,
  },
  labelClosed: {
    color: Colors.red03,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: 'bold',
    marginLeft: ScaleSize(20),
    marginTop: ScaleSize(10),
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
  openTime: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    marginLeft: ScaleSize(20),
    marginTop: ScaleSize(5),
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
