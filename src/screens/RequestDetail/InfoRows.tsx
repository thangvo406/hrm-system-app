import type { TRequestDetailField } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly fields: readonly TRequestDetailField[];
};

function InfoRows({ fields }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {fields.map(field => (
        <View key={field.id} style={styles.row}>
          <Image
            color={Colors.gray17}
            height={ICON_SIZE}
            name={field.icon}
            type="svg"
            width={ICON_SIZE}
          />
          <Text style={styles.label}>{t(field.labelKey)}</Text>
          <Text style={styles.value}>{field.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default React.memo(InfoRows);

const styles = StyleSheet.create({
  container: {
    gap: ScaleSize(16),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    width: ScaleSize(104),
  },
  // Canh theo mép TRÊN chứ không phải giữa: ô lý do dài mấy dòng, canh giữa
  // thì icon và nhãn trôi xuống lưng chừng đoạn văn.
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  value: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    lineHeight: ScaleSize(20),
  },
});
