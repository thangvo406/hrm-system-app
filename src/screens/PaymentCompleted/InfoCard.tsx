import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

type RowProps = {
  readonly label: string;
  readonly value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

type Properties = {
  readonly paymentAt: string;
  readonly paymentMethod: string;
  readonly storeName: string;
};

function InfoCard({ paymentAt, paymentMethod, storeName }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Row label={t('payment_completed.store_label')} value={storeName} />
      <Row
        label={t('payment_completed.method_label')}
        value={paymentMethod}
      />
      <Row label={t('payment_completed.datetime_label')} value={paymentAt} />
    </View>
  );
}

export default React.memo(InfoCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F7F9',
    borderRadius: ScaleSize(14),
    gap: ScaleSize(16),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(20),
  },
  label: {
    color: '#8A8F94',
    fontSize: ScaleSize(14),
    width: ScaleSize(96),
  },
  row: {
    flexDirection: 'row',
  },
  value: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
