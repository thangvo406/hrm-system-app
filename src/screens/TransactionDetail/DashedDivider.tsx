import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

function DashedDivider() {
  return (
    <View style={styles.mask}>
      <View style={styles.line} />
    </View>
  );
}

export default React.memo(DashedDivider);

const styles = StyleSheet.create({
  line: {
    borderColor: Colors.gray15,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: ScaleSize(6),
  },
  mask: {
    height: 1,
    marginVertical: ScaleSize(8),
    overflow: 'hidden',
  },
});
