import type { ImageName } from '@assets/images';

import { Image, HomeHeader, AppButton, Button } from '@components';
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
import { IWallet } from '@type';
import StoreOrderRecent from './StoreOrderRecent';
import { formatCurrency } from '@utils/product';
import { DeviceUtils } from '@kits/core/utils';
import { Colors } from '@constants';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const FEATURE_IMAGE_SIZE = ScaleSize(88);
// Gap between the two cards of the feature row. Applied as an animated margin
// (not `gap`) so it collapses together with the contribution card.
const ROW_GAP = ScaleSize(12);
const FEATURE_COLLAPSE_MS = 260;

const FEATURE_CARD_HEIGHT = ScaleSize(200);
const { ifAndroid } = DeviceUtils;
// PLACEHOLDER_MAIN_COMPONENT

const onPressPayment = () => {
  AppNavigator.navigate(Paths.PaymentOffline);
};

function PayCard({
  onPress,
  data,
  onPressTopup,
}: {
  readonly data?: IWallet;
  readonly onPress?: () => void;
  readonly onPressTopup?: () => void;
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
        <AppButton
          onPress={onPressTopup}
          style={{
            borderRadius: ScaleSize(10),
            borderWidth: 1,
            width: '48%',
            justifyContent: 'center',
            alignItems: 'center',
            height: ScaleSize(40),
            borderColor: Colors.primary,
          }}
        >
          <Text style={styles.payAction}>{t('home.pay_top_up')}</Text>
        </AppButton>
        <Button
          title={t('home.pay_now')}
          type="rounded"
          onPress={onPressPayment}
          style={{
            width: '48%',
            height: ScaleSize(40),
            borderRadius: 10,
          }}
        />
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
  readonly isCenter?: boolean;
};

function FeatureCard({
  onPress,
  desc,
  image,
  ctaRight = '',
  testID,
  title,
  isCenter,
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
      <View
        style={[
          styles.featureImageWrap,
          {
            alignItems: isCenter ? 'center' : 'flex-end',
            justifyContent: isCenter ? 'center' : 'flex-end',
          },
        ]}
      >
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

// Collapsible half of the feature row. `flexGrow` animates 1 -> 0 so the
// sibling card stretches into the freed space on the same frames, and the
// trailing margin (the row gap) collapses with it. The card stays mounted
// while collapsed — an unmounted view cannot animate its width.
function ContributionSlot({
  children,
  isHidden,
}: {
  readonly children: ReactNode;
  readonly isHidden: boolean;
}) {
  const progress = useSharedValue(isHidden ? 0 : 1);

  useEffect(() => {
    progress.value = withTiming(isHidden ? 0 : 1, {
      duration: FEATURE_COLLAPSE_MS,
    });
  }, [isHidden, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    flexGrow: progress.value,
    marginRight: progress.value * ROW_GAP,
    opacity: progress.value,
  }));

  return (
    <Animated.View
      importantForAccessibility={isHidden ? 'no-hide-descendants' : 'auto'}
      pointerEvents={isHidden ? 'none' : 'auto'}
      style={[styles.featureSlot, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}

function Home(props: any) {
  const { t } = useTranslation();
  const {
    goToPayCard,
    onPressContribution,
    onPressNotice,
    onPressNotification,
    onPressStore,
    onPressSurvey,
    onPressVoucher,
    currentWallet,
    openMenu,
    onGoToStore,
    isShowCtaContribute,
    profile,
    storeOrderRecent,
    isHideContribute,
    onPressEmptyStore,
    onGoToProduct,
    onPressTopup,
    onPressSwitchSchool,
    onPressMealTickets,
  } = useHome(props);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: ifAndroid(30, insets.top) }]}>
      <HomeHeader
        isShowLabelMember
        onOpenMenu={openMenu}
        onPressNotification={onPressNotification}
        profile={profile}
        onPressSwitchSchool={onPressSwitchSchool}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PayCard
          onPress={goToPayCard}
          data={currentWallet}
          onPressTopup={() => onPressTopup()}
        />
        <View style={styles.featureRow}>
          <ContributionSlot isHidden={isHideContribute}>
            <FeatureCard
              desc={t('home.dividend_desc')}
              image={imageNames.img_discount}
              isShowCtaRight={isShowCtaContribute}
              testID="home-dividend"
              ctaRight={t('home.join_coop')}
              onPress={onPressContribution}
              title={t('home.dividend_title')}
            />
          </ContributionSlot>
          <View style={styles.featureSlot}>
            <FeatureCard
              desc={t('home.order_desc')}
              image={imageNames.img_place_map}
              testID="home-order"
              isCenter={isHideContribute}
              onPress={onPressStore}
              title={t('home.order_title')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <FeatureCard
            desc={t('home.coupon_desc')}
            image={imageNames.ic_tag_green}
            testID="home-coupon"
            onPress={onPressVoucher}
            title={t('home.coupon_title')}
          />
          <FeatureCard
            desc={t('home.meal_ticket_desc')}
            image={imageNames.ic_utensils}
            onPress={onPressMealTickets}
            testID="home-meal-ticket"
            title={t('home.meal_ticket_title')}
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
    color: Colors.primary,
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
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(8),
  },
  featureImageWrap: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  // Feature row: no `gap` — the spacing lives on ContributionSlot's animated
  // marginRight so it can collapse along with the card. Fixed height keeps the
  // section stable while the cards reflow mid-animation.
  featureRow: {
    flexDirection: 'row',
    height: FEATURE_CARD_HEIGHT,
  },
  // Row slot: flexBasis 0 + flexGrow means width is driven purely by the
  // animated grow factor, so 1/1 = half each and 0/1 = full width for the
  // sibling. overflow hidden clips the card while it is collapsing.
  featureSlot: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'hidden',
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
