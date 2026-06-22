import type { ICustomViewStyle } from 'react-native-reanimated-skeleton';

import Skeleton from 'react-native-reanimated-skeleton';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ScaleSize } from '@kits/core';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.5);
const BACK_BUTTON_SIZE = ScaleSize(40);
const CART_BUTTON_HEIGHT = ScaleSize(56);

// Hero + back button — these bones sit in the absolutely-positioned hero layer.
const HERO_LAYOUT: ICustomViewStyle[] = [
  {
    height: HERO_HEIGHT,
    key: 'hero',
    width: SCREEN_WIDTH,
  },
  {
    borderRadius: BACK_BUTTON_SIZE / 2,
    height: BACK_BUTTON_SIZE,
    key: 'back-button',
    left: ScaleSize(12),
    position: 'absolute',
    top: ScaleSize(48),
    width: BACK_BUTTON_SIZE,
  },
];

// Product info — name, description, price row.
const INFO_LAYOUT: ICustomViewStyle[] = [
  {
    borderRadius: 4,
    height: ScaleSize(26),
    key: 'name',
    marginTop: ScaleSize(20),
    width: '50%',
  },
  {
    borderRadius: 4,
    height: ScaleSize(13),
    key: 'desc-1',
    marginTop: ScaleSize(10),
    width: '90%',
  },
  {
    borderRadius: 4,
    height: ScaleSize(13),
    key: 'desc-2',
    marginTop: ScaleSize(6),
    width: '70%',
  },
  {
    children: [
      {
        borderRadius: 4,
        height: ScaleSize(16),
        key: 'price-label',
        width: '20%',
      },
      {
        borderRadius: 4,
        height: ScaleSize(16),
        key: 'price-value',
        width: '30%',
      },
    ],
    flexDirection: 'row',
    justifyContent: 'space-between',
    key: 'price-row',
    marginTop: ScaleSize(20),
    paddingBottom: ScaleSize(24),
    width: '100%',
  },
];

// Bottom sheet — label/value column on the left, cart button on the right.
const SHEET_LAYOUT: ICustomViewStyle[] = [
  {
    children: [
      {
        children: [
          {
            borderRadius: 4,
            height: ScaleSize(12),
            key: 'sheet-label-1',
            width: '70%',
          },
          {
            borderRadius: 4,
            height: ScaleSize(12),
            key: 'sheet-label-2',
            marginTop: ScaleSize(4),
            width: '45%',
          },
          {
            borderRadius: 4,
            height: ScaleSize(16),
            key: 'sheet-value',
            marginTop: ScaleSize(8),
            width: '50%',
          },
        ],
        flex: 1,
        key: 'sheet-info',
        paddingRight: ScaleSize(12),
      },
      {
        borderRadius: ScaleSize(12),
        height: CART_BUTTON_HEIGHT,
        key: 'cart-button',
        width: '55%',
      },
    ],
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
    key: 'sheet-row',
  },
];

function ProductDetailLoading() {
  return (
    <View style={styles.container} testID="product-detail-loading">
      {/* Hero pinned to the very top of the screen (no safe-area gap above). */}
      <View style={styles.heroLayer}>
        <Skeleton
          containerStyle={styles.container}
          animationType="shiver"
          isLoading
          layout={HERO_LAYOUT}
        />
      </View>

      {/* Middle info section — padded below the hero, grows to push the sheet down. */}
      <View style={styles.infoLayer}>
        <Skeleton
          containerStyle={styles.container}
          animationType="shiver"
          isLoading
          layout={INFO_LAYOUT}
        />
      </View>

      {/* Bottom sheet — sits at the bottom of the screen. */}
      <View style={styles.sheetLayer}>
        <Skeleton
          containerStyle={styles.container}
          animationType="shiver"
          isLoading
          layout={SHEET_LAYOUT}
        />
      </View>
    </View>
  );
}

export default ProductDetailLoading;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  heroLayer: {
    height: HERO_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  infoLayer: {
    flex: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: HERO_HEIGHT + ScaleSize(20),
  },
  sheetLayer: {
    paddingBottom: ScaleSize(80),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
});
