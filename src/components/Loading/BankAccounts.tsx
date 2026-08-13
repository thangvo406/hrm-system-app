import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { StyleSheet } from 'react-native';
import React from 'react';

const CARD_WIDTH = ScaleSize(180);
const CARD_HEIGHT = ScaleSize(240);

const SKELETON_LAYOUT: any[] = [
  {
    borderRadius: ScaleSize(4),
    height: ScaleSize(14),
    key: 'label',
    marginBottom: ScaleSize(14),
    marginLeft: ScaleSize(20),
    marginTop: ScaleSize(16),
    width: ScaleSize(80),
  },
  {
    alignItems: 'center',
    children: [
      {
        borderRadius: ScaleSize(16),
        height: CARD_HEIGHT,
        key: 'card',
        width: CARD_WIDTH,
      },
    ],
    flexDirection: 'row',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    key: 'carousel',
  },
  {
    children: [
      {
        borderRadius: ScaleSize(3),
        height: ScaleSize(6),
        key: 'dot-1',
        width: ScaleSize(20),
      },
      {
        borderRadius: ScaleSize(3),
        height: ScaleSize(6),
        key: 'dot-2',
        marginLeft: ScaleSize(4),
        width: ScaleSize(6),
      },
      {
        borderRadius: ScaleSize(3),
        height: ScaleSize(6),
        key: 'dot-3',
        marginLeft: ScaleSize(4),
        width: ScaleSize(6),
      },
    ],
    flexDirection: 'row',
    justifyContent: 'center',
    key: 'dots',
    marginTop: ScaleSize(14),
  },
];

function BankAccountsLoading() {
  return (
    <Skeleton
      containerStyle={styles.container}
      animationType="shiver"
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(BankAccountsLoading);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
