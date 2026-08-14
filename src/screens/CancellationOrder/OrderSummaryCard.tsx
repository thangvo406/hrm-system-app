import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { IOrderHistoryDetailItem } from '@type';

const CARD_SHADOW = 'rgba(23, 68, 33, 0.08)';
const DOC_ICON_SIZE = ScaleSize(22);

type Properties = {
  readonly order?: IOrderHistoryDetailItem;
};

function OrderSummaryCard({ order }: Properties) {
  const { t } = useTranslation();

  const productSummary = useMemo(() => {
    return order?.products?.map(it => it.name).join(',');
  }, [order]);

  const { storeName, orderNumber, totalAmount } = order || {};

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t('cancellation_order.order_label')}</Text>

      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Image
            color={Colors.green02}
            height={DOC_ICON_SIZE}
            name="ic_order_receipt"
            type="svg"
            width={DOC_ICON_SIZE}
          />
        </View>

        <View style={styles.texts}>
          <Text style={styles.orderNumber}>
            {t('cancellation_order.order_number', {
              number: orderNumber,
            })}
          </Text>
          {!!storeName && <Text style={styles.storeName}>{storeName}</Text>}
          {!!productSummary && (
            <Text style={styles.items} numberOfLines={3}>
              {t('cancellation_order.order_items', {
                amount: formatCurrency(totalAmount),
                items: productSummary,
              })}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default React.memo(OrderSummaryCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: 4,
    padding: ScaleSize(16),
    shadowColor: CARD_SHADOW,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: ScaleSize(12),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.green06,
    borderRadius: ScaleSize(12),
    height: ScaleSize(42),
    justifyContent: 'center',
    width: ScaleSize(42),
  },
  items: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
    marginTop: ScaleSize(4),
  },
  label: {
    color: Colors.green02,
    fontSize: ScaleSize(12),
    fontWeight: '700',
    marginBottom: ScaleSize(12),
  },
  orderNumber: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
  },
  storeName: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginTop: ScaleSize(2),
  },
  texts: {
    flex: 1,
    marginLeft: ScaleSize(12),
  },
});
