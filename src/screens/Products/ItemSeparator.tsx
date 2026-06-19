import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const DIVIDER_COLOR = '#F0F0F0';

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export default React.memo(ItemSeparator);

const styles = StyleSheet.create({
  separator: {
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginHorizontal: ScaleSize(20),
  },
});
