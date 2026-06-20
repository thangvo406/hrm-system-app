import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';
import React from 'react';

const SKELETON_CARD_COUNT = 8;
const ICON_CIRCLE_SIZE = ScaleSize(56);
const CARD_BORDER_RADIUS = ScaleSize(18);
const CARD_GAP = ScaleSize(14);
const CARD_PADDING_HORIZONTAL = ScaleSize(16);
const CARD_PADDING_VERTICAL = ScaleSize(18);
const CARD_MARGIN_BOTTOM = ScaleSize(14);
const LIST_PADDING_HORIZONTAL = ScaleSize(16);
const LIST_PADDING_TOP = ScaleSize(8);
const DATE_PLACEHOLDER_WIDTH = ScaleSize(90);
const TITLE_HEIGHT = ScaleSize(16);
const DATE_HEIGHT = ScaleSize(12);
const DESCRIPTION_HEIGHT = ScaleSize(13);

const buildCardLayout = (index: number): ICustomViewStyle => ({
  alignItems: 'center',
  borderRadius: CARD_BORDER_RADIUS,
  flexDirection: 'row',
  key: `card-${index}`,
  marginBottom: CARD_MARGIN_BOTTOM,
  paddingHorizontal: CARD_PADDING_HORIZONTAL,
  paddingVertical: CARD_PADDING_VERTICAL,
  children: [
    {
      borderRadius: ICON_CIRCLE_SIZE / 2,
      height: ICON_CIRCLE_SIZE,
      key: `icon-${index}`,
      width: ICON_CIRCLE_SIZE,
    },
    {
      flex: 1,
      key: `content-${index}`,
      marginLeft: CARD_GAP,
      children: [
        {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          key: `title-row-${index}`,
          children: [
            {
              borderRadius: 4,
              flex: 1,
              height: TITLE_HEIGHT,
              key: `title-${index}`,
              marginRight: ScaleSize(8),
            },
            {
              borderRadius: 4,
              height: DATE_HEIGHT,
              key: `date-${index}`,
              width: DATE_PLACEHOLDER_WIDTH,
            },
          ],
        },
        {
          borderRadius: 4,
          height: DESCRIPTION_HEIGHT,
          key: `description-${index}`,
          marginTop: ScaleSize(6),
          width: '85%',
        },
      ],
    },
  ],
});

const SKELETON_LAYOUT: ICustomViewStyle[] = Array.from(
  { length: SKELETON_CARD_COUNT },
  (_, index) => buildCardLayout(index),
);

function NotificationsLoading() {
  return (
      <Skeleton animationType="shiver" isLoading layout={SKELETON_LAYOUT} 
        containerStyle={styles.container}/>
  );
}

export default React.memo(NotificationsLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: LIST_PADDING_HORIZONTAL,
    paddingTop: LIST_PADDING_TOP,
  },
});
