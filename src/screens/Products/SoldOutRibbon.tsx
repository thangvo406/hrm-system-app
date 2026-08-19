import { useI18n } from '@hooks';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

const RIBBON_COLOR = '#F04438';
const TEXT_COLOR = '#FFFFFF';

const VIEW_BOX = 96;
const CORNER_RADIUS = 10;
const RIBBON_SIZE = ScaleSize(VIEW_BOX);

const HYPOTENUSE = 40;
const TEXT_OFFSET = 24;
const TEXT_X = VIEW_BOX - TEXT_OFFSET / 2;
const TEXT_Y = TEXT_OFFSET / 2;

const RIBBON_PATH = [
  `M ${VIEW_BOX - HYPOTENUSE} 0`,
  `L ${VIEW_BOX - CORNER_RADIUS} 0`,
  `A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 1 ${VIEW_BOX} ${CORNER_RADIUS}`,
  `L ${VIEW_BOX} ${HYPOTENUSE}`,
  'Z',
].join(' ');

function SoldOutRibbon({ text }: any) {
  const { isEn } = useI18n();

  return (
    <Svg
      height={RIBBON_SIZE}
      pointerEvents="none"
      style={styles.ribbon}
      viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
      width={RIBBON_SIZE}
    >
      <Path d={RIBBON_PATH} fill={RIBBON_COLOR} />
      <SvgText
        alignmentBaseline="central"
        fill={TEXT_COLOR}
        fontSize={isEn ? 7.5 : 9.5}
        fontWeight="bold"
        textAnchor="middle"
        transform={`translate(${TEXT_X}, ${TEXT_Y}) rotate(45)`}
      >
        {text}
      </SvgText>
    </Svg>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default React.memo(SoldOutRibbon);
