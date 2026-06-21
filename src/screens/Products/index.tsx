import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';
import type { Product } from '@hooks';

import { ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import { Animated, Dimensions, Keyboard, StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  const HERO_COLLAPSED_HEIGHT = useMemo(() => {
    return ScaleSize(54) + insets.top;
  }, [insets.top]);

  const collapseScroll = HERO_HEIGHT - HERO_COLLAPSED_HEIGHT;

  const heroHeight = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, collapseScroll],
    outputRange: [HERO_HEIGHT, HERO_COLLAPSED_HEIGHT],
  });

  const backButtonTop = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, collapseScroll],
    outputRange: [insets.top + ScaleSize(8), insets.top + ScaleSize(7)],
  });

  const titleHeaderOpacity = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange: [0, 1],
  });

  const titleStoreOpacity = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange: [1, 0],
  });

  const titleTranslateY = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange: [ScaleSize(48), 0],
  });

  const headerOverlayOpacity = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange: [0, 1],
  });

  const iconLightOpacity = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
    outputRange: [1, 0],
  });
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

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
          useNativeDriver: false,
          listener: (event: any) => {
            if (!isSearchActive) {
              savedScrollOffset.current =
                event.nativeEvent.contentOffset.y;
            }
          },
        },
      ),
    [scrollY, isSearchActive],
  );

  const handleSearchOpen = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    const offset = savedScrollOffset.current;
    const restore = () => {
      scrollY.setValue(offset);
      flatListRef.current?.scrollToOffset({ offset, animated: false });
      setIsSearchActive(false);
    };

    // Wait for keyboard to fully hide before restoring scroll
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      sub.remove();
      restore();
    });
    // Fallback if keyboard was already hidden
    setTimeout(() => {
      sub.remove();
      restore();
    }, 400);
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
