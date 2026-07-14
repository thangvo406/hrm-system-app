import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';
import React from 'react';

const LOGO_SIZE = ScaleSize(56);
const NUM_COLUMNS = 3;
const SKELETON_ROW_COUNT = 8;
const COLUMN_GAP = ScaleSize(12);
const PADDING_HORIZONTAL = ScaleSize(20);
const NAME_LINE_HEIGHT = ScaleSize(14);

const buildCard = (
  rowIndex: number,
  columnIndex: number,
): ICustomViewStyle => ({
  alignItems: 'center',
  flex: 1,
  key: `card-${rowIndex}-${columnIndex}`,
  children: [
    {
      borderRadius: LOGO_SIZE / 2,
      height: LOGO_SIZE,
      key: `logo-${rowIndex}-${columnIndex}`,
      marginBottom: ScaleSize(10),
      width: LOGO_SIZE,
    },
    {
      borderRadius: 4,
      height: NAME_LINE_HEIGHT,
      key: `name-${rowIndex}-${columnIndex}`,
      width: '70%',
    },
  ],
});

const buildRow = (rowIndex: number): ICustomViewStyle => ({
  flexDirection: 'row',
  gap: COLUMN_GAP,
  key: `row-${rowIndex}`,
  marginTop: rowIndex === 0 ? 0 : ScaleSize(12),
  paddingHorizontal: PADDING_HORIZONTAL,
  children: Array.from({ length: NUM_COLUMNS }, (_, columnIndex) =>
    buildCard(rowIndex, columnIndex),
  ),
});

const SKELETON_LAYOUT: ICustomViewStyle[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, rowIndex) => buildRow(rowIndex),
);

function UniversitiesLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(UniversitiesLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
