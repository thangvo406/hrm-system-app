import type { ProductImage } from '@type/products';

import {
  AppButton,
  Button,
  Image,
  ProductDetailLoading,
  ProgressiveImage,
} from '@components';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductDetail } from '@hooks';
import AppNavigator from '@navigation/AppNavigator';
import Carousel from 'react-native-reanimated-carousel';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import { DeviceUtils } from '@kits/core/utils';
import ProductAttributes from './ProductAttributes';
import ProductQuantity from './ProductQuanlity';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { ifIOS } = DeviceUtils;
const HERO_HEIGHT = ScaleSize(300);
const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const CART_BUTTON_HEIGHT = ScaleSize(56);
const SHEET_VERTICAL_PADDING = ScaleSize(20);

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const TEXT_LABEL = '#5C5C5C';
const SHEET_BG = '#F2F2F2';

type BackButtonProps = {
  readonly onPress: () => void;
};

const onPressBack = () => {
  AppNavigator.goBack();
};

function BackButton({ onPress }: BackButtonProps) {
  const insets = useSafeAreaInsets();
  return (
    <AppButton
      onPress={onPress}
      style={[styles.backButton, { top: insets.top }]}
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
        pagingEnabled
        renderItem={({ item }) => (
          <>
            <ProgressiveImage
              height={HERO_HEIGHT}
              name={item.name}
              imageStyle={styles.heroImage}
              resizeMode="cover"
              url={item.fileUrl}
              width={SCREEN_WIDTH}
            />
          </>
        )}
        testID="product-detail-carousel"
        width={SCREEN_WIDTH}
      />
    </View>
  );
}

function ProductInfo({
  description = '',
  name = '',
  price = 0,
}: {
  readonly description?: string;
  readonly name?: string;
  readonly price?: number;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.infoWrap}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productDescription}>{description}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>{t('product_detail.price_label')}</Text>
        <Text style={styles.priceValue}>
          {ProductUtils.formatCurrency(price)}
        </Text>
      </View>
    </View>
  );
}

function BottomSheet({
  bottomInset,
  onPressCart,
  totalLabel,
  totalValue,
  title,
}: {
  readonly bottomInset: number;
  readonly onPressCart: () => void;
  readonly totalLabel: string;
  readonly totalValue: string;
}) {
  return (
    <View
      style={[
        styles.sheetWrap,
        { paddingBottom: bottomInset + ifIOS(0, SHEET_VERTICAL_PADDING) },
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

  return (
    <View style={styles.safeArea}>
      {loading ? (
        <ProductDetailLoading />
      ) : (
        <>
          <BackButton onPress={onPressBack} />
          <ScrollView>
            <View style={styles.topSection}>
              <ProductHero images={data?.images ?? []} />
            </View>
            <View style={styles.middleSection}>
              <ProductInfo
                description={data?.description}
                name={data?.name}
                price={data?.price}
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
                />
              </View>
            </View>
          </ScrollView>
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
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    left: ScaleSize(12),
    position: 'absolute',
    width: BACK_BUTTON_SIZE,
    zIndex: 2,
    // borderRadius: BACK_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: BACK_BUTTON_SIZE / 2,
    padding: ScaleSize(16),
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
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
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: HERO_HEIGHT,
    zIndex: 0,
  },
  bannerOverlayGradient: {
    flex: 1,
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
  priceValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
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
  topSection: {
    backgroundColor: '#FFFFFF',
  },
});
