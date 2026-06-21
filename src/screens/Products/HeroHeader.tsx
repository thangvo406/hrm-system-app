import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { IImage } from '@type';
import debounce from 'lodash/debounce';

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

type HeaderIconProps = {
  readonly grayOpacity: Animated.AnimatedInterpolation<number>;
  readonly lightOpacity: Animated.AnimatedInterpolation<number>;
  readonly name: 'ic_chevron_right' | 'ic_search';
  readonly rotate?: boolean;
};

function HeaderIcon({
  grayOpacity,
  lightOpacity,
  name,
  rotate = false,
}: HeaderIconProps) {
  const iconStyle = rotate ? styles.backIcon : undefined;

  return (
    <View style={styles.iconStack}>
      <Animated.View style={[styles.iconLayer, styles.borderRounded, { opacity: lightOpacity }]}>
        <Image
          color={ICON_LIGHT}
          height={BACK_ICON_SIZE}
          name={name}
          style={iconStyle}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </Animated.View>
      <Animated.View style={[styles.iconLayer, { opacity: grayOpacity }]}>
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
  readonly backButtonTop: Animated.AnimatedInterpolation<number>;
  readonly banner?: IImage;
  readonly headerOverlayOpacity: Animated.AnimatedInterpolation<number>;
  readonly heroHeight: Animated.AnimatedInterpolation<number>;
  readonly iconLightOpacity: Animated.AnimatedInterpolation<number>;
  readonly onPressBack: () => void;
  readonly onSearchClose?: () => void;
  readonly onSearchOpen?: () => void;
  readonly storeName?: string;
  readonly titleOpacity: Animated.AnimatedInterpolation<number>;
  readonly titleTranslateY: Animated.AnimatedInterpolation<number>;
};

function HeroHeader({
  banner = undefined,
  backButtonTop,
  headerOverlayOpacity,
  heroHeight,
  iconLightOpacity,
  onPressBack,
  onSearchClose,
  onSearchOpen,
  onSearchChange,
  storeName = '',
  titleOpacity,
  titleTranslateY,
}: Properties) {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchExpand = useMemo(() => new Animated.Value(0), []);
  const searchInputRef = useRef<TextInput>(null);

  const searchBarTranslateX = searchExpand.interpolate({
    inputRange: [0, 1],
    outputRange: [SEARCH_BAR_EXPANDED_WIDTH, 0],
  });

  const searchBarOpacity = searchExpand.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0, 1, 1],
  });

  const searchInputOpacity = searchExpand.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  const handleToggleSearch = useCallback(() => {
    const nextOpen = !isSearchOpen;

    if (nextOpen) {
      // Save scroll position before keyboard appears
      onSearchOpen?.();
    } else {
      // Dismiss keyboard immediately before animation to prevent
      // scroll offset desync between native contentOffset and scrollY
      Keyboard.dismiss();
    }

    setIsSearchOpen(nextOpen);

    Animated.timing(searchExpand, {
      duration: SEARCH_EXPAND_DURATION,
      easing: Easing.out(Easing.ease),
      toValue: nextOpen ? 1 : 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && nextOpen) {
        searchInputRef.current?.focus();
      }
      if (finished && !nextOpen) {
        onSearchClose?.();
      }
    });
  }, [isSearchOpen, searchExpand, onSearchClose, onSearchOpen]);

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.heroBanner, { height: heroHeight }]}
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
            style={[styles.headerOverlay, { opacity: headerOverlayOpacity }]}
          />
        </View>
      </Animated.View>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.heroControls, { height: heroHeight }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.controlsBackground,
            { opacity: headerOverlayOpacity },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.headerBottomShadow,
            { opacity: headerOverlayOpacity },
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
            end={{ x: 0, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.headerBottomShadowGradient}
          />
        </Animated.View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressBack}
          style={[styles.backButton, { top: backButtonTop }]}
          testID="products-back"
        >
          <HeaderIcon
            grayOpacity={headerOverlayOpacity}
            lightOpacity={iconLightOpacity}
            name="ic_chevron_right"
            rotate
          />
        </TouchableOpacity>
        {!isSearchOpen ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.titleWrap,
              {
                opacity: titleOpacity,
                top: backButtonTop,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            <Animated.Text numberOfLines={1} style={styles.collapsedTitle}>
              {storeName}
            </Animated.Text>
          </Animated.View>
        ) : undefined}
        <Animated.View
          pointerEvents={isSearchOpen ? 'auto' : 'none'}
          style={[
            styles.searchBar,
            {
              opacity: searchBarOpacity,
              top: backButtonTop,
              transform: [{ translateX: searchBarTranslateX }],
            },
          ]}
        >
          <Animated.View
            style={[styles.searchInputWrap, { opacity: searchInputOpacity }]}
          >
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
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleToggleSearch}
          style={[styles.searchIconButton, { top: backButtonTop }]}
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
              grayOpacity={headerOverlayOpacity}
              lightOpacity={iconLightOpacity}
              name="ic_search"
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    alignItems: 'center',
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
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
