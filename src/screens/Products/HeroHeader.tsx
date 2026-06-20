import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { IImage } from '@type';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_HEIGHT = ScaleSize(280);
const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly backButtonTop: Animated.AnimatedInterpolation<number>;
  readonly heroHeight: Animated.AnimatedInterpolation<number>;
  readonly onPressBack: () => void;
  readonly banner?: IImage,
};

function HeroHeader({ banner = undefined, backButtonTop, heroHeight, onPressBack }: Properties) {
  return (
    <Animated.View style={[styles.heroWrap, { height: heroHeight }]}>
      <Image
        height={HERO_HEIGHT}
        name="img_header_products_default"
        resizeMode="cover"
        url={banner?.fileUrl}
        style={styles.heroImage}
        width={SCREEN_WIDTH}
      />
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressBack}
        style={[styles.backButton, { top: backButtonTop }]}
        testID="products-back"
      >
        <Image
          color="#FFFFFF"
          height={BACK_ICON_SIZE}
          name="ic_chevron_right"
          style={styles.backIcon}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(HeroHeader);

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    left: ScaleSize(12),
    position: 'absolute',
    width: BACK_BUTTON_SIZE,
    zIndex: 2,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  heroImage: {
    height: HERO_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
  },
  heroWrap: {
    backgroundColor: '#FFFFFF',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
