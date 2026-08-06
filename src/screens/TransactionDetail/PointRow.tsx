import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly direction: 'earned' | 'used';
  readonly label: string;
  readonly value: string;
};

const ICON_SIZE = 16;
const TONE = {
  earned: {
    badge: Colors.green06,
    icon: 'ic_arrow_up',
    iconColor: Colors.green02,
  },
  used: {
    badge: Colors.red02,
    icon: 'ic_arrow_down',
    iconColor: Colors.red01,
  },
} as const;

function PointRow({ direction, label, value }: Properties) {
  const tone = TONE[direction];
  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: tone.badge }]}>
        <Image
          color={tone.iconColor}
          height={ScaleSize(ICON_SIZE)}
          name={tone.icon}
          type="svg"
          width={ScaleSize(ICON_SIZE)}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default React.memo(PointRow);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: ScaleSize(15),
    height: ScaleSize(30),
    justifyContent: 'center',
    marginRight: ScaleSize(12),
    width: ScaleSize(30),
  },
  label: {
    color: Colors.gray13,
    flex: 1,
    fontSize: ScaleSize(14),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: ScaleSize(10),
  },
  value: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginLeft: ScaleSize(12),
  },
});
