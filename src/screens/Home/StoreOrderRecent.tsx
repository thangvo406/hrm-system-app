import { AppButton, Image, ProductList } from '@components';
import { ScaleSize } from '@kits/core';
import { StoreItem } from '@type/store';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import React from 'react';
import { Colors } from '@constants';

const STORE_ICON_SIZE = ScaleSize(18);
const EMPTY_IMAGE_SIZE = ScaleSize(88);

const CARD_BG = '#FFFFFF';
const TITLE_COLOR = '#1A1A1A';
const SUBTITLE_COLOR = '#9E9E9E';

type dataProps = {
  readonly onPressProduct: (productId: number) => void;
  readonly onPressStore: () => void;
  readonly onPressEmptyStore: () => void;
  readonly data?: StoreItem;
};

function EmptyStoreView() {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyCard} testID="store-order-recent-empty">
      <View style={styles.emptyTextWrap}>
        <Text style={styles.emptyTitle}>{t('home.empty_store_title')}</Text>
        <Text style={styles.emptyDesc}>{t('home.empty_store_desc')}</Text>
      </View>
      <Image
        height={EMPTY_IMAGE_SIZE}
        name={imageNames.img_store_recent_default}
        type="image"
        width={EMPTY_IMAGE_SIZE}
      />
    </View>
  );
}

function StoreOrderRecent({
  onPressEmptyStore,
  onPressProduct,
  onPressStore,
  data = undefined,
}: dataProps) {
  const { t } = useTranslation();

  if (!data || !(data?.products?.length > 0)) {
    return (
      <AppButton onPress={onPressEmptyStore}>
        <Text style={styles.sectionLabel}>{t('home.frequent_store')}</Text>
        <EmptyStoreView />
      </AppButton>
    );
  }

  return (
    <>
      <Text style={styles.sectionLabel}>{t('home.frequent_store')}</Text>
      <View style={styles.storeHeader}>
        <View style={styles.storeNameRow}>
          <Image
            color={TITLE_COLOR}
            height={STORE_ICON_SIZE}
            name="ic_store"
            type="svg"
            width={STORE_ICON_SIZE}
          />
          <Text onPress={onPressStore} style={styles.storeName}>
            {data.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        {data?.receiveMethod?.map(item => (
          <View key={item} style={styles.containerDeliver}>
            <Text style={styles.labelDeliver}>
              {t(`stores.delivery_label.${item?.toLowerCase()}`)}
            </Text>
          </View>
        ))}
      </View>
      <ProductList
        onPressProduct={onPressProduct}
        products={data.products}
        storeId={data.id}
        style={{
          paddingHorizontal: ScaleSize(0),
          paddingRight: ScaleSize(20),
          paddingVertical: 0,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderCurve: 'continuous',
    borderRadius: ScaleSize(16),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    flexDirection: 'row',
    gap: ScaleSize(12),
    justifyContent: 'space-between',
    padding: ScaleSize(20),
  },
  containerDeliver: {
    paddingVertical: ScaleSize(4),
    paddingHorizontal: ScaleSize(8),
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(30),
    marginRight: ScaleSize(8),
  },
  labelDeliver: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  emptyDesc: {
    color: SUBTITLE_COLOR,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
  },
  emptyTextWrap: {
    flex: 1,
  },
  emptyTitle: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  sectionLabel: {
    color: '#5C5C5C',
    fontSize: ScaleSize(14),
    marginBottom: ScaleSize(10),
  },
  storeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: ScaleSize(12),
  },
  storeName: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  storeNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
});

export default React.memo(StoreOrderRecent);
