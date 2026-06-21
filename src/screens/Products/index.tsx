import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';
import type { Product } from '@hooks';

import { ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import { Animated, Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlatList } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useProducts } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';

import HeroHeader from './HeroHeader';
import ItemSeparator from './ItemSeparator';
import ListEmpty from './ListEmpty';
import ProductRow from './ProductRow';
import StoreInfo from './StoreInfo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = ScaleSize(220);
const COLLAPSE_TITLE_START = 0.8;
const DIVIDER_COLOR = '#F0F0F0';

const keyExtractor = (item: Product) => String(item.id);
const onPressBack = () => {
  AppNavigator.goBack();
};
function Products(props: RootScreenProps<Paths.Products>) {
  const insets = useSafeAreaInsets();
  const { data, storeInfo, loading, onLoadMore, onSearchChange } = useProducts(props);
  const scrollY = React.useMemo(() => new Animated.Value(0), []);
  const flatListRef = useRef<FlatList>(null);
  const savedScrollOffset = useRef(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  // isSearchActive is intentionally unused at render time — it
  // exists solely to trigger a re-render so the onScroll closure
  // captures the correct value when search opens/closes.
  void isSearchActive;
  const HERO_COLLAPSED_HEIGHT = useMemo(() => {
    return ScaleSize(54) + insets.top;
  }, [insets.top]);

  const collapseScroll = HERO_HEIGHT - HERO_COLLAPSED_HEIGHT;

  const heroHeight = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [0, collapseScroll],
        outputRange: [HERO_HEIGHT, HERO_COLLAPSED_HEIGHT],
      }),
    [scrollY, collapseScroll],
  );

  const backButtonTop = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [0, collapseScroll],
        outputRange: [insets.top + ScaleSize(8), insets.top + ScaleSize(7)],
      }),
    [scrollY, collapseScroll, insets.top],
  );

  const titleHeaderOpacity = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [0, 1],
      }),
    [scrollY, collapseScroll],
  );

  const titleStoreOpacity = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [1, 0],
      }),
    [scrollY, collapseScroll],
  );

  const titleTranslateY = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [ScaleSize(48), 0],
      }),
    [scrollY, collapseScroll],
  );

  const headerOverlayOpacity = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [0, 1],
      }),
    [scrollY, collapseScroll],
  );

  const iconLightOpacity = useMemo(
    () =>
      scrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [1, 0],
      }),
    [scrollY, collapseScroll],
  );
  const onPressProduct = React.useMemo(
    () => (item: any) => {
      AppNavigator.navigate(Paths.ProductDetail, {
        banner: storeInfo?.banner,
        id: item?.id,
        storeId: storeInfo?.id,
      });
    },
    [],
  );

  const renderItem = React.useMemo(
    (): ListRenderItem<Product> =>
      function renderItem({ item }) {
        return <ProductRow item={item} onPress={onPressProduct} />;
      },
    [onPressProduct],
  );

  // Track the latest scroll position via a dedicated listener so
  // savedScrollOffset is captured SYNCHRONOUSLY in handleSearchOpen,
  // avoiding any race with the FlatList's onScroll listener closure.
  const currentScrollOffset = useRef(0);
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      currentScrollOffset.current = value;
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY]);

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false },
      ),
    [scrollY],
  );

  const handleSearchOpen = useCallback(() => {
    // Capture the pre-search scroll position synchronously, BEFORE
    // any state change that could trigger a FlatList auto-scroll.
    savedScrollOffset.current = currentScrollOffset.current;
    setIsSearchActive(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    const offset = savedScrollOffset.current;

    const restore = () => {
      scrollY.setValue(offset);
      flatListRef.current?.scrollToOffset({ offset, animated: false });
    };

    // Restore the scroll position immediately when search closes.
    // HeroHeader calls this BEFORE the close animation starts so the
    // banner expands synchronously with the search bar collapsing.
    restore();
    setIsSearchActive(false);

    // Safety net: iOS may auto-scroll the FlatList back to keep the
    // TextInput visible above the keyboard as it dismisses. Re-apply
    // the saved offset once the keyboard is fully hidden.
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      sub.remove();
      restore();
    });
    setTimeout(() => {
      sub.remove();
    }, 1500);
  }, [scrollY]);

  return (
    <View style={styles.safeArea}>
      <HeroHeader
        backButtonTop={backButtonTop}
        banner={storeInfo?.banner}
        headerOverlayOpacity={headerOverlayOpacity}
        heroHeight={heroHeight}
        iconLightOpacity={iconLightOpacity}
        onPressBack={onPressBack}
        onSearchClose={handleSearchClose}
        onSearchOpen={handleSearchOpen}
        onSearchChange={onSearchChange}
        storeName={storeInfo?.name}
        titleOpacity={titleHeaderOpacity}
        titleTranslateY={titleTranslateY}
      />
      {loading ? (
        <ProductsLoading />
      ) : (
        <Animated.FlatList
          ref={flatListRef}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={<ListEmpty loading={loading} />}
          ListHeaderComponent={
            <View>
              <StoreInfo
                storeInfo={storeInfo}
                titleOpacity={titleStoreOpacity}
              />
              {/* <View style={styles.headerDivider} /> */}
            </View>
          }
          automaticallyAdjustKeyboardInsets={false}
          contentContainerStyle={styles.listContent}
          contentInset={{ bottom: 0 }}
          data={data}
          keyExtractor={keyExtractor}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onEndReached={onLoadMore}
          onEndReachedThreshold={1.5}
          onScroll={onScroll}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}
    </View>
  );
}

export default Products;

const styles = StyleSheet.create({
  headerDivider: {
    backgroundColor: DIVIDER_COLOR,
    height: ScaleSize(8),
    marginTop: ScaleSize(16),
    width: SCREEN_WIDTH,
  },
  list: {
    flex: 1,
    zIndex: 1,
  },
  listContent: {
    backgroundColor: 'transparent',
    paddingBottom: ScaleSize(48),
    paddingTop: HERO_HEIGHT,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});
