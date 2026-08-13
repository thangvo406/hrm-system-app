import { AppButton, Image, PaginationDots } from '@components';
import { ScaleSize } from '@kits/core';
import type { IResponseOrganizationInfo } from '@type';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { CarouselRenderItem } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

import { Globals } from '@utils';
import { formatCurrency } from '@utils/product';

// const CARD_GRADIENT = ['#2E8B4A', '#1F6E38'];
const CARD_GRADIENT = ['#1F6E38', '#1F6E38'];
const HANDLE_COLOR = '#1F6E38';
const HANDLE_CHEVRON_COLOR = '#FFFFFF';
const HANDLE_CHEVRON_SIZE = ScaleSize(16);
const HANDLE_ANIMATION_DURATION_MS = 400;
const HALF_TURN_DEGREES = 180;
// ic_expand_wallet (viewBox 1000x500): the top 38% is a flat bar that gets
// clipped away so only the round bump with the chevron hangs below the card.
const HANDLE_IMAGE_WIDTH = ScaleSize(100);
const HANDLE_IMAGE_HEIGHT = ScaleSize(50);
const HANDLE_BAR_HEIGHT = ScaleSize(19);
const HANDLE_HEIGHT = HANDLE_IMAGE_HEIGHT - HANDLE_BAR_HEIGHT;
// 60 below the card bottom edge; the visible handle already fills part of it.
const ORGANIZATION_SECTION_GAP =
  ScaleSize(60) - HANDLE_IMAGE_HEIGHT + HANDLE_BAR_HEIGHT;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Matches the walletWrap inner width (screen minus paddingHorizontal 20 x2).
const ORGANIZATION_ITEM_WIDTH = SCREEN_WIDTH - ScaleSize(40);
const ORGANIZATION_CARD_WIDTH = ORGANIZATION_ITEM_WIDTH - ScaleSize(16);
const ORGANIZATION_CARD_HEIGHT = ScaleSize(220);
const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_GAP = ScaleSize(3);

type Properties = {
  readonly balance?: number;
  readonly isShowBottomButton: boolean;
  readonly onCharge: () => void;
  readonly onChargeHistory: () => void;
  readonly onUse: () => void;
  readonly onUseOrganize: (item?: IResponseOrganizationInfo) => void;
  readonly organizationInfo?: IResponseOrganizationInfo[];
  readonly point?: number;
  readonly toggleUnRegister: () => void;
};

const OrganizationInfo = ({
  onUse,
  info,
}: {
  readonly info?: IResponseOrganizationInfo;
  readonly onUse: (item?: IResponseOrganizationInfo) => void;
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.card, styles.organizationCard]}>
      <LinearGradient
        colors={CARD_GRADIENT}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <Text
        style={[
          styles.walletName,
          { paddingHorizontal: ScaleSize(20), paddingTop: ScaleSize(20) },
        ]}
      >
        {info?.name}
      </Text>

      <Text style={styles.balanceLabel}>{t('account_management.balance')}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceValue}>{formatCurrency(info?.balance)}</Text>
        <Text style={styles.currency}>{t('account_management.currency')}</Text>
      </View>

      <AppButton
        onPress={() => onUse?.(info)}
        style={styles.useButton}
        testID="account-management-use"
      >
        <Text style={styles.useButtonText}>{t('account_management.use')}</Text>
      </AppButton>
      <View
        style={{
          paddingBottom: ScaleSize(20),
          width: '100%',
        }}
      />
    </View>
  );
};

function WalletCard({
  balance,
  onCharge,
  onChargeHistory,
  onUse,
  organizationInfo,
  point,
  toggleUnRegister,
  onUseOrganize,
  isShowBottomButton,
}: Properties) {
  const { t } = useTranslation();
  const [isExpandedOrganization, setIsExpandedOrganization] = useState(false);
  const [organizationHeight, setOrganizationHeight] = useState(0);
  // 0 = collapsed, 1 = expanded. Drives the handle rotation and the reveal.
  const expandProgress = useSharedValue(isExpandedOrganization ? 1 : 0);
  const hasOrganize = (organizationInfo?.length || 0) > 0;
  const toggleOrganization = useCallback(() => {
    setIsExpandedOrganization(previous => !previous);
  }, []);
  const opacityBtnExpand = useSharedValue(0);
  useEffect(() => {
    expandProgress.value = withTiming(isExpandedOrganization ? 1 : 0, {
      duration: HANDLE_ANIMATION_DURATION_MS,
      easing: isExpandedOrganization
        ? Easing.out(Easing.cubic)
        : Easing.in(Easing.cubic),
    });
  }, [expandProgress, isExpandedOrganization]);

  useEffect(() => {
    if ((organizationInfo?.length || 0) > 0) {
      setTimeout(() => {
        opacityBtnExpand.value = withTiming(1, {
          duration: HANDLE_ANIMATION_DURATION_MS,
          easing: isExpandedOrganization
            ? Easing.out(Easing.cubic)
            : Easing.in(Easing.cubic),
        });
      }, 400);
    }
  }, [organizationInfo]);

  const onOrganizationLayout = useCallback((event: LayoutChangeEvent) => {
    setOrganizationHeight(event.nativeEvent.layout.height);
  }, []);

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${expandProgress.value * HALF_TURN_DEGREES}deg` }],
    height: opacityBtnExpand.value * HANDLE_HEIGHT,
    opacity: opacityBtnExpand.value,
    marginTop: -1,
  }));

  const organizationStyle = useAnimatedStyle(
    () => ({
      height: expandProgress.value * organizationHeight,
      // marginTop: expandProgress.value * ORGANIZATION_SECTION_GAP,
      opacity: expandProgress.value,
      marginTop: -1,
    }),
    [organizationHeight],
  );

  const carouselProgress = useSharedValue(0);

  const renderOrganize = useCallback<
    CarouselRenderItem<IResponseOrganizationInfo>
  >(
    ({ item }) => (
      <View style={styles.organizationSlot}>
        <OrganizationInfo info={item} onUse={onUseOrganize} />
      </View>
    ),
    [onUseOrganize],
  );

  const onTouchStart = useCallback(() => {
    if (Globals.isScrollingRef) {
      Globals.isScrollingRef.current = true;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (Globals.isScrollingRef) {
      Globals.isScrollingRef.current = false;
    }
  }, []);

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <LinearGradient
        colors={CARD_GRADIENT}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <Text style={styles.walletName}>
            {t('account_management.wallet_name')}
          </Text>
          <AppButton style={styles.pointPill} onPress={toggleUnRegister}>
            <Text style={styles.pointText}>
              {t('account_management.point_held', {
                point: formatCurrency(point),
              })}
            </Text>
          </AppButton>
        </View>

        <Text style={styles.balanceLabel}>
          {t('account_management.balance')}
        </Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
          <Text style={styles.currency}>
            {t('account_management.currency')}
          </Text>
        </View>

        {!!isShowBottomButton && (
          <AppButton
            onPress={onUse}
            style={styles.useButton}
            testID="account-management-use"
          >
            <Text style={styles.useButtonText}>
              {t('account_management.use')}
            </Text>
          </AppButton>
        )}

        <View style={styles.actionRow}>
          <AppButton
            onPress={onCharge}
            style={styles.actionButton}
            testID="account-management-charge"
          >
            <Text style={styles.actionButtonText}>
              {t('account_management.charge')}
            </Text>
          </AppButton>
          {!!isShowBottomButton && (
            <AppButton
              onPress={onChargeHistory}
              style={styles.actionButton}
              testID="account-management-charge-history"
            >
              <Text style={styles.actionButtonText}>
                {t('account_management.charge_history')}
              </Text>
            </AppButton>
          )}
        </View>
      </LinearGradient>

      {hasOrganize ? (
        <AppButton
          onPress={toggleOrganization}
          style={styles.expandHandle}
          testID="account-management-organization-toggle"
        >
          <Animated.View style={[styles.expandHandleClip, handleStyle]}>
            <Image
              color={HANDLE_COLOR}
              height={HANDLE_IMAGE_HEIGHT}
              name="ic_expand_wallet"
              style={styles.expandHandleIcon}
              type="svg"
              width={HANDLE_IMAGE_WIDTH}
            />
            <View style={styles.expandHandleChevron}>
              <Image
                color={HANDLE_CHEVRON_COLOR}
                height={HANDLE_CHEVRON_SIZE}
                name="ic_chevron_down"
                type="svg"
                width={HANDLE_CHEVRON_SIZE}
              />
            </View>
          </Animated.View>
        </AppButton>
      ) : undefined}

      {hasOrganize ? (
        <Animated.View
          pointerEvents={isExpandedOrganization ? 'auto' : 'none'}
          style={[styles.organizationClip, organizationStyle]}
        >
          <View
            onTouchCancel={onTouchEnd}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            onLayout={onOrganizationLayout}
            style={styles.organizationContent}
          >
            <Carousel
              data={organizationInfo || []}
              height={ORGANIZATION_CARD_HEIGHT}
              loop={false}
              onProgressChange={(_, absoluteProgress) => {
                carouselProgress.value = absoluteProgress;
              }}
              pagingEnabled
              renderItem={renderOrganize}
              style={styles.organizationCarousel}
              testID="account-management-organization-carousel"
              width={ORGANIZATION_ITEM_WIDTH}
            />

            {(organizationInfo?.length || 0) > 1 ? (
              <PaginationDots
                activeWidth={DOT_ACTIVE_WIDTH}
                count={organizationInfo?.length || 0}
                gap={DOT_GAP}
                progress={carouselProgress}
                size={DOT_SIZE}
                style={styles.paginationRow}
              />
            ) : undefined}
          </View>
        </Animated.View>
      ) : undefined}
    </View>
  );
}

export default React.memo(WalletCard);

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: ScaleSize(10),
    flex: 1,
    height: ScaleSize(46),
    justifyContent: 'center',
  },
  bannerWrap: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(10),
    marginHorizontal: ScaleSize(20),
    paddingBottom: ScaleSize(20),
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(18),
    paddingHorizontal: ScaleSize(20),
  },
  balanceRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(6),
    justifyContent: 'center',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: ScaleSize(40),
    fontWeight: '800',
  },
  card: {
    borderRadius: ScaleSize(18),
    overflow: 'hidden',

    // padding: ScaleSize(20),
  },
  currency: {
    color: '#FFFFFF',
    fontSize: ScaleSize(18),
    fontWeight: '600',
    marginBottom: ScaleSize(4),
    marginLeft: ScaleSize(6),
  },
  expandHandle: {
    alignSelf: 'center',
  },
  expandHandleChevron: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    paddingBottom: ScaleSize(4),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  expandHandleClip: {
    height: HANDLE_HEIGHT,
    overflow: 'hidden',
    // marginTop: -1,
  },
  expandHandleIcon: {
    marginTop: -HANDLE_BAR_HEIGHT,
  },
  organizationCard: {
    height: '100%',
    width: ORGANIZATION_CARD_WIDTH,
  },
  organizationCarousel: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ORGANIZATION_ITEM_WIDTH,
  },
  organizationClip: {
    overflow: 'hidden',
  },
  // Positioned absolutely so its measured height is independent of the
  // clip's animated height (measuring inside a 0-height parent reports 0).
  organizationContent: {
    gap: ScaleSize(12),
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    // borderWidth:2
  },
  organizationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  organizationLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: ScaleSize(13),
  },
  organizationLogo: {
    borderRadius: ScaleSize(14),
  },
  organizationName: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  organizationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  organizationSection: {
    borderRadius: ScaleSize(18),
    gap: ScaleSize(10),
    marginTop: ORGANIZATION_SECTION_GAP,
    padding: ScaleSize(20),
  },
  organizationSlot: {
    alignItems: 'center',
    height: ORGANIZATION_CARD_HEIGHT,
    justifyContent: 'center',
    width: ORGANIZATION_ITEM_WIDTH,
  },
  paginationRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  organizationTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: ScaleSize(10),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  organizationTagText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  organizationValue: {
    color: '#FFFFFF',
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  pointPill: {
    backgroundColor: 'rgba(0,0,0, 0.3)',
    borderRadius: ScaleSize(14),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(5),
  },
  pointText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  useButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: ScaleSize(10),
    height: ScaleSize(46),
    justifyContent: 'center',
    marginTop: ScaleSize(22),
    marginHorizontal: ScaleSize(20),
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  walletName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
