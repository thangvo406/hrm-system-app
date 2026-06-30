import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { StyleSheet } from 'react-native';
import React from 'react';

const SKELETON_ROW_COUNT = 10;

const buildRowLayout = (index: number): any => ({
  key: `row-${index}`,
  paddingHorizontal: ScaleSize(16),
  paddingVertical: ScaleSize(16),
  flexDirection: 'row',
  alignItems: 'flex-start',
  children: [
    // Circle logo
    {
      borderRadius: ScaleSize(24),
      height: ScaleSize(48),
      key: `logo-${index}`,
      width: ScaleSize(48),
    },
    // Middle: store name + order code + date + reorder link
    {
      flex: 1,
      key: `meta-${index}`,
      marginLeft: ScaleSize(12),
      children: [
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(16),
          key: `store-${index}`,
          width: '55%',
        },
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(13),
          key: `code-${index}`,
          marginTop: ScaleSize(6),
          width: '70%',
        },
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(13),
          key: `date-${index}`,
          marginTop: ScaleSize(4),
          width: '45%',
        },
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(13),
          key: `reorder-${index}`,
          marginTop: ScaleSize(8),
          width: ScaleSize(70),
        },
      ],
    },
    // Right: price
    {
      borderRadius: ScaleSize(4),
      height: ScaleSize(18),
      key: `price-${index}`,
      marginLeft: ScaleSize(8),
      width: ScaleSize(70),
    },
    // Divider (full width, rendered as bottom border via height)
    {
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      bottom: 0,
      height: ScaleSize(1),
      key: `divider-${index}`,
      left: 0,
      position: 'absolute',
      right: 0,
    },
  ],
});

const SKELETON_LAYOUT: any[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => buildRowLayout(index),
);

function OrderHistoriesLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(OrderHistoriesLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
