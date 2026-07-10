import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';
import type { Product } from '@hooks';

import { Button, EmptyView, ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
import { DeviceUtils } from '@kits/core/utils';
import { formatCurrency } from '@utils/product';
const { ifAndroid } = DeviceUtils;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = ScaleSize(220);
const COLLAPSE_TITLE_START = 0.8;
const DIVIDER_COLOR = '#F0F0F0';

const keyExtractor = (item: Product) => String(item.id);
const onPressBack = () => {
  if (AppNavigator.getPreviousRoute()?.name == Paths.ProductDetail) {
    AppNavigator.navigate(Paths.Stores);
  } else {
    AppNavigator.goBack();
  }
};
function Products(props: RootScreenProps<Paths.Products>) {
  const insets = useSafeAreaInsets();
  const {
    data,
    storeInfo,
    isShowBtnCart,
    loading,
    goToCart,
    onLoadMore,
    onSearchChange,
  } = useProducts(props);
  const { t } = useTranslation();
  const scrollY = React.useMemo(() => new Animated.Value(0), []);
  // While search is open, frozenScrollY drives the hero height
  // instead of scrollY — this completely isolates the hero from any
  // FlatList movement caused by the keyboard (auto-scroll,
  // contentInset, scroll-to-input). When search closes, we copy
  // frozenScrollY back into scrollY before re-attaching to the live
  // FlatList offset, so the banner's height is preserved.
  const frozenScrollY = React.useMemo(() => new Animated.Value(0), []);
  const isSearchActiveRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const HERO_COLLAPSED_HEIGHT = useMemo(() => {
    return ScaleSize(54) + insets.top;
  }, [insets.top]);

  const collapseScroll = HERO_HEIGHT - HERO_COLLAPSED_HEIGHT;

  const heroHeight = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [0, collapseScroll],
        outputRange: [HERO_HEIGHT, HERO_COLLAPSED_HEIGHT],
      }),
    [frozenScrollY, collapseScroll],
  );

  const backButtonTop = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [0, collapseScroll],
        outputRange: [insets.top + ScaleSize(8), insets.top + ScaleSize(7)],
      }),
    [frozenScrollY, collapseScroll, insets.top],
  );

  const titleHeaderOpacity = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [0, 1],
      }),
    [frozenScrollY, collapseScroll],
  );

  const titleStoreOpacity = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [1, 0],
      }),
    [frozenScrollY, collapseScroll],
  );

  const titleTranslateY = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [ScaleSize(48), 0],
      }),
    [frozenScrollY, collapseScroll],
  );

  const headerOverlayOpacity = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [0, 1],
      }),
    [frozenScrollY, collapseScroll],
  );

  const iconLightOpacity = useMemo(
    () =>
      frozenScrollY.interpolate({
        extrapolate: 'clamp',
        inputRange: [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        outputRange: [1, 0],
      }),
    [frozenScrollY, collapseScroll],
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
      function renderItem({ item, index }) {
        return (
          <ProductRow
            isFirst={index == 0}
            item={item}
            onPress={onPressProduct}
          />
        );
      },
    [onPressProduct],
  );

  // Mirror scrollY into frozenScrollY ONLY while search is closed.
  // Once search opens, we stop forwarding so frozenScrollY (and thus
  // every interpolated style) stays put no matter what the FlatList
  // does in response to the keyboard.
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      if (!isSearchActiveRef.current) {
        frozenScrollY.setValue(value);
      }
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY, frozenScrollY]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  const handleSearchOpen = useCallback(() => {
    // Lock the hero header at its current visual state. From here on
    // any FlatList scroll caused by the keyboard is ignored.
    isSearchActiveRef.current = true;
  }, []);

  const handleSearchClose = useCallback(() => {
    // Re-attach the hero to live scroll. Sync scrollY back to the
    // frozen value first so the FlatList's native contentOffset is
    // realigned and the next scroll event doesn't snap the banner.
    isSearchActiveRef.current = false;
    // @ts-expect-error _value is a private but stable RN runtime field
    const frozenValue = frozenScrollY._value as number;
    scrollY.setValue(frozenValue);
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: frozenValue,
    });
  }, [scrollY, frozenScrollY]);

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
        <ProductsLoading
          style={{
            marginTop: HERO_HEIGHT + ScaleSize(170),
          }}
        />
      ) : data?.length > 0 ? (
        <>
          <Animated.FlatList
            ref={flatListRef}
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<ListEmpty loading={loading} />}
            ListHeaderComponent={
              <StoreInfo
                storeInfo={storeInfo}
                titleOpacity={titleStoreOpacity}
              />
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
          {isShowBtnCart ? (
            <Button
              title={t('products.cart_button', { amount: formatCurrency(storeInfo?.totalAmountCart) })}
              type="rounded"
              onPress={goToCart}
              style={{
                marginBottom: ifAndroid(16, insets.bottom || 20),
                width: '90%',
                alignSelf: 'center',
              }}
            />
          ) : undefined}
        </>
      ) : (
        <EmptyView icon={imageNames.ic_store} desc={t('common.no_data')} />
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
    paddingTop: HERO_HEIGHT + ScaleSize(20),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});
