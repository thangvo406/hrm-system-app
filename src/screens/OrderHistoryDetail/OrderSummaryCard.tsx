import type { IOrderHistoryDetailItem } from '@type';

import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { DATE_FORMAT, EMPTY_VALUE, sharedStyles } from './theme';
import { OrderTransactionStatus } from '@constants/config';

type Properties = {
  readonly onPressCopyOrderNumber: () => void;
  readonly order?: IOrderHistoryDetailItem;
};

const COPY_ICON_SIZE = ScaleSize(18);
const RECEIPT_ICON_SIZE = ScaleSize(28);

// order.status là string nên dùng Set<string> để has() nhận vào.
const SUCCESS_STATUSES: ReadonlySet<string> = new Set([
  OrderTransactionStatus.PAYMENT_COMPLETED,
  OrderTransactionStatus.PAYMENT_INTEGRATED_COMPLETED,
  OrderTransactionStatus.COMPLETED,
  OrderTransactionStatus.SHIPPING,
]);

const PENDING_STATUSES: ReadonlySet<string> = new Set([
  OrderTransactionStatus.PENDING,
  OrderTransactionStatus.PAYMENT_PENDING,
]);

function OrderSummaryCard({
  onPressCopyOrderNumber,
  order = undefined,
}: Properties) {
  const { t } = useTranslation();
  const { accentColor, statusTone } = useMemo(() => {
    const status = order?.status || '';
    if (SUCCESS_STATUSES.has(status)) {
      return {
        accentColor: Colors.primary,
        statusTone: { background: Colors.green09, color: Colors.green08 },
      };
    }
    if (PENDING_STATUSES.has(status)) {
      return {
        accentColor: Colors.yellow01,
        statusTone: { background: Colors.yellow04, color: Colors.yellow03 },
      };
    }
    // CANCEL_REQUESTED / CANCELED và mọi trạng thái khác dùng tone xám.
    return {
      accentColor: Colors.gray17,
      statusTone: { background: Colors.gray21, color: Colors.gray17 },
    };
  }, [order]);

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
