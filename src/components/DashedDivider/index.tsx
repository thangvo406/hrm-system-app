import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly color?: string;
};

// A 1px mask clipping a fully dashed border keeps the dashes rendering on
// Android, where a lone `borderTopWidth` + `borderStyle: 'dashed'` draws solid.
const LINE_HEIGHT = ScaleSize(6);

function DashedDivider({ color = Colors.gray15 }: Properties) {
  return (
    <View style={styles.mask}>
      <View style={[styles.line, { borderColor: color }]} />
    </View>
  );
}

export default React.memo(DashedDivider);

const styles = StyleSheet.create({
  line: {
    borderStyle: 'dashed',
    borderWidth: 1,
    height: LINE_HEIGHT,
  },
  mask: {
    height: 1,
    marginVertical: ScaleSize(8),
    overflow: 'hidden',
  },
});
