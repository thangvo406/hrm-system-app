import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';
import type { IProduct } from '@type/products';

import { Button, EmptyView, ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import React, { useCallback, useMemo } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
const { ifAndroid } = DeviceUtils;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = ScaleSize(220);
const DIVIDER_COLOR = '#F0F0F0';
// Flip the status bar to dark once the white header is (mostly) opaque — the
// header background fades in over collapseScroll * 0.8 → collapseScroll, so
// 0.9 is the midpoint of that fade.
const STATUS_BAR_FLIP_RATIO = 0.9;

const keyExtractor = (item: IProduct) => String(item.id);
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
    onChangeQuantity,
    onLoadMore,
    onSearchChange,
  } = useProducts(props);
  const { t } = useTranslation();

  // scrollY always tracks the FlatList offset; frozenScrollY is what every
  // header interpolation reads. While search is open the mirror is paused,
  // so the hero header stays put no matter how the list scrolls behind the
  // keyboard (filter results, inset adjustments...).
  const scrollY = useSharedValue(0);
  const frozenScrollY = useSharedValue(0);
  const isSearchActive = useSharedValue(false);

  useFocusEffect(
    useCallback(() => {
      if (scrollY.value == 0) {
        StatusBar.setBarStyle('light-content');
      }
      return () => {
        StatusBar.setBarStyle('dark-content');
      };
    }, []),
  );

  const HERO_COLLAPSED_HEIGHT = useMemo(() => {
    return ScaleSize(54) + insets.top;
  }, [insets.top]);

  const collapseScroll = HERO_HEIGHT - HERO_COLLAPSED_HEIGHT;

  const applyBarStyle = useCallback((isHeaderVisible: boolean) => {
    StatusBar.setBarStyle(isHeaderVisible ? 'dark-content' : 'light-content');
  }, []);

  // Drive the status bar off the same (frozen) scroll value the header reads,
  // so opening search doesn't desync the bar from the visible header.
  useAnimatedReaction(
    () => frozenScrollY.value >= collapseScroll * STATUS_BAR_FLIP_RATIO,
    (isHeaderVisible, previous) => {
      if (isHeaderVisible !== previous) {
        scheduleOnRN(applyBarStyle, isHeaderVisible);
      }
    },
  );

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
    if (!isSearchActive.value) {
      frozenScrollY.value = event.contentOffset.y;
    }
  });

  const handleSearchOpen = useCallback(() => {
    // Lock the hero header at its current visual state.
    isSearchActive.value = true;
  }, [isSearchActive]);

  const handleSearchClose = useCallback(() => {
    // Re-attach the hero to live scroll and snap it to wherever the list
    // currently sits so the next scroll event doesn't jump the banner.
    isSearchActive.value = false;
    frozenScrollY.value = scrollY.value;
  }, [frozenScrollY, isSearchActive, scrollY]);

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
    (): ListRenderItem<IProduct> =>
      function renderItem({ item, index }) {
        return (
          <ProductRow
            isFirst={index == 0}
            item={item}
            onPress={onPressProduct}
            index={index}
            onChangeQuantity={onChangeQuantity}
          />
        );
      },
    [onPressProduct, data],
  );

  return (
    <View style={styles.safeArea}>
      <HeroHeader
        banner={storeInfo?.banner}
        collapseScroll={collapseScroll}
        onPressBack={onPressBack}
        onSearchChange={onSearchChange}
        onSearchClose={handleSearchClose}
        onSearchOpen={handleSearchOpen}
        scrollY={frozenScrollY}
        storeName={storeInfo?.name}
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
            ItemSeparatorComponent={ItemSeparator}
            ListEmptyComponent={<ListEmpty loading={loading} />}
            ListHeaderComponent={
              <StoreInfo
                collapseScroll={collapseScroll}
                scrollY={frozenScrollY}
                storeInfo={storeInfo}
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
              title={t('products.cart_button', {
                amount: formatCurrency(storeInfo?.totalAmountCart),
              })}
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
