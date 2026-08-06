import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BAR_HEIGHT = ScaleSize(12);
const BUMP_DEPTH = ScaleSize(32);
const BUMP_HALF_WIDTH = ScaleSize(30);
const FILLET_RADIUS = ScaleSize(13);
const BOTTOM_CORNER_RADIUS = ScaleSize(18);
const CHEVRON_SIZE = ScaleSize(16);
const CHEVRON_BOTTOM = ScaleSize(9);
const SHAPE_HEIGHT = BAR_HEIGHT + BUMP_DEPTH;
const CHEVRON_COLOR = '#FFFFFF';

/**
 * Bottom bar of the wallet card with a rounded tab bulging downwards in the
 * middle: flat bar, two concave shoulders, then the bump holding the chevron.
 * The bump itself is two true elliptical arcs (not a bezier approximation)
 * so it reads as properly round instead of a flattened shelf.
 */
const buildHandlePath = (width: number) => {
  const centerX = width / 2;
  const bumpBottom = BAR_HEIGHT + BUMP_DEPTH;
  const bumpRight = centerX + BUMP_HALF_WIDTH;
  const bumpLeft = centerX - BUMP_HALF_WIDTH;
  const bumpArcDepth = BUMP_DEPTH - FILLET_RADIUS;

  return [
    'M 0 0',
    `H ${width}`,
    `V ${BAR_HEIGHT - BOTTOM_CORNER_RADIUS}`,
    `Q ${width} ${BAR_HEIGHT} ${width - BOTTOM_CORNER_RADIUS} ${BAR_HEIGHT}`,
    `H ${bumpRight + FILLET_RADIUS}`,
    `Q ${bumpRight} ${BAR_HEIGHT} ${bumpRight} ${BAR_HEIGHT + FILLET_RADIUS}`,
    `A ${BUMP_HALF_WIDTH} ${bumpArcDepth} 0 0 1 ${centerX} ${bumpBottom}`,
    `A ${BUMP_HALF_WIDTH} ${bumpArcDepth} 0 0 1 ${bumpLeft} ${BAR_HEIGHT + FILLET_RADIUS}`,
    `Q ${bumpLeft} ${BAR_HEIGHT} ${bumpLeft - FILLET_RADIUS} ${BAR_HEIGHT}`,
    `H ${BOTTOM_CORNER_RADIUS}`,
    `Q 0 ${BAR_HEIGHT} 0 ${BAR_HEIGHT - BOTTOM_CORNER_RADIUS}`,
    'Z',
  ].join(' ');
};

type Properties = {
  readonly color: string;
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
  readonly testID?: string;
};

function ExpandHandle({ color, isExpanded, onToggle, testID }: Properties) {
  const [width, setWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <AppButton onPress={onToggle} style={styles.container} testID={testID}>
      <View onLayout={onLayout} style={styles.shape}>
        {width > 0 ? (
          <Svg height={SHAPE_HEIGHT} width={width}>
            <Path d={buildHandlePath(width)} fill={color} />
          </Svg>
        ) : undefined}
      </View>
      <View style={isExpanded ? styles.chevronExpanded : styles.chevron}>
        <Image
          color={CHEVRON_COLOR}
          height={CHEVRON_SIZE}
          name="ic_chevron_down"
          type="svg"
          width={CHEVRON_SIZE}
        />
      </View>
    </AppButton>
  );
}

export default React.memo(ExpandHandle);

const styles = StyleSheet.create({
  chevron: {
    bottom: CHEVRON_BOTTOM,
    position: 'absolute',
  },
  chevronExpanded: {
    bottom: CHEVRON_BOTTOM,
    position: 'absolute',
    transform: [{ rotate: '180deg' }],
  },
  container: {
    alignItems: 'center',
    height: SHAPE_HEIGHT,
    justifyContent: 'flex-end',
    width: '100%',
  },
  shape: {
    height: SHAPE_HEIGHT,
    width: '100%',
  },
});
