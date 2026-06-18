import type { ImageName } from '@assets/images';

import { Image, HomeHeader } from '@components';
import imageNames from '@assets/images/names';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHome } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAY_AMOUNT = '100,000';
const POINT_AMOUNT = '210,000';
const STORE_NAME = 'Cafe Coop';

const FEATURE_IMAGE_SIZE = 88;

type Product = {
  readonly color: string;
  readonly name: string;
  readonly price: string;
};

const PRODUCTS: readonly Product[] = [
  { color: '#3A2E2A', name: '아메리카노', price: '3,500원' },
  { color: '#C9B79C', name: '라떼', price: '4,500원' },
  { color: '#D7B98E', name: '마들렌', price: '4,500원' },
  { color: '#E8C8B0', name: '딸기 조각', price: '4,500원' },
];

// PLACEHOLDER_MAIN_COMPONENT

function PayCard({ onPress = undefined }: { readonly onPress?: () => void }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.payCard}
      testID="home-pay-card"
    >
      <Text style={styles.payLabel}>{t('home.pay_label')}</Text>
      <Text style={styles.payAmount}>
        {t('home.pay_amount', { amount: PAY_AMOUNT })}
      </Text>
      <View style={styles.payDivider} />
      <View style={styles.payFooter}>
        <Text style={styles.pointText}>
          {t('home.point_label')} {POINT_AMOUNT}
        </Text>
        <Text style={styles.payAction}>{t('home.pay_action')}</Text>
      </View>
    </TouchableOpacity>
  );
}

type FeatureCardProps = {
  readonly desc: string;
  readonly image: ImageName;
  readonly labelRight?: string;
  readonly testID: string;
  readonly title: string;
  readonly onPress: any;
};

function FeatureCard({
  onPress,
  desc,
  image,
  labelRight,
  testID,
  title,
}: FeatureCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.featureCard}
      testID={testID}
      onPress={onPress}
    >
      <View style={styles.featureTitleRow}>
        <Text style={styles.featureTitle}>{title}</Text>
        {labelRight ? (
          <View style={styles.featureLabel} testID={`${testID}-label`}>
            <Text style={styles.featureLabelText}>{labelRight}</Text>
          </View>
        ) : undefined}
      </View>
      <Text style={styles.featureDesc}>{desc}</Text>
      <View style={styles.featureImageWrap}>
        <Image
          height={FEATURE_IMAGE_SIZE}
          name={image}
          type="image"
          width={FEATURE_IMAGE_SIZE}
        />
      </View>
    </TouchableOpacity>
  );
}

function StoreSection({ onPressStore }: any) {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={styles.sectionLabel}>{t('home.frequent_store')}</Text>
      <View style={styles.storeHeader}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressStore}
          style={styles.storeNameRow}
        >
          <Image
            color="#1A1A1A"
            height={18}
            name="ic_store"
            type="svg"
            width={18}
          />
          <Text style={styles.storeName}>{STORE_NAME}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.productList}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {PRODUCTS.map(product => (
          <View
            key={product.name}
            style={styles.productCard}
            testID={`home-product-${product.name}`}
          >
            <View
              style={[styles.productThumb, { backgroundColor: product.color }]}
            />
            <View style={styles.productOverlay}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Home() {
  const { t } = useTranslation();
  const {
    goToProfile,
    onPressContribution,
    onPressNotice,
    onPressNotification,
    onPressOrder,
    openMenu,
    onGoToStore,
    profile,
  } = useHome();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HomeHeader
        isShowLabelMember
        onOpenMenu={openMenu}
        onPressNotification={onPressNotification}
        profile={profile}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PayCard onPress={goToProfile} />
        <View style={styles.row}>
          <FeatureCard
            desc={t('home.dividend_desc')}
            image={imageNames.img_discount}
            testID="home-dividend"
            labelRight="조합 가입하기"
            onPress={onPressContribution}
            title={t('home.dividend_title')}
          />
          <FeatureCard
            desc={t('home.order_desc')}
            image={imageNames.img_place_map}
            testID="home-order"
            onPress={onPressOrder}
            title={t('home.order_title')}
          />
        </View>
        <StoreSection onPressStore={onGoToStore} />
        <View style={styles.row}>
          <FeatureCard
            desc={t('home.notice_desc')}
            image={imageNames.img_speaker}
            testID="home-notice"
            onPress={onPressNotice}
            title={t('home.notice_title')}
          />
          <FeatureCard
            desc={t('home.survey_desc')}
            image={imageNames.img_picture}
            testID="home-survey"
            title={t('home.survey_title')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  greeting: {
    color: '#3D3D3D',
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  safeArea: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  // PLACEHOLDER_STYLES
  payCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  payLabel: {
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: '700',
  },
  payAmount: {
    color: '#1A1A1A',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 20,
    textAlign: 'center',
  },
  payDivider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginTop: 24,
  },
  payFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  pointText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  payAction: {
    color: '#1A1A1A',
    fontSize: 15,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flex: 1,
    minHeight: 200,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  featureDesc: {
    color: '#9E9E9E',
    fontSize: 9,
    marginTop: 8,
  },
  featureImageWrap: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  featureLabel: {
    backgroundColor: '#54C158',
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
  },
  featureLabelText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  featureTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '700',
  },
  featureTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: '#5C5C5C',
    fontSize: 14,
    marginBottom: 10,
  },
  storeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storeNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  storeName: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: '700',
  },
  storeEta: {
    color: '#5C5C5C',
    fontSize: 13,
  },
  productList: {
    gap: 10,
  },
  productCard: {
    borderRadius: 10,
    height: 96,
    overflow: 'hidden',
    width: 96,
  },
  productThumb: {
    flex: 1,
  },
  productOverlay: {
    bottom: 0,
    left: 0,
    padding: 8,
    position: 'absolute',
    right: 0,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productPrice: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
