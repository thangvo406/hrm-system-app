import type { RootScreenProps } from '@navigation/types';
import type { ListRenderItem } from 'react-native';

import { Image, ProductsLoading } from '@components';
import { Paths } from '@navigation/paths';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { useProducts } from '@hooks';
import type { Product } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductUtils } from '@utils';
import imageNames from '@assets/images/names';
import AppNavigator from '@navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_HEIGHT = ScaleSize(280);
const HERO_COLLAPSED_HEIGHT = ScaleSize(64);
const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const PRODUCT_THUMB_SIZE = ScaleSize(96);
const CLOCK_ICON_SIZE = ScaleSize(16);

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const TEXT_PRICE = '#1A1A1A';
const DIVIDER_COLOR = '#F0F0F0';
const PRIMARY_COLOR = '#5BB85C';

const keyExtractor = (item: Product) => String(item.id);

type RowProps = {
  readonly item: Product;
  readonly onPress: (item: any) => void;
};

const ProductRow = React.memo(function ProductRow({ item, onPress }: RowProps) {
  const thumbUri = item.thumbnail?.fileUrl;

  const handlePress = () => {
    onPress(item);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.productRow}
      testID={`product-${item.id}`}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>
          {ProductUtils.formatCurrency(item.price)}
        </Text>
      </View>
      {thumbUri ? (
        <Image
          width={PRODUCT_THUMB_SIZE}
          height={PRODUCT_THUMB_SIZE}
          url={thumbUri}
          style={{
            borderRadius: ScaleSize(10),
          }}
          testID={`product-${item.id}-thumb`}
        />
      ) : (
        <Image
          width={PRODUCT_THUMB_SIZE}
          height={PRODUCT_THUMB_SIZE}
          name={imageNames.img_product_default}
          testID={`product-${item.id}-thumb`}
        />
      )}
    </TouchableOpacity>
  );
});

function ItemSeparator() {
  return <View style={styles.separator} />;
}

type HeroHeaderProps = {
  readonly backButtonTop: Animated.AnimatedInterpolation<number>;
  readonly heroHeight: Animated.AnimatedInterpolation<number>;
  readonly onPressBack: () => void;
};

function HeroHeader({
  backButtonTop,
  heroHeight,
  onPressBack,
}: HeroHeaderProps) {
  return (
    <Animated.View style={[styles.heroWrap, { height: heroHeight }]}>
      <Image
        height={HERO_HEIGHT}
        name="img_header_products_default"
        resizeMode="cover"
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

function StoreInfo() {
  const { t } = useTranslation();
  return (
    <View style={styles.storeInfo}>
      <Text style={styles.storeName}>{t('products.store_name')}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Image
            color={TEXT_DARK}
            height={CLOCK_ICON_SIZE}
            name="ic_clock"
            type="svg"
            width={CLOCK_ICON_SIZE}
          />
          <Text style={styles.metaText}>{t('products.estimate_time')}</Text>
        </View>
        <Text style={styles.metaText}>{t('products.min_order')}</Text>
      </View>
    </View>
  );
}

type ListEmptyProps = {
  readonly loading: boolean;
};

function ListEmpty({ loading }: ListEmptyProps) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={PRIMARY_COLOR} />
      </View>
    );
  }
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{t('products.empty')}</Text>
    </View>
  );
}

function Products({ navigation }: RootScreenProps<Paths.Products>) {
  const insets = useSafeAreaInsets();
  const { data, loading, onLoadMore } = useProducts();
  const scrollY = React.useMemo(() => new Animated.Value(0), []);

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
          contentContainerStyle={styles.listContent}
          data={data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          ListEmptyComponent={<ListEmpty loading={loading} />}
          ListHeaderComponent={
            <View>
              <StoreInfo />
              <View style={styles.headerDivider} />
            </View>
          }
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScaleSize(48),
  },
  emptyText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  headerDivider: {
    backgroundColor: DIVIDER_COLOR,
    height: ScaleSize(8),
    width: SCREEN_WIDTH,
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
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(48),
    paddingTop: HERO_HEIGHT,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(20),
    marginTop: ScaleSize(12),
  },
  metaText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(13),
  },
  productDescription: {
    color: 'black',
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(6),
  },
  productInfo: {
    flex: 1,
    paddingRight: ScaleSize(12),
  },
  productName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
  },
  productPrice: {
    color: TEXT_PRICE,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
    marginTop: ScaleSize(12),
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(20),
  },
  productThumb: {
    borderRadius: ScaleSize(8),
    height: PRODUCT_THUMB_SIZE,
    width: PRODUCT_THUMB_SIZE,
  },
  productThumbFallback: {
    backgroundColor: '#E0E0E0',
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  separator: {
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginHorizontal: ScaleSize(20),
  },
  storeInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
    paddingBottom: ScaleSize(20),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '800',
  },
});
