import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { StyleSheet } from 'react-native';
import React from 'react';

const SKELETON_CARD_COUNT = 5;

const buildCardLayout = (index: number): any => ({
  backgroundColor: Colors.white,
  borderRadius: ScaleSize(14),
  flexDirection: 'row',
  key: `card-${index}`,
  marginBottom: ScaleSize(16),
  overflow: 'hidden',
  shadowColor: '#000000',
  shadowOffset: { height: 2, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  children: [
    // Left accent bar
    {
      backgroundColor: Colors.primary,
      key: `accent-${index}`,
      width: ScaleSize(6),
    },
    {
      flex: 1,
      key: `content-${index}`,
      paddingHorizontal: ScaleSize(16),
      paddingVertical: ScaleSize(14),
      children: [
        // Header row: coupon icon + title + D-day badge
        {
          alignItems: 'center',
          flexDirection: 'row',
          key: `header-${index}`,
          children: [
            {
              borderRadius: ScaleSize(4),
              height: ScaleSize(22),
              key: `icon-${index}`,
              width: ScaleSize(22),
            },
            {
              borderRadius: ScaleSize(4),
              flex: 1,
              height: ScaleSize(16),
              key: `title-${index}`,
              marginLeft: ScaleSize(8),
            },
            {
              borderRadius: ScaleSize(6),
              height: ScaleSize(20),
              key: `badge-${index}`,
              marginLeft: ScaleSize(8),
              width: ScaleSize(44),
            },
          ],
        },
        // Description
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(14),
          key: `desc-${index}`,
          marginTop: ScaleSize(12),
          width: '60%',
        },
        // Valid-until line
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(12),
          key: `valid-${index}`,
          marginTop: ScaleSize(10),
          width: '50%',
        },
        // Min payment / store line
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(12),
          key: `meta-${index}`,
          marginTop: ScaleSize(8),
          width: '75%',
        },
        // Use-now button
        {
          alignSelf: 'flex-end',
          borderRadius: ScaleSize(20),
          height: ScaleSize(34),
          key: `use-${index}`,
          marginTop: ScaleSize(14),
          width: ScaleSize(110),
        },
      ],
    },
  ],
});

const SKELETON_LAYOUT: any[] = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => buildCardLayout(index),
);

function VouchersLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(VouchersLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
});
