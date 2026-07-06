import type { CarouselRenderItem } from 'react-native-reanimated-carousel';
import type { AnnouncementImage } from '@hooks';

import { ProgressiveImage } from '@components';
import { ScaleSize } from '@kits/core';
import Carousel, {
  type ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef } from 'react';
import React from 'react';

import PaginationDots from './PaginationDots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNER_HORIZONTAL_PADDING = ScaleSize(16);
const BANNER_WIDTH = SCREEN_WIDTH - BANNER_HORIZONTAL_PADDING * 2;
const BANNER_HEIGHT = ScaleSize(220);

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_INACTIVE_COLOR = '#E0E0E0';
const DOT_ACTIVE_COLOR = '#54C158';
const DOT_GAP = ScaleSize(3);

type Properties = {
  readonly banners: readonly AnnouncementImage[];
  readonly onPressItem?: (item: AnnouncementImage) => void;
  readonly tabIndex: number;
};

function BannerCarousel({
  banners,
  onPressItem = undefined,
  tabIndex,
}: Properties) {
  const carouselReference = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  useEffect(() => {
    carouselReference.current?.scrollTo({ animated: true, index: 0 });
  }, [tabIndex]);

  const renderBanner: CarouselRenderItem<AnnouncementImage> = ({ item }) => (
    <View style={styles.bannerSlide} testID={`announcement-banner-${item.id}`}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.bannerSlide}
        onPress={() => onPressItem?.(item)}
      >
        <ProgressiveImage
          height={BANNER_HEIGHT}
          url={item.image?.fileUrl}
          resizeMode="stretch"
          width={BANNER_WIDTH}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.bannerContainer}>
      <Carousel
        ref={carouselReference}
        autoPlay={banners?.length > 1}
        data={banners as AnnouncementImage[]}
        height={BANNER_HEIGHT}
        loop
        pagingEnabled
        renderItem={renderBanner}
        style={styles.bannerWrap}
        testID="announcement-carousel"
        width={BANNER_WIDTH}
        onProgressChange={progress}
      />
      <PaginationDots
        activeColor={DOT_ACTIVE_COLOR}
        activeWidth={DOT_ACTIVE_WIDTH}
        count={banners?.length || 0}
        gap={DOT_GAP}
        inactiveColor={DOT_INACTIVE_COLOR}
        progress={progress}
        size={DOT_SIZE}
        style={{
          bottom: ScaleSize(-20),
        }}
      />
    </View>
  );
}

export default React.memo(BannerCarousel);

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: ScaleSize(40),
  },
  bannerSlide: {
    borderRadius: ScaleSize(14),
    height: BANNER_HEIGHT,
    marginRight: 0,
    overflow: 'hidden',
    width: BANNER_WIDTH,
  },
  bannerWrap: {
    alignItems: 'center',
  },
});
