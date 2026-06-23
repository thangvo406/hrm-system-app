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
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { useHome } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet } from '@type';
import StoreOrderRecent from './StoreOrderRecent';
import { formatCurrency } from '@utils/product';
import { DeviceUtils } from '@kits/core/utils';

const FEATURE_IMAGE_SIZE = ScaleSize(88);
const { ifAndroid } = DeviceUtils;
// PLACEHOLDER_MAIN_COMPONENT

function PayCard({
  onPress = undefined,
  data = undefined,
}: {
  readonly data?: Wallet;
  readonly onPress?: () => void;
}) {
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
        {t('home.pay_amount', { amount: formatCurrency(data?.balance) || 0 })}
      </Text>
      <View style={styles.payDivider} />
      <View style={styles.payFooter}>
        <Text style={styles.pointText}>
          {t('home.point_label', { point: data?.pointBalance || 0 })}
        </Text>
        <Text style={styles.payAction}>{t('home.pay_action')}</Text>
      </View>
    </TouchableOpacity>
  );
}

type FeatureCardProps = {
  readonly desc: string;
  readonly image: ImageName;
  readonly ctaRight?: string;
  readonly isShowCtaRight?: boolean;
  readonly testID: string;
  readonly title: string;
  readonly onPress: any;
};

function FeatureCard({
  onPress,
  desc,
  image,
  ctaRight = '',
  testID,
  title,
  isShowCtaRight = false,
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
        {isShowCtaRight && ctaRight ? (
          <View style={styles.featureLabel} testID={`${testID}-label`}>
            <Text style={styles.featureLabelText}>{ctaRight}</Text>
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

function Home() {
  const { t } = useTranslation();
  const {
    goToPayCard,
    onPressContribution,
    onPressNotice,
    onPressNotification,
    onPressStore,
    onPressSurvey,
    currentWallet,
    openMenu,
    onGoToStore,
    isShowCtaContribute,
    profile,
    storeOrderRecent,
    onPressEmptyStore,
    onGoToProduct,
  } = useHome();
  const insets = useSafeAreaInsets();
  // alert(JSON.stringify(insets));
  return (
    <View style={[styles.safeArea, { paddingTop: ifAndroid(30, insets.top) }]}>
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
        <PayCard onPress={goToPayCard} data={currentWallet} />
        <View style={styles.row}>
          <FeatureCard
            desc={t('home.dividend_desc')}
            image={imageNames.img_discount}
            isShowCtaRight={isShowCtaContribute}
            testID="home-dividend"
            ctaRight="조합 가입하기"
            onPress={onPressContribution}
            title={t('home.dividend_title')}
          />
          <FeatureCard
            desc={t('home.order_desc')}
            image={imageNames.img_place_map}
            testID="home-order"
            onPress={onPressStore}
            title={t('home.order_title')}
          />
        </View>
        <StoreOrderRecent
          onPressProduct={onGoToProduct}
          onPressStore={onGoToStore}
          data={storeOrderRecent}
          onPressEmptyStore={onPressEmptyStore}
        />
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
            onPress={onPressSurvey}
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
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  safeArea: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  scrollContent: {
    gap: ScaleSize(16),
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  // PLACEHOLDER_STYLES
  payCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(18),
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(24),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  payLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  payAmount: {
    color: '#1A1A1A',
    fontSize: ScaleSize(38),
    fontWeight: '800',
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
  payDivider: {
    backgroundColor: '#E0E0E0',
    height: ScaleSize(1),
    marginTop: ScaleSize(24),
  },
  payFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(18),
  },
  pointText: {
    color: '#1A1A1A',
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  payAction: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    flex: 1,
    minHeight: ScaleSize(200),
    padding: ScaleSize(20),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  featureDesc: {
    color: '#9E9E9E',
    fontSize: ScaleSize(9),
    marginTop: ScaleSize(8),
  },
  featureImageWrap: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  featureLabel: {
    backgroundColor: '#54C158',
    borderRadius: 999,
    paddingHorizontal: ScaleSize(4),
    paddingVertical: ScaleSize(4),
    position: 'absolute',
    right: 0,
  },
  featureLabelText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(8),
    fontWeight: '700',
  },
  featureTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  featureTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: '#5C5C5C',
    fontSize: ScaleSize(14),
    marginBottom: ScaleSize(10),
  },
  storeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScaleSize(12),
  },
  storeNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  storeName: {
    color: '#1A1A1A',
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  storeEta: {
    color: '#5C5C5C',
    fontSize: ScaleSize(13),
  },
});
