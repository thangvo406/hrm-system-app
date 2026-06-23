import { ScaleSize } from '@kits/core';
import Skeleton from 'react-native-reanimated-skeleton';
import { StyleSheet } from 'react-native';
import React from 'react';
const SKELETON_ROW_COUNT = 5;

const buildRowLayout = (index: number): any => ({
  key: `row-${index}`,
  paddingHorizontal: ScaleSize(16),
  paddingVertical: ScaleSize(16),
  children: [
    {
      // Top row: amount (left) + date (right)
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      key: `top-${index}`,
      children: [
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(22),
          key: `amount-${index}`,
          width: '35%',
        },
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(13),
          key: `date-${index}`,
          width: '38%',
        },
      ],
    },
    {
      // Bottom row: description (left) + balance (right)
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      key: `bottom-${index}`,
      marginTop: ScaleSize(10),
      children: [
        {
          key: `desc-wrap-${index}`,
          children: [
            {
              borderRadius: ScaleSize(4),
              height: ScaleSize(13),
              key: `desc1-${index}`,
              width: ScaleSize(160),
            },
            {
              borderRadius: ScaleSize(4),
              height: ScaleSize(13),
              key: `desc2-${index}`,
              marginTop: ScaleSize(4),
              width: ScaleSize(120),
            },
          ],
        },
        {
          borderRadius: ScaleSize(4),
          height: ScaleSize(13),
          key: `balance-${index}`,
          width: ScaleSize(120),
        },
      ],
    },
    {
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      height: ScaleSize(16),
      key: `divider-${index}`,
    },
  ],
});

const SKELETON_LAYOUT: any[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => buildRowLayout(index),
);

function TransactionHistoriesLoading() {
  return (
    <Skeleton
      containerStyle={styles.container}
      animationType="shiver"
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(TransactionHistoriesLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
