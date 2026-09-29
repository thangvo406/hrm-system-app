import type { TNotificationFilter } from '@type/notifications';

import AppButton from '@components/AppButton';
import images from '@assets/images';
import Image from '@components/Image';
import NotificationFilterChip from './NotificationFilterChip';
import React from 'react';
import { Colors } from '@constants';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const CHECK_ICON_SIZE = ScaleSize(16);

const FILTERS: readonly {
  readonly labelKey: string;
  readonly value: TNotificationFilter;
}[] = [
  { labelKey: 'notifications.filter_all', value: 'all' },
  { labelKey: 'notifications.filter_unread', value: 'unread' },
  { labelKey: 'notifications.filter_needs_action', value: 'needs_action' },
];

type Properties = {
  readonly counts: Record<TNotificationFilter, number>;
  readonly filter: TNotificationFilter;
  readonly onChangeFilter: (filter: TNotificationFilter) => void;
  readonly onReadAll: () => void;
};

/** Dải navy đầu màn: tiêu đề, nút đọc tất cả và hàng lọc. */
function NotificationsHeader({
  counts,
  filter,
  onChangeFilter,
  onReadAll,
}: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ImageBackground
      resizeMode="cover"
      source={images.bg_home_header}
      style={[styles.container, { paddingTop: insets.top + ScaleSize(8) }]}
    >
      <View style={styles.titleRow}>
        <Text numberOfLines={1} style={styles.title}>
          {t('notifications.title')}
        </Text>

        <AppButton
          onPress={onReadAll}
          style={styles.readAllButton}
          testID="NotificationsReadAll"
        >
          <Image
            color={Colors.white}
            height={CHECK_ICON_SIZE}
            name="ic_check"
            type="svg"
            width={CHECK_ICON_SIZE}
          />
          <Text numberOfLines={1} style={styles.readAllLabel}>
            {t('notifications.read_all')}
          </Text>
        </AppButton>
      </View>

      <View style={styles.filters}>
        {FILTERS.map(item => (
          <NotificationFilterChip
            key={item.value}
            isActive={item.value === filter}
            label={
              // Nhóm "Tất cả" không kèm số: nó là mặc định, đếm lại chỉ lặp
              // đúng độ dài danh sách ngay bên dưới.
              item.value === 'all'
                ? t(item.labelKey)
                : t('notifications.filter_with_count', {
                    label: t(item.labelKey),
                    total: counts[item.value],
                  })
            }
            onChangeFilter={onChangeFilter}
            testID={`NotificationsFilter_${item.value}`}
            value={item.value}
          />
        ))}
      </View>
    </ImageBackground>
  );
}

export default React.memo(NotificationsHeader);

const styles = StyleSheet.create({
  container: {
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.navy05,
    paddingBottom: ScaleSize(28),
    paddingHorizontal: ScaleSize(16),
  },
  filters: {
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(16),
  },
  readAllButton: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(10),
  },
  readAllLabel: {
    color: Colors.white,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  title: {
    color: Colors.white,
    flex: 1,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
});
