import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';

type StoreHeaderProperties = {
  readonly method: string | undefined;
  readonly storeName: string | undefined;
};

function StoreHeader({ method, storeName }: StoreHeaderProperties) {
  const { t } = useTranslation();
  const badgeLabel =
    method?.toUpperCase() === 'PICKUP'
      ? t('payment_cart.badge_pickup')
      : t('payment_cart.badge_delivery');

  return (
    <View style={styles.container}>
      <Text style={styles.storeName}>{storeName}</Text>
      {method ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      ) : undefined}
    </View>
  );
}

export default React.memo(StoreHeader);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(10),
    marginTop: ScaleSize(6),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(3),
  },
  badgeText: {
    color: Colors.white,
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  container: {
    paddingBottom: ScaleSize(4),
    paddingHorizontal: ScaleSize(4),
    marginBottom: ScaleSize(10),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
});
