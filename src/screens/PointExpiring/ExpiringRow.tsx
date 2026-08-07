import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import type { IPointExpiryItem } from '@type/wallet';

type Properties = {
  readonly item: IPointExpiryItem;
};

function ExpiringRow({ item }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Text style={styles.date}>
        {t('point_expiring.expire_at', { date: item.expiresOn })}
      </Text>
      <Text style={styles.amount}>
        {`${formatCurrency(item.amount)} ${t('point_expiring.point_unit')}`}
      </Text>
    </View>
  );
}

export default React.memo(ExpiringRow);

const styles = StyleSheet.create({
  amount: {
    color: Colors.red01,
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginLeft: ScaleSize(12),
  },
  date: {
    color: Colors.black01,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  row: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray3,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(18),
  },
});
