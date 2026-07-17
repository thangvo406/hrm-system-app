import type { IOrderHistoryItem } from '@type/payment';
import type { ListRenderItem } from 'react-native';

import { EmptyView, HeaderDetail, OrderHistoriesLoading } from '@components';
import { ScaleSize } from '@kits/core';
import { FlatList, StyleSheet, View } from 'react-native';
import { useOrderHistories } from '@hooks';
import OrderHistoryRow from './OrderHistoryRow';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
const SCREEN_BG = '#F7F7F7';

function keyExtractor(item: IOrderHistoryItem) {
  return item.id;
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function OrderHistories() {
  const { data, loading, onLoadMore, onPressItem, onReOrder } =
    useOrderHistories();

  const { t } = useTranslation();

  const renderItem: ListRenderItem<IOrderHistoryItem> = ({ item }) => (
    <OrderHistoryRow
      price={item.totalAmount}
      storeName={item.storeName}
      orderCode={item.orderNumber}
      time={item.orderedAt || ''}
      onPressItem={() => onPressItem(item)}
      onReOrder={() => onReOrder(item)}
      storeLogo={item.storeLogo?.fileUrl}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderDetail title={t('order_histories.title')} />
      {loading ? (
        <OrderHistoriesLoading />
      ) : data?.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onLoadMore}
          onEndReachedThreshold={1.5}
        />
      ) : (
        <EmptyView icon={imageNames.ic_package} desc={t('common.no_data')} />
      )}
    </View>
  );
}

export default OrderHistories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    marginTop: ScaleSize(8),
  },
  separator: {
    backgroundColor: '#EFEFEF',
    height: 1,
    marginHorizontal: ScaleSize(16),
  },
});
