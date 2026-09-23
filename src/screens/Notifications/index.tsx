import type { ListRenderItemInfo } from 'react-native';
import type { TNotificationItem } from '@type/notifications';

import NotificationCard from './NotificationCard';
import NotificationsHeader from './NotificationsHeader';
import { Colors } from '@constants';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useNotifications } from '@hooks';
import { useTranslation } from 'react-i18next';

const keyExtractor = (item: TNotificationItem) => item.id;

/**
 * Màn Thông báo. Danh sách giữ nguyên thứ tự thời gian, còn việc thông báo nào
 * cần làm gì thì do chính thẻ thể hiện — xem `NOTIFICATION_ACTION_VIEWS`.
 */
function Notifications() {
  const {
    counts,
    filter,
    items,
    onAcknowledge,
    onChangeFilter,
    onOpen,
    onReadAll,
  } = useNotifications();
  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TNotificationItem>) => (
      <NotificationCard
        item={item}
        onAcknowledge={onAcknowledge}
        onOpen={onOpen}
      />
    ),
    [onAcknowledge, onOpen],
  );

  return (
    <View style={styles.container} testID="NotificationsScreen">
      <NotificationsHeader
        counts={counts}
        filter={filter}
        onChangeFilter={onChangeFilter}
        onReadAll={onReadAll}
      />

      <View style={styles.sheet}>
        <FlatList
          ListEmptyComponent={
            <Text style={styles.empty}>{t('notifications.empty')}</Text>
          }
          contentContainerStyle={styles.content}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

export default Notifications;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    gap: ScaleSize(12),
    padding: ScaleSize(16),
    paddingBottom: ScaleSize(28),
  },
  empty: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    paddingTop: ScaleSize(32),
    textAlign: 'center',
  },
  // Tấm nền bo hai góc trên, trùm lên mép dưới dải navy đúng như thiết kế.
  sheet: {
    backgroundColor: Colors.gray28,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
