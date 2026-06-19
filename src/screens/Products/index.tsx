import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';
import type { Product } from '@hooks';

import { ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
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

const HERO_HEIGHT = ScaleSize(280);
// const HERO_COLLAPSED_HEIGHT = ScaleSize(64);
// const HERO_COLLAPSED_HEIGHT = ScaleSize(104);
const DIVIDER_COLOR = '#F0F0F0';

const keyExtractor = (item: Product) => String(item.id);

function Products({ navigation }: RootScreenProps<Paths.Products>) {
  const insets = useSafeAreaInsets();
  const { data, loading, onLoadMore } = useProducts();
  const scrollY = React.useMemo(() => new Animated.Value(0), []);

  const HERO_COLLAPSED_HEIGHT = useMemo(() => {
    return ScaleSize(54) + insets.top;
  }, []);

  const heroHeight = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, HERO_HEIGHT - HERO_COLLAPSED_HEIGHT],
    outputRange: [HERO_HEIGHT, HERO_COLLAPSED_HEIGHT],
  });

  const backButtonTop = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, HERO_HEIGHT - HERO_COLLAPSED_HEIGHT],
    outputRange: [insets.top + ScaleSize(8), insets.top - ScaleSize(4)],
  });

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPressProduct = React.useMemo(
    () => (item: any) => {
      AppNavigator.navigate(Paths.ProductDetail, { id: item?.id });
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

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  return (
    <View style={styles.safeArea}>
      <HeroHeader
        backButtonTop={backButtonTop}
        heroHeight={heroHeight}
        onPressBack={onPressBack}
      />
      {loading ? (
        <ProductsLoading />
      ) : (
        <Animated.FlatList
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={<ListEmpty loading={loading} />}
          ListHeaderComponent={
            <View>
              <StoreInfo />
              <View style={styles.headerDivider} />
            </View>
          }
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={keyExtractor}
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
    width: SCREEN_WIDTH,
  },
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(48),
    paddingTop: HERO_HEIGHT,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});
