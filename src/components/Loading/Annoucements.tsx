import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const SKELETON_ROW_COUNT = 10;
const DATE_PLACEHOLDER_WIDTH = ScaleSize(60);
const TITLE_HEIGHT = ScaleSize(25);
const DATE_HEIGHT = ScaleSize(25);
const ROW_PADDING_VERTICAL = ScaleSize(14);
const ROW_PADDING_HORIZONTAL = ScaleSize(16);

const buildRowLayout = (index: number): ICustomViewStyle => ({
  alignItems: 'center',
  flexDirection: 'row',
  key: `row-${index}`,
  paddingHorizontal: ROW_PADDING_HORIZONTAL,
  paddingVertical: ROW_PADDING_VERTICAL,
  children: [
    {
      borderRadius: 4,
      flex: 1,
      height: TITLE_HEIGHT,
      key: `title-${index}`,
    },
    {
      borderRadius: 4,
      height: DATE_HEIGHT,
      key: `date-${index}`,
      marginLeft: ScaleSize(10),
      width: DATE_PLACEHOLDER_WIDTH,
    },
  ],
});

const SKELETON_LAYOUT: ICustomViewStyle[] = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => buildRowLayout(index),
);

function AnnouncementLoading() {
  return (
    <View style={styles.container} testID="announcements-loading">
      <Skeleton animationType="shiver" isLoading layout={SKELETON_LAYOUT} />
    </View>
  );
}

export default React.memo(AnnouncementLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
