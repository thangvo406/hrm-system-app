import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DOT_SIZE = ScaleSize(6);

type Properties = {
  readonly ink: string;
  readonly label: string;
  readonly showDot?: boolean;
  readonly surface: string;
};

/** Small status chip: "Active", "Inactive", "Primary". */
function Pill({ ink, label, showDot = false, surface }: Properties) {
  return (
    <View style={[styles.pill, { backgroundColor: surface }]}>
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: ink }]} />
      ) : undefined}
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
    </View>
  );
}

export default React.memo(Pill);

const styles = StyleSheet.create({
  dot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  label: {
    fontSize: ScaleSize(11),
    fontWeight: '700',
  },
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: ScaleSize(8),
    flexDirection: 'row',
    gap: ScaleSize(5),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(4),
  },
});
