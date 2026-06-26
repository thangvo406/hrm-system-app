import type { OrderHistoryAction } from '@type/payment';

import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#9E9E9E';
const ACTION_COLOR = '#1A73E8';
const ICON_BG = '#E8F5E8';
const THUMB_SIZE = ScaleSize(52);

type Properties = {
  readonly actions: OrderHistoryAction[];
  readonly points: number;
  readonly price: number;
  readonly storeName: string;
  readonly time: string;
  readonly onReorder: () => void;
  readonly onRate: () => void;
};

function formatPrice(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function OrderHistoryRow({
  actions,
  points,
  price,
  storeName,
  time,
  onReorder,
  onRate,
}: Properties) {
  const formattedTime = dayjs(time).format('HH:mm, DD [thg] M YYYY');
  const hasActions = actions.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Thumbnail placeholder */}
        <View style={styles.thumb}>
          <View style={styles.thumbInner} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text numberOfLines={2} style={styles.storeName}>
              {storeName}
            </Text>
            <View style={styles.priceCol}>
              <Text style={styles.price}>{formatPrice(price)}</Text>
              <Text style={styles.points}>+{points.toLocaleString('vi-VN')} GrabXu</Text>
            </View>
          </View>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
      </View>

      {hasActions ? (
        <View style={styles.actions}>
          {actions.includes('rate') ? (
            <Pressable hitSlop={8} onPress={onRate} style={styles.actionBtn}>
              <Text style={styles.actionLabel}>Đánh giá & gửi tiền típ</Text>
              <Text style={styles.actionArrow}> →</Text>
            </Pressable>
          ) : undefined}
          {actions.includes('reorder') ? (
            <Pressable hitSlop={8} onPress={onReorder} style={styles.actionBtn}>
              <Text style={styles.actionLabel}>Đặt lại</Text>
              <Text style={styles.actionArrow}> →</Text>
            </Pressable>
          ) : undefined}
        </View>
      ) : undefined}
    </View>
  );
}

export default React.memo(OrderHistoryRow);

const styles = StyleSheet.create({
  actionArrow: {
    color: ACTION_COLOR,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  actionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionLabel: {
    color: ACTION_COLOR,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(16),
    marginTop: ScaleSize(10),
    paddingLeft: THUMB_SIZE + ScaleSize(12),
  },
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  content: {
    flex: 1,
    gap: ScaleSize(4),
  },
  points: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
    textAlign: 'right',
  },
  price: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    textAlign: 'right',
  },
  priceCol: {
    alignItems: 'flex-end',
    marginLeft: ScaleSize(8),
    minWidth: ScaleSize(90),
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  storeName: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(15),
    fontWeight: '500',
    lineHeight: ScaleSize(22),
  },
  thumb: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: THUMB_SIZE / 2,
    height: THUMB_SIZE,
    justifyContent: 'center',
    overflow: 'hidden',
    width: THUMB_SIZE,
  },
  thumbInner: {
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(10),
    height: ScaleSize(20),
    opacity: 0.4,
    width: ScaleSize(20),
  },
  time: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(13),
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});
