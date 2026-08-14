import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const TEXT_COLOR = '#F04438';
const BADGE_BG = '#FFFFFF';

const ICON_SIZE = ScaleSize(14);
const ICON_VIEW_BOX = 16;
const ICON_CENTER = ICON_VIEW_BOX / 2;
const ICON_RADIUS = 6.2;
// Endpoints of the diagonal stroke where it meets the circle (r / √2).
const ICON_DIAGONAL = ICON_RADIUS / Math.SQRT2;

function SoldOutBadge({ text }: any) {
  return (
    <View pointerEvents="none" style={styles.badge}>
      <Svg
        height={ICON_SIZE}
        viewBox={`0 0 ${ICON_VIEW_BOX} ${ICON_VIEW_BOX}`}
        width={ICON_SIZE}
      >
        <Circle
          cx={ICON_CENTER}
          cy={ICON_CENTER}
          fill="none"
          r={ICON_RADIUS}
          stroke={TEXT_COLOR}
          strokeWidth={1.6}
        />
        <Line
          stroke={TEXT_COLOR}
          strokeWidth={1.6}
          x1={ICON_CENTER - ICON_DIAGONAL}
          x2={ICON_CENTER + ICON_DIAGONAL}
          y1={ICON_CENTER - ICON_DIAGONAL}
          y2={ICON_CENTER + ICON_DIAGONAL}
        />
      </Svg>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: BADGE_BG,
    borderRadius: ScaleSize(18),
    bottom: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(5),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
    position: 'absolute',
    zIndex: 12,
  },
  label: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(8),
    fontWeight: '700',
  },
});

export default React.memo(SoldOutBadge);
