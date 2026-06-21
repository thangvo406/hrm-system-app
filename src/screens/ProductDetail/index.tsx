import type { ProductImage } from '@type/products';

import { AppButton, Image, ProductDetailLoading, ProgressiveImage } from '@components';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductDetail } from '@hooks';
import AppNavigator from '@navigation/AppNavigator';
import Carousel from 'react-native-reanimated-carousel';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import { DeviceUtils } from '@kits/core/utils';
import LinearGradient from 'react-native-linear-gradient';

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
const CART_BTN_BG = '#1A1A1A';
const BANNER_OVERLAY_COLORS = ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)'];

type BackButtonProps = {
  readonly onPress: () => void;
  readonly topInset: number;
};


const onPressBack = () => {
  AppNavigator.goBack();
};

function BackButton({ onPress, topInset }: BackButtonProps) {
  return (
    <AppButton
      onPress={onPress}
      style={[styles.backButton, { top: topInset + ScaleSize(0) }]}
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

function ProductHero({
  images,
}: {
  readonly images: ProductImage[];
}) {
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
            <View pointerEvents="none" style={styles.bannerOverlay}>
              <LinearGradient
                colors={BANNER_OVERLAY_COLORS}
                end={{ x: 0, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.bannerOverlayGradient}
              />
            </View>
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
}: {
  readonly bottomInset: number;
  readonly onPressCart: () => void;
  readonly totalLabel: string;
  readonly totalValue: string;
}) {
  const { t } = useTranslation();
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
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressCart}
        style={styles.cartButton}
        testID="product-detail-cart"
      >
        <Text style={styles.cartButtonText}>
          {t('product_detail.cart_button')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function ProductDetail(props: any) {
  const insets = useSafeAreaInsets();
  const { data, loading, onPressCart } = useProductDetail(props);
  const { t } = useTranslation();


  return (
    <View style={styles.safeArea}>
      {loading ? (
        <ProductDetailLoading />
      ) : (
        <>
          <View style={styles.topSection}>
            <ProductHero images={data?.images ?? []} />
            <BackButton onPress={onPressBack} topInset={insets.top} />
          </View>
          <View style={styles.middleSection}>
            <ProductInfo
              description={data?.description}
              name={data?.name}
              price={data?.price}
            />
          </View>
          <BottomSheet
            bottomInset={insets.bottom}
            onPressCart={onPressCart}
            totalLabel={t('product_detail.min_order_label')}
            totalValue={ProductUtils.formatCurrency(data?.price)}
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
    borderRadius: BACK_BUTTON_SIZE/2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
  },
  cartButton: {
    alignItems: 'center',
    backgroundColor: CART_BTN_BG,
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
