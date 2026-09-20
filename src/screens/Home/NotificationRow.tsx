import type { THomeNotification, THomeNotificationTone } from '@type/home';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const BADGE_SIZE = ScaleSize(40);
const BADGE_TRACKING = ScaleSize(0.3);
const ICON_SIZE = ScaleSize(20);

const TONE_BACKGROUNDS: Record<THomeNotificationTone, string> = {
  success: Colors.green06,
  urgent: Colors.red02,
};

const TONE_INKS: Record<THomeNotificationTone, string> = {
  success: Colors.green08,
  urgent: Colors.red03,
};

type Properties = {
  readonly notification: THomeNotification;
};

/** Một dòng thông báo: icon theo sắc thái, tiêu đề, nguồn gửi và thời điểm. */
function NotificationRow({ notification }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBadge,
          { backgroundColor: TONE_BACKGROUNDS[notification.tone] },
        ]}
      >
        <Image
          color={TONE_INKS[notification.tone]}
          height={ICON_SIZE}
          name={notification.icon}
          type="svg"
          width={ICON_SIZE}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {notification.title}
          </Text>
          {notification.needsAction ? (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeLabel}>
                {t('home.notification_needs_action')}
              </Text>
            </View>
          ) : undefined}
        </View>
        <Text numberOfLines={1} style={styles.meta}>
          {t('home.notification_meta', {
            source: notification.source,
            timeAgo: notification.timeAgo,
          })}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(NotificationRow);

const styles = StyleSheet.create({
  actionBadge: {
    backgroundColor: Colors.red02,
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(6),
    paddingVertical: ScaleSize(3),
  },
  actionBadgeLabel: {
    color: Colors.red03,
    fontSize: ScaleSize(10),
    fontWeight: '700',
    letterSpacing: BADGE_TRACKING,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    gap: ScaleSize(12),
    marginTop: ScaleSize(10),
    padding: ScaleSize(14),
  },
  content: {
    flex: 1,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: BADGE_SIZE,
    justifyContent: 'center',
    width: BADGE_SIZE,
  },
  meta: {
    color: Colors.gray17,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(3),
  },
  title: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
});
