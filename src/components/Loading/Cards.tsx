import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH - ScaleSize(64);
const CARD_HEIGHT = ScaleSize(96);

const SKELETON_LAYOUT: any[] = [
  {
    borderRadius: ScaleSize(4),
    height: ScaleSize(14),
    key: 'label',
    marginBottom: ScaleSize(14),
    marginLeft: ScaleSize(20),
    marginTop: ScaleSize(20),
    width: ScaleSize(90),
  },
  {
    alignItems: 'center',
    children: [
      {
        borderRadius: ScaleSize(16),
        height: CARD_HEIGHT,
        key: 'card',
        width: ITEM_WIDTH,
      },
    ],
    flexDirection: 'row',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    key: 'carousel',
  },
];

function CardsLoading() {
  return (
    <Skeleton
      containerStyle={styles.container}
      animationType="shiver"
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(CardsLoading);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
