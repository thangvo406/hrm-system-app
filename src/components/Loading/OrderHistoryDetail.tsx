import type { ISkeletonProps } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { ScaleSize } from '@kits/core';
import { StyleSheet } from 'react-native';
import React from 'react';

/**
 * A single node of the skeleton tree: a styled container when it has
 * `children`, an animated bone when it doesn't.
 */
type SkeletonNode = NonNullable<ISkeletonProps['layout']>[number];

const BONE_RADIUS = ScaleSize(4);
const CARD_BG = '#FFFFFF';
const CARD_GAP = ScaleSize(10);
const CARD_MARGIN_HORIZONTAL = ScaleSize(12);
const CARD_PADDING = ScaleSize(16);
const CARD_RADIUS = ScaleSize(12);
const INFO_ROW_COUNT = 3;
const PRODUCT_ROW_COUNT = 3;
const SECTION_ICON_SIZE = ScaleSize(40);
const SUMMARY_ICON_SIZE = ScaleSize(48);
const THUMB_SIZE = ScaleSize(64);

const buildCard = (key: string, children: SkeletonNode[]): SkeletonNode => ({
  backgroundColor: CARD_BG,
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
      width: ScaleSize(96),
    },
  ],
  flexDirection: 'row',
  key,
  marginBottom: ScaleSize(14),
});

const buildDivider = (key: string): SkeletonNode => ({
  height: 1,
  key,
  width: '100%',
});

// Stacked label + value, used by the delivery address / shipping method blocks.
const buildFieldBlock = (
  key: string,
  valueWidth: SkeletonNode['width'],
): SkeletonNode => ({
  children: [
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(12),
      key: `${key}-label`,
      width: ScaleSize(64),
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(15),
      key: `${key}-value`,
      marginTop: ScaleSize(6),
      width: valueWidth,
    },
  ],
  key,
  paddingVertical: ScaleSize(10),
});

const buildProductRow = (index: number): SkeletonNode => ({
  alignItems: 'flex-start',
  children: [
    {
      borderRadius: ScaleSize(8),
      height: THUMB_SIZE,
      key: `product-thumb-${index}`,
      width: THUMB_SIZE,
    },
    {
      children: [
        {
          borderRadius: BONE_RADIUS,
          height: ScaleSize(15),
          key: `product-name-${index}`,
          width: '70%',
        },
        {
          borderRadius: BONE_RADIUS,
          height: ScaleSize(12),
          key: `product-qty-${index}`,
          marginTop: ScaleSize(8),
          width: ScaleSize(28),
        },
      ],
      flex: 1,
      key: `product-meta-${index}`,
      marginLeft: ScaleSize(10),
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(15),
      key: `product-price-${index}`,
      marginLeft: ScaleSize(8),
      width: ScaleSize(56),
    },
  ],
  flexDirection: 'row',
  key: `product-row-${index}`,
  paddingVertical: ScaleSize(10),
});

const buildInfoRow = (index: number): SkeletonNode => ({
  children: [
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(12),
      key: `info-label-${index}`,
      width: ScaleSize(72),
    },
    {
      borderRadius: BONE_RADIUS,
      height: ScaleSize(14),
      key: `info-value-${index}`,
      width: ScaleSize(88),
    },
  ],
  flexDirection: 'row',
  justifyContent: 'space-between',
  key: `info-row-${index}`,
  paddingVertical: ScaleSize(10),
});

// Order code + status badge + total, mirroring the summary card.
const SUMMARY_CARD = buildCard('summary-card', [
  {
    children: [
      {
        borderRadius: SUMMARY_ICON_SIZE / 2,
        height: SUMMARY_ICON_SIZE,
        key: 'summary-icon',
        marginRight: ScaleSize(12),
        width: SUMMARY_ICON_SIZE,
      },
      {
        children: [
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(12),
            key: 'summary-code-label',
            width: ScaleSize(60),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(18),
            key: 'summary-code',
            marginTop: ScaleSize(6),
            width: '72%',
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(12),
            key: 'summary-time',
            marginTop: ScaleSize(8),
            width: '58%',
          },
        ],
        flex: 1,
        key: 'summary-meta',
      },
      {
        alignItems: 'flex-end',
        children: [
          {
            borderRadius: ScaleSize(20),
            height: ScaleSize(24),
            key: 'summary-status',
            marginBottom: ScaleSize(10),
            width: ScaleSize(76),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(12),
            key: 'summary-total-label',
            width: ScaleSize(40),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(22),
            key: 'summary-total',
            marginTop: ScaleSize(6),
            width: ScaleSize(88),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(11),
            key: 'summary-method',
            marginTop: ScaleSize(6),
            width: ScaleSize(64),
          },
        ],
        key: 'summary-right',
        marginLeft: ScaleSize(8),
      },
    ],
    flexDirection: 'row',
    key: 'summary-row',
  },
]);

const DELIVERY_CARD = buildCard('delivery-card', [
  buildSectionHeader('delivery-header'),
  {
    alignItems: 'center',
    children: [
      {
        children: [
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(12),
            key: 'recipient-label',
            width: ScaleSize(48),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(17),
            key: 'recipient-name',
            marginTop: ScaleSize(6),
            width: ScaleSize(88),
          },
        ],
        key: 'recipient',
      },
      {
        alignItems: 'center',
        children: [
          {
            borderRadius: ScaleSize(8),
            height: ScaleSize(16),
            key: 'phone-icon',
            width: ScaleSize(16),
          },
          {
            borderRadius: BONE_RADIUS,
            height: ScaleSize(14),
            key: 'phone-number',
            marginLeft: ScaleSize(6),
            width: ScaleSize(120),
          },
        ],
        flexDirection: 'row',
        key: 'phone-row',
      },
    ],
    flexDirection: 'row',
    justifyContent: 'space-between',
    key: 'recipient-row',
    paddingBottom: ScaleSize(10),
  },
  buildDivider('delivery-divider-1'),
  buildFieldBlock('delivery-address', '45%'),
  buildDivider('delivery-divider-2'),
  buildFieldBlock('delivery-method', ScaleSize(64)),
]);

const PRODUCTS_CARD = buildCard('products-card', [
  buildSectionHeader('products-header'),
  ...Array.from({ length: PRODUCT_ROW_COUNT }, (_, index) =>
    buildProductRow(index),
  ),
]);

const PAYMENT_CARD = buildCard('payment-card', [
  buildSectionHeader('payment-header'),
  ...Array.from({ length: INFO_ROW_COUNT }, (_, index) => buildInfoRow(index)),
  buildDivider('payment-divider'),
  {
    children: [
      {
        borderRadius: BONE_RADIUS,
        height: ScaleSize(16),
        key: 'payment-total-label',
        width: ScaleSize(60),
      },
      {
        borderRadius: BONE_RADIUS,
        height: ScaleSize(18),
        key: 'payment-total-amount',
        width: ScaleSize(96),
      },
    ],
    flexDirection: 'row',
    justifyContent: 'space-between',
    key: 'payment-total-row',
    paddingTop: ScaleSize(12),
  },
]);

const SKELETON_LAYOUT: SkeletonNode[] = [
  SUMMARY_CARD,
  DELIVERY_CARD,
  PRODUCTS_CARD,
  PAYMENT_CARD,
];

function OrderHistoryDetailLoading() {
  return (
    <Skeleton
      animationType="shiver"
      containerStyle={styles.container}
      isLoading
      layout={SKELETON_LAYOUT}
    />
  );
}

export default React.memo(OrderHistoryDetailLoading);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ScaleSize(10),
  },
});
