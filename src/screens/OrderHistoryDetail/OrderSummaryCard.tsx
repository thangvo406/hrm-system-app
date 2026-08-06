import type { IOrderHistoryDetailItem } from '@type';

import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';

import { DATE_FORMAT, EMPTY_VALUE, getStatusTone, sharedStyles } from './theme';

type Properties = {
  readonly isSuccess: boolean;
  readonly onPressCopyOrderNumber: () => void;
  readonly order?: IOrderHistoryDetailItem;
};

const COPY_ICON_SIZE = ScaleSize(18);
const RECEIPT_ICON_SIZE = ScaleSize(28);

function OrderSummaryCard({
  isSuccess,
  onPressCopyOrderNumber,
  order = undefined,
}: Properties) {
  const { t } = useTranslation();
  const accentColor = isSuccess ? Colors.primary : Colors.yellow01;
  const statusTone = getStatusTone(isSuccess, order?.status);

  return (
    <View style={sharedStyles.card}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Image
            color={Colors.primary}
            height={RECEIPT_ICON_SIZE}
            name="ic_order_receipt"
            type="svg"
            width={RECEIPT_ICON_SIZE}
          />
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaLabel}>
            {t('order_history_detail.order_code_label')}
          </Text>
          <View style={styles.codeRow}>
            <Text style={[styles.orderCode, { color: accentColor }]}>
              {order?.orderNumber}
            </Text>
            <AppButton onPress={onPressCopyOrderNumber} style={styles.copyIcon}>
              <Image
                color={accentColor}
                height={COPY_ICON_SIZE}
                name="ic_copy"
                type="svg"
                width={COPY_ICON_SIZE}
              />
            </AppButton>
          </View>
          <Text style={styles.orderTime}>
            {dayjs(order?.orderedAt).format(DATE_FORMAT)}
          </Text>
        </View>

        <View style={styles.right}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusTone.background },
            ]}
          >
            <Text style={[styles.statusText, { color: statusTone.color }]}>
              {order?.status
                ? t(
                    `order_history_detail.statuses.${order?.status.toLowerCase()}`,
                  )
                : EMPTY_VALUE}
            </Text>
          </View>
          <Text style={styles.totalLabel}>
            {t('order_history_detail.total_label')}
          </Text>
          <Text style={styles.totalAmount}>
            {t('common.display_price', {
              amount: formatCurrency(order?.summary?.finalPrice),
            })}
          </Text>
          <Text style={styles.paymentMethodNote}>
            {order?.paymentFundingSource
              ? t(
                  `order_history_detail.payment_methods.${order?.paymentFundingSource.toLowerCase()}`,
                )
              : EMPTY_VALUE}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(OrderSummaryCard);

const styles = StyleSheet.create({
  codeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    marginTop: ScaleSize(2),
  },
  copyIcon: {
    padding: ScaleSize(2),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.green09,
    borderRadius: ScaleSize(24),
    height: ScaleSize(48),
    justifyContent: 'center',
    marginRight: ScaleSize(12),
    width: ScaleSize(48),
  },
  meta: {
    flex: 1,
  },
  metaLabel: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
  },
  orderCode: {
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  orderTime: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  paymentMethodNote: {
    color: Colors.gray18,
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(2),
    textAlign: 'right',
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: ScaleSize(8),
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  statusBadge: {
    alignSelf: 'flex-end',
    borderRadius: ScaleSize(20),
    marginBottom: ScaleSize(8),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(4),
  },
  statusText: {
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  totalAmount: {
    color: Colors.black01,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  totalLabel: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
  },
});
