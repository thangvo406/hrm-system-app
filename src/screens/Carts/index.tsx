import type { ListRenderItem } from 'react-native';
import type { StoreCartItem } from '@type/payment';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaleSize } from '@kits/core';
import { AnnouncementLoading, EmptyView, ProgressiveImage } from '@components';
import { useCart } from '@hooks';
import { useTranslation } from 'react-i18next';
import { ProductUtils } from '@utils';
import React from 'react';
import HeaderDetail from '@components/HeaderDetail';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#8A8A8A';
const TEXT_GREEN = '#2FA94A';
const THUMBNAIL_SIZE = ScaleSize(72);
const MANAGE_FONT_SIZE = ScaleSize(14);

const keyExtractor = (item: StoreCartItem) => String(item.id);

type CartRowProps = {
  readonly item: StoreCartItem;
  readonly isManaging: boolean;
  readonly onRemove: (cartItemId: number) => void;
};

function CartRow({ isManaging, item, onRemove }: CartRowProps) {
  const { t } = useTranslation();
  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <View style={styles.row} testID={`cart-item-${item.id}`}>
      <View style={styles.rowContent}>
        <ProgressiveImage
          containerStyle={styles.thumbnail}
          height={THUMBNAIL_SIZE}
          url={item.thumbnail?.fileUrl ?? ''}
          width={THUMBNAIL_SIZE}
          name={imageNames.img_store_recent_default}
        />
        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.productName}>
            {item.storeName}
          </Text>
          <Text style={styles.metaText}>{item.totalQuantity} món</Text>
          <Text style={styles.totalPrice}>
            {ProductUtils.formatCurrency(item.subtotal)}
          </Text>
        </View>
      </View>
      {isManaging ? (
        <TouchableOpacity
          hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
          onPress={handleRemove}
          style={styles.removeButton}
          testID={`cart-remove-${item.id}`}
        >
          <Text style={styles.removeText}>{t('carts.remove')}</Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

const MemoCartRow = React.memo(CartRow);

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function Carts() {
  const { t } = useTranslation();
  const {
    isManaging,
    onLoadMore,
    items,
    loading,
    onRemoveItem,
    onToggleManage,
  } = useCart();

  const renderItem: ListRenderItem<StoreCartItem> = ({ item }) => (
    <MemoCartRow isManaging={isManaging} item={item} onRemove={onRemoveItem} />
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail
        showCartManage
        hideNotify
        title={t('carts.title')}
        onPressCartManage={onToggleManage}
      />

      {loading ? (
        <AnnouncementLoading />
      ) : items?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={1.5}
        />
      ) : (
        <EmptyView icon={imageNames.ic_store} desc={t('common.no_data')} />
      )}
    </View>
  );
}

export default Carts;

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
  },
  info: {
    flex: 1,
    gap: ScaleSize(4),
    paddingLeft: ScaleSize(12),
  },
  listContent: {
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(8),
  },
  manageButton: {
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
    position: 'absolute',
    right: ScaleSize(40),
    top: 0,
    borderWidth: 1,
  },
  manageText: {
    color: TEXT_GREEN,
    fontSize: MANAGE_FONT_SIZE,
    fontWeight: '600',
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
  },
  productName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: ScaleSize(12),
  },
  removeText: {
    color: '#E53935',
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: ScaleSize(12),
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  separator: {
    backgroundColor: '#F0F0F0',
    height: 1,
  },
  thumbnail: {
    borderRadius: ScaleSize(8),
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
  },
  totalPrice: {
    color: TEXT_GREEN,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});
