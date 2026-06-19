import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const TEXT_DARK = '#1A1A1A';
const DIVIDER_COLOR = '#F0F0F0';
const TITLE_SIZE = ScaleSize(14);
const TITLE_MARGIN_BOTTOM = ScaleSize(12);

type Properties = {
  readonly title: string;
};

function TitleRow({ title }: Properties) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
    </View>
  );
}

export default React.memo(TitleRow);

const styles = StyleSheet.create({
  divider: {
    borderColor: DIVIDER_COLOR,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    height: 1,
    marginBottom: TITLE_MARGIN_BOTTOM,
    width: '100%',
  },
  title: {
    color: TEXT_DARK,
    fontSize: TITLE_SIZE,
    fontWeight: '700',
    marginBottom: ScaleSize(8),
  },
});
