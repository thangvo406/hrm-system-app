import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const DIVIDER_COLOR = '#EFEFEF';

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export default React.memo(ItemSeparator);

const styles = StyleSheet.create({
  separator: {
    backgroundColor: DIVIDER_COLOR,
    height: ScaleSize(8),
    width: '100%',
  },
});
