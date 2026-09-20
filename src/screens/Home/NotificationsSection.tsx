import type { THomeNotification } from '@type/home';

import AppButton from '@components/AppButton';
import NotificationRow from './NotificationRow';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type Properties = {
  readonly notifications: readonly THomeNotification[];
  readonly onPressSeeAll: () => void;
};

/** Khối "Thông báo mới": tiêu đề, lối vào trung tâm thông báo và vài dòng đầu. */
function NotificationsSection({ notifications, onPressSeeAll }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.notifications_title')}</Text>
        <AppButton onPress={onPressSeeAll} testID="HomeNotificationsSeeAll">
          <Text style={styles.seeAll}>{t('home.notifications_see_all')}</Text>
        </AppButton>
      </View>

      {notifications.map(notification => (
        <NotificationRow key={notification.id} notification={notification} />
      ))}
    </View>
  );
}

export default React.memo(NotificationsSection);

const styles = StyleSheet.create({
  container: {
    marginTop: ScaleSize(22),
    paddingHorizontal: ScaleSize(16),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAll: {
    color: Colors.blue04,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
