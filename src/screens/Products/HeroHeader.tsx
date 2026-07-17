import type { IImage } from '@type';
import type { SharedValue } from 'react-native-reanimated';

import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import React, { useCallback, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import debounce from 'lodash/debounce';
import { NOOP } from '@utils/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = ScaleSize(220);
const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const TITLE_LEFT = ScaleSize(12) + BACK_BUTTON_SIZE + ScaleSize(8);
const TEXT_DARK = '#1A1A1A';
const ICON_LIGHT = '#FFFFFF';
const ICON_GRAY = Colors.gray1;
const BOTTOM_SHADOW_HEIGHT = ScaleSize(10);
const SEARCH_HORIZONTAL_INSET = ScaleSize(12);
const SEARCH_BAR_EXPANDED_WIDTH = SCREEN_WIDTH - SEARCH_HORIZONTAL_INSET * 2;
const SEARCH_EXPAND_DURATION = 250;
const PLACEHOLDER_COLOR = '#9E9E9E';
const BANNER_OVERLAY_COLORS = ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)'];
const COLLAPSE_TITLE_START = 0.8;
const BACK_TOP_EXPANDED = ScaleSize(8);
const BACK_TOP_COLLAPSED = ScaleSize(7);
const TITLE_TRANSLATE_FROM = ScaleSize(48);

// Shared interpolation helpers (worklets) so every header layer reads the
// same collapse timing from the frozen scroll value.
const collapseRange = (
  value: number,
  collapseScroll: number,
  outputRange: readonly [number, number],
) => {
  'worklet';
  return interpolate(
    value,
    [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange,
    Extrapolation.CLAMP,
  );
};

const controlTop = (
  value: number,
  collapseScroll: number,
  topInset: number,
) => {
  'worklet';
  return interpolate(
    value,
    [0, collapseScroll],
    [topInset + BACK_TOP_EXPANDED, topInset + BACK_TOP_COLLAPSED],
    Extrapolation.CLAMP,
  );
};

type HeaderIconProps = {
  readonly collapseScroll: number;
  readonly name: 'ic_chevron_right' | 'ic_search';
  readonly rotate?: boolean;
  readonly scrollY: SharedValue<number>;
};

function HeaderIcon({
  collapseScroll,
  name,
  rotate = false,
  scrollY,
}: HeaderIconProps) {
  const iconStyle = rotate ? styles.backIcon : undefined;

  const lightLayerStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [1, 0]),
  }));

  const grayLayerStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [0, 1]),
  }));

  return (
    <View style={styles.iconStack}>
      <Animated.View
        style={[styles.iconLayer, styles.borderRounded, lightLayerStyle]}
      >
        <Image
          color={ICON_LIGHT}
          height={BACK_ICON_SIZE}
          name={name}
          style={iconStyle}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </Animated.View>
      <Animated.View style={[styles.iconLayer, grayLayerStyle]}>
        <Image
          color={ICON_GRAY}
          height={BACK_ICON_SIZE}
          name={name}
          style={iconStyle}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </Animated.View>
    </View>
  );
}

type Properties = {
  readonly banner?: IImage;
  readonly collapseScroll: number;
  readonly onPressBack: () => void;
  readonly onSearchChange?: (text: string) => void;
  readonly onSearchClose?: () => void;
  readonly onSearchOpen?: () => void;
  readonly scrollY: SharedValue<number>;
  readonly storeName?: string;
};

function HeroHeader({
  banner = undefined,
  collapseScroll,
  onPressBack,
  onSearchChange = NOOP,
  onSearchClose = undefined,
  onSearchOpen = undefined,
  scrollY,
  storeName = '',
}: Properties) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchExpand = useSharedValue(0);
  const searchInputRef = useRef<TextInput>(null);
  const topInset = insets.top;

  const heroBannerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, collapseScroll],
      [HERO_HEIGHT, HERO_HEIGHT - collapseScroll],
      Extrapolation.CLAMP,
    ),
  }));

  const heroControlsStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, collapseScroll],
      [HERO_HEIGHT, HERO_HEIGHT - collapseScroll],
      Extrapolation.CLAMP,
    ),
  }));

  const headerOverlayStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [0, 1]),
  }));

  const controlsBackgroundStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [0, 1]),
  }));

  const bottomShadowStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [0, 1]),
  }));

  const backButtonStyle = useAnimatedStyle(() => ({
    top: controlTop(scrollY.value, collapseScroll, topInset),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: collapseRange(scrollY.value, collapseScroll, [0, 1]),
    top: controlTop(scrollY.value, collapseScroll, topInset),
    transform: [
      {
        translateY: collapseRange(scrollY.value, collapseScroll, [
          TITLE_TRANSLATE_FROM,
          0,
        ]),
      },
    ],
  }));

  const searchBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(searchExpand.value, [0, 0.15, 1], [0, 1, 1]),
    top: controlTop(scrollY.value, collapseScroll, topInset),
    transform: [
      {
        translateX: interpolate(
          searchExpand.value,
          [0, 1],
          [SEARCH_BAR_EXPANDED_WIDTH, 0],
        ),
      },
    ],
  }));

  const searchInputStyle = useAnimatedStyle(() => ({
    opacity: interpolate(searchExpand.value, [0, 0.6, 1], [0, 0, 1]),
  }));

  const searchButtonStyle = useAnimatedStyle(() => ({
    top: controlTop(scrollY.value, collapseScroll, topInset),
  }));

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleToggleSearch = useCallback(() => {
    const nextOpen = !isSearchOpen;

    if (nextOpen) {
      // Freeze the hero header before the keyboard appears
      onSearchOpen?.();
    } else {
      onSearchClose?.();
      Keyboard.dismiss();
    }

    setIsSearchOpen(nextOpen);

    searchExpand.set(
      withTiming(
        nextOpen ? 1 : 0,
        { duration: SEARCH_EXPAND_DURATION, easing: Easing.out(Easing.ease) },
        finished => {
          if (finished && nextOpen) {
            scheduleOnRN(focusSearchInput);
          }
        },
      ),
    );
  }, [focusSearchInput, isSearchOpen, onSearchClose, onSearchOpen, searchExpand]);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.heroBanner, heroBannerStyle]}
      >
        <View style={styles.heroClip}>
          <Image
            height={HERO_HEIGHT}
            name="img_header_products_default"
            resizeMode="cover"
            url={banner?.fileUrl}
            style={styles.heroImage}
            width={SCREEN_WIDTH}
          />
          <View pointerEvents="none" style={styles.bannerOverlay}>
            <LinearGradient
              colors={BANNER_OVERLAY_COLORS}
              end={{ x: 0, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.bannerOverlayGradient}
            />
          </View>
          <Animated.View
            pointerEvents="none"
            style={[styles.headerOverlay, headerOverlayStyle]}
          />
        </View>
      </Animated.View>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.heroControls, heroControlsStyle]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.controlsBackground, controlsBackgroundStyle]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.headerBottomShadow, bottomShadowStyle]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
            end={{ x: 0, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.headerBottomShadowGradient}
          />
        </Animated.View>
        <Animated.View style={[styles.backButton, backButtonStyle]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPressBack}
            style={styles.controlTouchable}
            testID="products-back"
          >
            <HeaderIcon
              collapseScroll={collapseScroll}
              name="ic_chevron_right"
              rotate
              scrollY={scrollY}
            />
          </TouchableOpacity>
        </Animated.View>
        {!isSearchOpen ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.titleWrap, titleStyle]}
          >
            <Text numberOfLines={1} style={styles.collapsedTitle}>
              {storeName}
            </Text>
          </Animated.View>
        ) : undefined}
        <Animated.View
          pointerEvents={isSearchOpen ? 'auto' : 'none'}
          style={[styles.searchBar, searchBarStyle]}
        >
          <Animated.View style={[styles.searchInputWrap, searchInputStyle]}>
            <TextInput
              placeholder={t('stores.search_placeholder')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              ref={searchInputRef}
              onChangeText={debounce(onSearchChange, 400)}
              style={styles.searchInput}
              testID="products-search-input"
            />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.searchIconButton, searchButtonStyle]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleToggleSearch}
            style={styles.controlTouchable}
            testID="products-search"
          >
            {isSearchOpen ? (
              <Image
                color={ICON_GRAY}
                height={BACK_ICON_SIZE}
                name="x-circle"
                type="svg"
                width={BACK_ICON_SIZE}
              />
            ) : (
              <HeaderIcon
                collapseScroll={collapseScroll}
                name="ic_search"
                scrollY={scrollY}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </>
  );
}

export default React.memo(HeroHeader);

const styles = StyleSheet.create({
  backButton: {
    height: BACK_BUTTON_SIZE,
    left: ScaleSize(12),
    position: 'absolute',
    width: BACK_BUTTON_SIZE,
    zIndex: 2,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: HERO_HEIGHT,
    zIndex: 0,
  },
  bannerOverlayGradient: {
    flex: 1,
  },
  collapsedTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(17),
    fontWeight: '700',
  },
  controlTouchable: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  controlsBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 0,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  headerBottomShadow: {
    bottom: -BOTTOM_SHADOW_HEIGHT,
    height: BOTTOM_SHADOW_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  headerBottomShadowGradient: {
    flex: 1,
  },
  heroClip: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  heroBanner: {
    backgroundColor: '#FFFFFF',
    left: 0,
    overflow: 'visible',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  heroControls: {
    left: 0,
    overflow: 'visible',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 3,
  },
  heroImage: {
    height: HERO_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
  },
  borderRounded: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: BACK_BUTTON_SIZE / 2,
    padding: ScaleSize(16),
  },
  iconLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStack: {
    height: BACK_ICON_SIZE,
    width: BACK_ICON_SIZE,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    borderRadius: BACK_BUTTON_SIZE / 2,
    borderWidth: 1,
    flexDirection: 'row',
    height: BACK_BUTTON_SIZE,
    overflow: 'hidden',
    position: 'absolute',
    right: SEARCH_HORIZONTAL_INSET,
    width: SEARCH_BAR_EXPANDED_WIDTH,
    zIndex: 4,
  },
  searchIconButton: {
    height: BACK_BUTTON_SIZE,
    position: 'absolute',
    right: SEARCH_HORIZONTAL_INSET,
    width: BACK_BUTTON_SIZE,
    zIndex: 5,
  },
  searchInput: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(15),
    paddingVertical: 0,
  },
  searchInputWrap: {
    flex: 1,
    paddingLeft: ScaleSize(14),
  },
  titleWrap: {
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    left: TITLE_LEFT,
    position: 'absolute',
    right: ScaleSize(16),
    zIndex: 2,
  },
});
