import { ScaleSize } from '@kits/core';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
const TEXT_MUTED = '#7A7A7A';
const PRIMARY_COLOR = '#5BB85C';

type Properties = {
  readonly loading: boolean;
};

function ListEmpty({ loading }: Properties) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={PRIMARY_COLOR} />
      </View>
    );
  }
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{t('products.empty')}</Text>
    </View>
  );
}

export default React.memo(ListEmpty);

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScaleSize(48),
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
});
