import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const HORIZONTAL_PADDING = ScaleSize(20);

const BANNER_HEIGHT = ScaleSize(32);
const BANNER_BG = '#FFE0E9';
const BANNER_BORDER = '#FFB6C1';

const DIVIDER_HEIGHT = 1;

const PARAGRAPH_HEIGHT = ScaleSize(13);
const HEADING_HEIGHT = ScaleSize(18);
const DATE_HEIGHT = ScaleSize(12);
const DATE_WIDTH = ScaleSize(60);

const SKELETON_BG = '#E5E5E5';
const SKELETON_HIGHLIGHT = '#F2F2F2';

// Pink event banner placeholder at top — emulates the "[EVENT] ..." highlight bar.
const BANNER_LAYOUT: ICustomViewStyle[] = [
  {
    backgroundColor: BANNER_BG,
    borderColor: BANNER_BORDER,
    borderRadius: ScaleSize(4),
    borderWidth: 1,
    height: BANNER_HEIGHT,
    key: 'event-banner',
    width: '100%',
  },
];

// Divider beneath the banner — a thin horizontal bar.
const DIVIDER_LAYOUT: ICustomViewStyle[] = [
  {
    backgroundColor: '#F0F0F0',
    height: DIVIDER_HEIGHT,
    key: 'divider',
    marginTop: ScaleSize(12),
    width: '100%',
  },
];

// Three lines of body text directly under the divider.
const BODY_INTRO_LAYOUT: ICustomViewStyle[] = [
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'intro-1',
    marginTop: ScaleSize(12),
    width: '100%',
  },
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'intro-2',
    marginTop: ScaleSize(8),
    width: '95%',
  },
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'intro-3',
    marginTop: ScaleSize(8),
    width: '78%',
  },
];

// Section heading with leading icon placeholder (e.g. ✅ 이벤트 안내).
const sectionHeading = (key: string): ICustomViewStyle => ({
  alignItems: 'center',
  flexDirection: 'row',
  gap: ScaleSize(6),
  key,
  marginTop: ScaleSize(20),
  width: '60%',
  children: [
    {
      borderRadius: 9,
      height: ScaleSize(18),
      key: `${key}-icon`,
      width: ScaleSize(18),
    },
    {
      borderRadius: 4,
      height: HEADING_HEIGHT,
      key: `${key}-label`,
      width: '70%',
    },
  ],
});

// Two bullet list items under the heading.
const bulletList = (key: string): ICustomViewStyle[] => [
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: `${key}-bullet-1`,
    marginTop: ScaleSize(8),
    width: '90%',
  },
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: `${key}-bullet-2`,
    marginTop: ScaleSize(6),
    width: '78%',
  },
];

// Four numbered list items (1–4) for "참여 방법".
const numberedList = (key: string): ICustomViewStyle[] =>
  [1, 2, 3, 4].map(index => ({
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: `${key}-num-${index}`,
    marginTop: ScaleSize(6),
    width: index === 4 ? '88%' : '82%',
  }));

// Trailing paragraphs after the numbered list.
const TRAILING_LAYOUT: ICustomViewStyle[] = [
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'trail-1',
    marginTop: ScaleSize(8),
    width: '92%',
  },
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'trail-2',
    marginTop: ScaleSize(6),
    width: '70%',
  },
  {
    borderRadius: 4,
    height: PARAGRAPH_HEIGHT,
    key: 'trail-3',
    marginTop: ScaleSize(6),
    width: '85%',
  },
];

// Date placeholder pinned to the bottom-right.
const DATE_LAYOUT: ICustomViewStyle[] = [
  {
    alignSelf: 'flex-end',
    borderRadius: 4,
    height: DATE_HEIGHT,
    key: 'date',
    marginTop: ScaleSize(24),
    width: DATE_WIDTH,
  },
];

const FULL_LAYOUT: ICustomViewStyle[] = [
  ...BANNER_LAYOUT,
  ...DIVIDER_LAYOUT,
  ...BODY_INTRO_LAYOUT,
  sectionHeading('section-1'),
  ...bulletList('section-1'),
  sectionHeading('section-2'),
  ...bulletList('section-2'),
  sectionHeading('section-3'),
  ...numberedList('section-3'),
  sectionHeading('section-4'),
  ...TRAILING_LAYOUT,
  ...DATE_LAYOUT,
];

function AnnouncementDetailLoading() {
  return (
    <View style={styles.container} testID="announcement-detail-loading">
      <Skeleton
        animationType="shiver"
        boneColor={SKELETON_BG}
        highlightColor={SKELETON_HIGHLIGHT}
        isLoading
        layout={FULL_LAYOUT}
      />
    </View>
  );
}

export default React.memo(AnnouncementDetailLoading);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: ScaleSize(12),
  },
});
