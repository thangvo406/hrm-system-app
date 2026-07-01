import type { ProductImage } from '@type/products';
import type { SharedValue } from 'react-native-reanimated';

import {
  AppButton,
  Button,
  Image,
  ProductDetailLoading,
  ProgressiveImage,
} from '@components';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductDetail } from '@hooks';
import AppNavigator from '@navigation/AppNavigator';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import ProductAttributes from './ProductAttributes';
import ProductQuantity from './ProductQuanlity';
import isNumber from 'lodash/isNumber';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = ScaleSize(300);
const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const CART_BUTTON_HEIGHT = ScaleSize(56);
const SHEET_VERTICAL_PADDING = ScaleSize(20);
const STICKY_HEADER_HEIGHT = ScaleSize(56);
const STICKY_FADE_START = HERO_HEIGHT - STICKY_HEADER_HEIGHT - ScaleSize(40);
const STICKY_FADE_END = HERO_HEIGHT - STICKY_HEADER_HEIGHT;
const STICKY_TITLE_TRANSLATE_FROM = ScaleSize(20);

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const TEXT_LABEL = '#5C5C5C';
const SHEET_BG = '#F2F2F2';

type BackButtonProps = {
  readonly onPress: () => void;
  readonly scrollY: SharedValue<number>;
};

const onPressBack = () => {
  AppNavigator.goBack();
};

function BackButton({ onPress, scrollY }: BackButtonProps) {
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [STICKY_FADE_START, STICKY_FADE_END],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.backButtonWrap, { top: insets.top }, animatedStyle]}
    >
      <AppButton
        onPress={onPress}
        style={styles.backButton}
        testID="product-detail-back"
      >
        <Image
          color="#FFFFFF"
          height={BACK_ICON_SIZE}
          name="ic_chevron_right"
          style={styles.backIcon}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </AppButton>
    </Animated.View>
  );
}

type StickyHeaderProps = {
  readonly onPressBack: () => void;
  readonly scrollY: SharedValue<number>;
  readonly title: string;
};

function StickyHeader({ onPressBack, scrollY, title }: StickyHeaderProps) {
  const insets = useSafeAreaInsets();
  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [STICKY_FADE_START, STICKY_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [STICKY_FADE_START, STICKY_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [STICKY_FADE_START, STICKY_FADE_END],
      [STICKY_TITLE_TRANSLATE_FROM, 0],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });
  return (
    <Animated.View
      style={[
        styles.stickyHeader,
        {
          height: insets.top + STICKY_HEADER_HEIGHT,
          paddingTop: insets.top,
        },
        containerStyle,
      ]}
    >
      <AppButton
        onPress={onPressBack}
        style={styles.stickyBackButton}
        testID="product-detail-sticky-back"
      >
        <Image
          color={TEXT_DARK}
          height={BACK_ICON_SIZE}
          name="ic_chevron_right"
          style={styles.backIcon}
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </AppButton>
      <Animated.Text numberOfLines={1} style={[styles.stickyTitle, titleStyle]}>
        {title}
      </Animated.Text>
      <View style={styles.stickyRightSpacer} />
      <LinearGradient
        colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0)']}
        end={{ x: 0, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={styles.stickyShadow}
      />
    </Animated.View>
  );
}

function ProductHero({ images }: { readonly images: ProductImage[] }) {
  const items =
    images.length > 0 ? images : [{ name: imageNames.img_product_default }];
  return (
    <View style={styles.heroWrap}>
      <Carousel
        data={items}
        height={HERO_HEIGHT}
        loop
        autoPlay={items?.length > 1}
        pagingEnabled
        renderItem={({ item }) => (
          <ProgressiveImage
            height={HERO_HEIGHT}
            name={imageNames.img_product_default}
            imageStyle={styles.heroImage}
            resizeMode="cover"
            url={item.fileUrl}
            width={SCREEN_WIDTH}
          />
        )}
        testID="product-detail-carousel"
        width={SCREEN_WIDTH}
      />
    </View>
  );
}

function ProductInfo({
  discountPrice = 0,
  originalPrice = 0,
  description = '',
  name = '',
}: {
  readonly discountPrice?: number;
  readonly originalPrice?: number;
  readonly description?: string;
  readonly name?: string;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.infoWrap}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productDescription}>{description}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>{t('product_detail.price_label')}</Text>
        <View>
          {isNumber(originalPrice) && (
            <Text
              style={[
                styles.originalPrice,
                isNumber(discountPrice) && {
                  textDecorationLine: 'line-through',
                },
              ]}
            >
              {ProductUtils.formatCurrency(originalPrice)}
            </Text>
          )}
          {isNumber(discountPrice) && (
            <Text style={styles.priceValue}>
              {ProductUtils.formatCurrency(discountPrice)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function BottomSheet({
  bottomInset,
  onPressCart,
  title,
  totalLabel,
  totalValue,
}: {
  readonly bottomInset: number;
  readonly onPressCart: () => void;
  readonly title: string;
  readonly totalLabel: string;
  readonly totalValue: string;
}) {
  return (
    <View
      style={[
        styles.sheetWrap,
        {
          paddingBottom:
            bottomInset + (bottomInset == 0 ? SHEET_VERTICAL_PADDING : 0),
        },
      ]}
    >
      <View style={styles.sheetInfo}>
        <Text style={styles.sheetLabel}>{totalLabel}</Text>
        <Text style={styles.sheetValue}>{totalValue}</Text>
      </View>
      <Button
        onPress={onPressCart}
        style={styles.cartButton}
        testID="product-detail-cart"
        type="primary"
        title={title}
      />
    </View>
  );
}

function ProductDetail(props: any) {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const {
    data,
    loading,
    onChangeQuantity,
    onPressCart,
    onSelectAttribute,
    quantity,
    buttonTextSubmit,
    selectedAttributes,
    minChooseQuantity,
    totalAmount,
  } = useProductDetail(props);
  const { t } = useTranslation();

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.safeArea}>
      {loading ? (
        <ProductDetailLoading />
      ) : (
        <>
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSection}>
              <ProductHero images={data?.images ?? []} />
            </View>
            <View style={styles.middleSection}>
              <ProductInfo
                description={data?.description}
                name={data?.name}
                originalPrice={data?.sellingPrice}
                discountPrice={data?.discountPrice}
              />
              <ProductAttributes
                data={data?.attributes ?? []}
                onSelect={onSelectAttribute}
                selected={selectedAttributes}
              />
              <View style={styles.quantityWrap}>
                <ProductQuantity
                  onChange={onChangeQuantity}
                  quantity={quantity}
                  minChooseQuantity={minChooseQuantity}
                  maxQuantity={data?.stockQuantity}
                />
              </View>
            </View>
          </Animated.ScrollView>
          <StickyHeader
            onPressBack={onPressBack}
            scrollY={scrollY}
            title={data?.name ?? ''}
          />
          <BackButton onPress={onPressBack} scrollY={scrollY} />
          <BottomSheet
            bottomInset={insets.bottom}
            onPressCart={onPressCart}
            title={buttonTextSubmit}
            totalLabel={t('product_detail.min_order_label')}
            totalValue={ProductUtils.formatCurrency(totalAmount)}
          />
        </>
      )}
    </View>
  );
}

export default ProductDetail;

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BACK_BUTTON_SIZE / 2,
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    padding: ScaleSize(16),
    width: BACK_BUTTON_SIZE,
  },
  backButtonWrap: {
    left: ScaleSize(12),
    position: 'absolute',
    zIndex: 3,
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
  cartButton: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    flex: 1,
    height: CART_BUTTON_HEIGHT,
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  heroBannerClip: {
    ...StyleSheet.absoluteFillObject,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroBannerImage: {
    height: HERO_HEIGHT,
    left: 0,
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
  },
  heroImage: {
    height: HERO_HEIGHT,
    width: SCREEN_WIDTH,
  },
  heroWrap: {
    backgroundColor: '#FFFFFF',
  },
  infoWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  middleSection: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  priceLabel: {
    color: TEXT_LABEL,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(20),
    paddingBottom: ScaleSize(24),
  },
  originalPrice: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
  },
  priceValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
  },
  productDescription: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
  },
  productName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(22),
    fontWeight: '800',
  },
  quantityWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: ScaleSize(20),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  sheetInfo: {
    flex: 1,
    paddingRight: ScaleSize(12),
  },
  sheetLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  sheetValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(4),
  },
  sheetWrap: {
    backgroundColor: SHEET_BG,
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
    paddingTop: SHEET_VERTICAL_PADDING,
  },
  stickyBackButton: {
    alignItems: 'center',
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    width: BACK_BUTTON_SIZE,
  },
  stickyHeader: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    left: 0,
    paddingHorizontal: ScaleSize(12),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  stickyRightSpacer: {
    width: BACK_BUTTON_SIZE,
  },
  stickyShadow: {
    bottom: -ScaleSize(8),
    height: ScaleSize(8),
    left: 0,
    position: 'absolute',
    right: 0,
  },
  stickyTitle: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    paddingHorizontal: ScaleSize(8),
    textAlign: 'center',
  },
  topSection: {
    backgroundColor: '#FFFFFF',
  },
});
