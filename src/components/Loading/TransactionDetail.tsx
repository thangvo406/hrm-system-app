import type { ISkeletonProps } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';
import React from 'react';

/**
 * A single node of the skeleton tree: a styled container when it has
 * `children`, an animated bone when it doesn't.
 */
type SkeletonNode = NonNullable<ISkeletonProps['layout']>[number];

const BONE_RADIUS = ScaleSize(4);
const CARD_BG = Colors.white;
const CARD_GAP = ScaleSize(16);
const CARD_MARGIN_HORIZONTAL = ScaleSize(16);
const CARD_PADDING = ScaleSize(16);
const CARD_RADIUS = ScaleSize(16);
const HERO_BG = Colors.green07;
const HERO_ICON_SIZE = ScaleSize(56);
const POINT_BADGE_SIZE = ScaleSize(30);
const POINT_ROW_COUNT = 2;
const SECTION_ICON_SIZE = ScaleSize(36);

const buildCard = (
  key: string,
  children: SkeletonNode[],
  backgroundColor: string = CARD_BG,
): SkeletonNode => ({
  backgroundColor,
  borderRadius: CARD_RADIUS,
  children,
  key,
  marginBottom: CARD_GAP,
  marginHorizontal: CARD_MARGIN_HORIZONTAL,
  padding: CARD_PADDING,
});

// Circle icon + section title, mirroring `SectionCard`'s header.
const buildSectionHeader = (key: string): SkeletonNode => ({
  alignItems: 'center',
  children: [
    {
      borderRadius: SECTION_ICON_SIZE / 2,
      height: SECTION_ICON_SIZE,
      key: `${key}-icon`,
      width: SECTION_ICON_SIZE,
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(16),
      key: `${key}-title`,
      marginLeft: ScaleSize(10),
      width: ScaleSize(120),
    },
  ],
  flexDirection: 'row',
  key,
  marginBottom: ScaleSize(12),
});

const buildDivider = (key: string): SkeletonNode => ({
  height: 1,
  key,
  marginVertical: ScaleSize(8),
  width: '100%',
});

// Label (+ optional caption) on the left, amount on the right.
const buildAmountRow = (
  key: string,
  options?: {
    readonly hasCaption?: boolean;
    readonly labelWidth?: SkeletonNode['width'];
    readonly valueWidth?: SkeletonNode['width'];
  },
): SkeletonNode => ({
  children: [
    {
      children: [
        {
          borderRadius: BONE_RADIUS,
          height: ScaleSize(14),
          key: `${key}-label`,
          width: options?.labelWidth ?? ScaleSize(104),
        },
        ...(options?.hasCaption
          ? [
              {
                borderRadius: BONE_RADIUS,
                height: ScaleSize(11),
                key: `${key}-caption`,
                marginTop: ScaleSize(6),
                width: ScaleSize(72),
              },
            ]
          : []),
      ],
      flex: 1,
      key: `${key}-label-col`,
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(14),
      key: `${key}-value`,
      marginLeft: ScaleSize(12),
      width: options?.valueWidth ?? ScaleSize(80),
    },
  ],
  flexDirection: 'row',
  key,
  paddingVertical: ScaleSize(12),
});

// Badge + label + amount, mirroring `PointRow`.
const buildPointRow = (index: number): SkeletonNode => ({
  alignItems: 'center',
  children: [
    {
      borderRadius: POINT_BADGE_SIZE / 2,
      height: POINT_BADGE_SIZE,
      key: `point-badge-${index}`,
      marginRight: ScaleSize(12),
      width: POINT_BADGE_SIZE,
    },
    {
      borderRadius: BONE_RADIUS,
      flex: 1,
      height: ScaleSize(14),
      key: `point-label-${index}`,
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(15),
      key: `point-value-${index}`,
      marginLeft: ScaleSize(12),
      width: ScaleSize(72),
    },
  ],
  flexDirection: 'row',
  key: `point-row-${index}`,
  paddingVertical: ScaleSize(10),
});

const HERO_CARD = buildCard(
  'hero-card',
  [
    {
      alignItems: 'center',
      children: [
        {
          borderRadius: HERO_ICON_SIZE / 2,
          height: HERO_ICON_SIZE,
          key: 'hero-icon',
          marginRight: ScaleSize(14),
          width: HERO_ICON_SIZE,
        },
        {
          children: [
            {
              borderRadius: BONE_RADIUS,
              height: ScaleSize(18),
              key: 'hero-title',
              width: '80%',
            },
            {
              borderRadius: BONE_RADIUS,
              height: ScaleSize(13),
              key: 'hero-date',
              marginTop: ScaleSize(8),
              width: '62%',
            },
          ],
          flex: 1,
          key: 'hero-meta',
        },
      ],
      flexDirection: 'row',
      key: 'hero-row',
    },
  ],
  HERO_BG,
);

const SUMMARY_CARD = buildCard('summary-card', [
  buildSectionHeader('summary-header'),
  buildAmountRow('summary-amount', {
    labelWidth: ScaleSize(120),
    valueWidth: ScaleSize(88),
  }),
  buildDivider('summary-divider'),
  buildAmountRow('summary-coupon', { hasCaption: true }),
  buildAmountRow('summary-point-used'),
  buildDivider('summary-dashed'),
  buildAmountRow('summary-final', {
    labelWidth: ScaleSize(128),
    valueWidth: ScaleSize(88),
  }),
  buildAmountRow('summary-pay-money'),
]);

const POINT_CARD = buildCard('point-card', [
  buildSectionHeader('point-header'),
  ...Array.from({ length: POINT_ROW_COUNT }, (_, index) =>
    buildPointRow(index),
  ),
]);

const SKELETON_LAYOUT: SkeletonNode[] = [HERO_CARD, SUMMARY_CARD, POINT_CARD];

function TransactionDetailLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(TransactionDetailLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ScaleSize(12),
  },
});
