import type { TNotificationItem } from '@type/notifications';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import {
  NOTIFICATION_ACTION_VIEWS,
  NOTIFICATION_TONES,
} from './notificationActions';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(40);
const ICON_SIZE = ScaleSize(20);
const CHECK_ICON_SIZE = ScaleSize(18);
const DOT_SIZE = ScaleSize(8);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly item: TNotificationItem;
  readonly onAcknowledge: (id: string) => void;
  readonly onOpen: (item: TNotificationItem) => void;
};

/**
 * Một thông báo. Hình dáng thẻ do `item.action` quyết định chứ không phải do
 * loại nội dung — xem `NOTIFICATION_ACTION_VIEWS`.
 */
function NotificationCard({ item, onAcknowledge, onOpen }: Properties) {
  const { t } = useTranslation();
  const view = NOTIFICATION_ACTION_VIEWS[item.action];
  const tone = NOTIFICATION_TONES[item.tone];

  const metaLabel = item.source
    ? t('notifications.meta', { at: item.at, source: item.source })
    : item.at;

  return (
    <AppButton
      onPress={() => {
        onOpen(item);
      }}
      style={[styles.container, view.isBlocking && { borderColor: tone.ink }]}
      testID={`NotificationCard_${item.id}`}
    >
      <View style={styles.row}>
        <View style={[styles.tile, { backgroundColor: tone.tint }]}>
          <Image
            color={tone.ink}
            height={ICON_SIZE}
            name={item.icon}
            type="svg"
            width={ICON_SIZE}
          />
        </View>

        <View style={styles.content}>
          {view.badgeKey ? (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: tone.tint }]}>
                <Text style={[styles.badgeLabel, { color: tone.ink }]}>
                  {t(view.badgeKey)}
                </Text>
              </View>
              <Text style={styles.time}>{item.at}</Text>
            </View>
          ) : undefined}

          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {item.isRead ? undefined : <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.body}>{item.body}</Text>

          {view.badgeKey ? undefined : (
            <Text numberOfLines={1} style={styles.meta}>
              {metaLabel}
            </Text>
          )}
        </View>

        {/* Nút phụ nằm cạnh nội dung khi thẻ không chặn — "Tham gia" là việc
            làm nhanh, không cần chiếm cả một hàng riêng. */}
        {view.primaryKey && !view.isBlocking ? (
          <AppButton
            onPress={() => {
              onOpen(item);
            }}
            style={styles.inlineButton}
            testID={`NotificationInline_${item.id}`}
          >
            <Text style={styles.inlineLabel}>{t(view.primaryKey)}</Text>
          </AppButton>
        ) : undefined}
      </View>

      {view.isBlocking && view.primaryKey ? (
        <View style={styles.actions}>
          <AppButton
            onPress={() => {
              onAcknowledge(item.id);
            }}
            style={styles.primaryButton}
            testID={`NotificationAcknowledge_${item.id}`}
          >
            <Image
              color={Colors.white}
              height={CHECK_ICON_SIZE}
              name="ic_check"
              type="svg"
              width={CHECK_ICON_SIZE}
            />
            <Text style={styles.primaryLabel}>{t(view.primaryKey)}</Text>
          </AppButton>

          {view.secondaryKey ? (
            <AppButton
              onPress={() => {
                onOpen(item);
              }}
              style={styles.secondaryButton}
              testID={`NotificationDetail_${item.id}`}
            >
              <Text style={styles.secondaryLabel}>{t(view.secondaryKey)}</Text>
            </AppButton>
          ) : undefined}
        </View>
      ) : undefined}
    </AppButton>
  );
}

export default React.memo(NotificationCard);

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(14),
  },
  badge: {
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
  },
  badgeLabel: {
    fontSize: ScaleSize(11),
    fontWeight: '700',
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginBottom: ScaleSize(6),
  },
  body: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
    marginTop: ScaleSize(4),
  },
  container: {
    backgroundColor: Colors.white,
    // Viền trong suốt sẵn để thẻ có viền màu không cao hơn các thẻ còn lại.
    borderColor: 'transparent',
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    elevation: CARD_ELEVATION,
    padding: ScaleSize(14),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  content: {
    flex: 1,
  },
  inlineButton: {
    alignSelf: 'center',
    borderColor: Colors.blue02,
    borderRadius: ScaleSize(10),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(8),
  },
  inlineLabel: {
    color: Colors.blue02,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  meta: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(12),
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    paddingVertical: ScaleSize(14),
  },
  primaryLabel: {
    color: Colors.white,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(14),
  },
  secondaryLabel: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  tile: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
  time: {
    color: Colors.gray18,
    flex: 1,
    fontSize: ScaleSize(12),
  },
  title: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    lineHeight: ScaleSize(21),
  },
  titleRow: {
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  unreadDot: {
    backgroundColor: Colors.blue02,
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    marginTop: ScaleSize(6),
    width: DOT_SIZE,
  },
});
