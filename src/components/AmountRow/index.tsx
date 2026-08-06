import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly bold?: boolean;
  readonly caption?: string;
  readonly highlight?: boolean;
  readonly label: string;
  readonly value: string;
  readonly valueColor?: string;
};

function AmountRow({
  bold = false,
  caption = undefined,
  highlight = false,
  label,
  value,
  valueColor = Colors.black01,
}: Properties) {
  const strong = bold || highlight;
  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <View style={styles.labelCol}>
        <Text style={[styles.label, strong && styles.labelStrong]}>
          {label}
        </Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : undefined}
      </View>
      <Text
        style={[
          styles.value,
          strong && styles.valueStrong,
          { color: valueColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default React.memo(AmountRow);

const styles = StyleSheet.create({
  caption: {
    color: Colors.gray14,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  label: {
    color: Colors.gray13,
    fontSize: ScaleSize(14),
  },
  labelCol: {
    flex: 1,
  },
  labelStrong: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  rowHighlight: {
    backgroundColor: Colors.green07,
    borderRadius: ScaleSize(10),
    marginHorizontal: -ScaleSize(8),
    paddingHorizontal: ScaleSize(8),
  },
  value: {
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginLeft: ScaleSize(12),
  },
  valueStrong: {
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
