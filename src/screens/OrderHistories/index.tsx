import type { OrderHistoryItem } from '@type/payment';
import type { ListRenderItem } from 'react-native';

import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { FlatList, StyleSheet, View } from 'react-native';
import { useOrderHistories } from '@hooks';
import OrderHistoryRow from './OrderHistoryRow';

const SCREEN_BG = '#F7F7F7';

function keyExtractor(item: OrderHistoryItem) {
  return item.id;
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function OrderHistories() {
  const { data, onLoadMore, onRate, onReorder } = useOrderHistories();

  const renderItem: ListRenderItem<OrderHistoryItem> = ({ item }) => (
    <OrderHistoryRow
      actions={item.actions}
      points={item.points}
      price={item.price}
      storeName={item.storeName}
      time={item.time}
      onRate={onRate}
      onReorder={onReorder}
    />
  );

  return (
    <View style={styles.container}>
      <HeaderDetail title="Lịch sử hoạt động" />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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
