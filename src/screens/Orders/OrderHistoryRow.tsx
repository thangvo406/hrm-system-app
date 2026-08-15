import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { formatCurrency } from '@utils/product';
import Image from '@components/Image';
import AppButton from '@components/AppButton';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#9E9E9E';
const ACTION_COLOR = '#1A73E8';
const ICON_BG = '#E8F5E8';
const THUMB_SIZE = ScaleSize(52);

type Properties = {
  readonly price: number;
  readonly hasItems?: boolean;
  readonly storeName: string;
  readonly orderCode: string;
  readonly storeLogo: string;
  readonly isSoldToday: boolean;
  readonly time: string;
  readonly onReOrder: () => void;
  readonly onPressItem: () => void;
};

function OrderHistoryRow({
  price,
  storeLogo,
  orderCode,
  storeName,
  time,
  hasItems,
  isSoldToday,
  onReOrder,
  onPressItem,
}: Properties) {
  const { t } = useTranslation();
  const isHideReorder = isSoldToday || !hasItems;
  return (
    <AppButton style={styles.container} onPress={onPressItem}>
      <View style={styles.row}>
        {/* Thumbnail placeholder */}
        <View style={styles.thumb}>
          <Image url={storeLogo} width="100%" height="100%" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.storeName}>{storeName}</Text>
            <Text style={styles.price}>{formatCurrency(price)}</Text>
          </View>
          <Text style={styles.orderCode}>{orderCode}</Text>
          <Text style={styles.time}>
            {dayjs(time).format('YYYY-MM-DD hh:mmA')}
          </Text>
        </View>
      </View>
      {!isHideReorder && (
        <View style={styles.actions}>
          <AppButton onPress={onReOrder} style={styles.actionBtn}>
            <Text style={styles.actionLabel}>
              {t('order_histories.reorder')}
            </Text>
            <Text style={styles.actionArrow}> →</Text>
          </AppButton>
        </View>
      )}
    </AppButton>
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
    fontWeight: 'bold',
    lineHeight: ScaleSize(22),
  },
  orderCode: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(13),
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
