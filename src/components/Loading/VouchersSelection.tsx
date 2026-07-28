import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { StyleSheet } from 'react-native';
import React from 'react';

const SKELETON_CARD_COUNT = 6;

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
    // Content: title + description on the left, checkbox on the right
    {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      key: `content-${index}`,
      paddingHorizontal: ScaleSize(16),
      paddingVertical: ScaleSize(14),
      children: [
        {
          key: `text-${index}`,
          children: [
            // Header row: coupon icon + title
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
                  height: ScaleSize(16),
                  key: `title-${index}`,
                  marginLeft: ScaleSize(8),
                  width: ScaleSize(130),
                },
              ],
            },
            // Description line
            {
              borderRadius: ScaleSize(4),
              height: ScaleSize(14),
              key: `desc-${index}`,
              marginTop: ScaleSize(12),
              width: ScaleSize(160),
            },
          ],
        },
        // Checkbox
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(22),
          key: `check-${index}`,
          width: ScaleSize(22),
        },
      ],
    },
  ],
});

const SKELETON_LAYOUT: any[] = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => buildCardLayout(index),
);

function VouchersSelectionLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(VouchersSelectionLoading);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
});
