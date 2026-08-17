import type { SharedValue } from 'react-native-reanimated';

import { Image, ProgressiveImage } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { IStoreItem } from '@type/store';
import isNumber from 'lodash/isNumber';
import { trimSeconds } from '@utils/date';
import StoreClosedBanner from './StoreClosedBanner';

const CARD_OVERLAP = ScaleSize(68);
const CARD_BORDER_RADIUS = ScaleSize(16);
const CARD_HORIZONTAL_INSET = ScaleSize(16);
const LOGO_BORDER_RADIUS = ScaleSize(12);
const LOGO_BORDER_COLOR = '#5BB85C';
const LOGO_SIZE = ScaleSize(56);
const META_ICON_SIZE = ScaleSize(14);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = Colors.gray1;
const COLLAPSE_TITLE_START = 0.8;
// API trả giờ dạng HH:mm:ss — cắt 3 ký tự cuối (`:ss`) để hiển thị HH:mm.

type Properties = {
  readonly collapseScroll?: number;
  readonly isOutsideOpenHour?: boolean;
  readonly scrollY?: SharedValue<number>;
  readonly storeInfo?: IStoreItem;
};

function StoreInfo({
  collapseScroll = 0,
  isOutsideOpenHour = false,
  scrollY = undefined,
  storeInfo = undefined,
}: Properties) {
  const { t } = useTranslation();

  // Fades the in-list store name out as the collapsed header title fades in.
  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY || collapseScroll <= 0) {
      return { opacity: 1 };
    }
    return {
      opacity: interpolate(
        scrollY.value,
        [collapseScroll * COLLAPSE_TITLE_START, collapseScroll],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });

  const minOrderText = isNumber(storeInfo?.minOrder)
    ? `${t('product_detail.min_order_label')}: ${ProductUtils.formatCurrency(storeInfo.minOrder)}`
    : '';

  const openTime = useMemo(() => {
    let text = '';
    if (storeInfo?.openingTime) {
      text = trimSeconds(storeInfo.openingTime);
    }
    if (storeInfo?.closedTime) {
      text += `-${trimSeconds(storeInfo.closedTime)}`;
    }
    return text;
  }, [storeInfo?.closedTime, storeInfo?.openingTime]);
  const logoUri = storeInfo?.logo?.fileUrl;
  const hasMeta = storeInfo?.estimateTime || minOrderText || openTime;

  if (!storeInfo) {
    return <></>;
  }

  return (
    <View style={styles.wrapper}>
      {isOutsideOpenHour ? (
        <StoreClosedBanner storeInfo={storeInfo} />
      ) : undefined}

      <View style={[styles.card, isOutsideOpenHour && styles.cardBelowBanner]}>
        <View style={styles.logoWrap}>
          {logoUri ? (
            <ProgressiveImage
              height={LOGO_SIZE}
              resizeMode="cover"
              imageStyle={styles.logoImage}
              url={logoUri}
              width={LOGO_SIZE}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Image
                color={TEXT_MUTED}
                height={ScaleSize(28)}
                name="ic_store"
                type="svg"
                width={ScaleSize(28)}
              />
            </View>
          )}
        </View>
        <View style={styles.details}>
          <Animated.Text
            numberOfLines={2}
            style={[styles.storeName, titleAnimatedStyle]}
          >
            {storeInfo?.name}
          </Animated.Text>
          {hasMeta ? (
            <>
              <View style={styles.metaRow}>
                {storeInfo?.estimateTime ? (
                  <View style={styles.metaItem}>
                    <Image
                      color={TEXT_MUTED}
                      height={META_ICON_SIZE}
                      name="ic_clock"
                      type="svg"
                      width={META_ICON_SIZE}
                    />
                    <Text style={styles.metaText}>
                      {storeInfo.estimateTime}
                    </Text>
                  </View>
                ) : undefined}
                {minOrderText ? (
                  <Text style={styles.metaText}>{minOrderText}</Text>
                ) : undefined}
              </View>
              {!!openTime && (
                <Text style={styles.metaText}>
                  {t('stores.open_hours', { time: openTime })}
                </Text>
              )}
            </>
          ) : undefined}
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {storeInfo.receiveMethod?.map(item => (
              <View key={item} style={styles.containerDeliver}>
                <Text style={styles.labelDeliver}>
                  {t(`stores.delivery_label.${item?.toLowerCase()}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default React.memo(StoreInfo);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_BORDER_RADIUS,
    elevation: 6,
    flexDirection: 'row',
    gap: ScaleSize(12),
    padding: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: ScaleSize(4), width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: ScaleSize(12),
  },
  cardBelowBanner: {
    marginTop: -ScaleSize(12),
  },
  containerDeliver: {
    paddingVertical: ScaleSize(3),
    paddingHorizontal: ScaleSize(8),
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(30),
    marginRight: ScaleSize(10),
  },
  labelDeliver: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
    gap: ScaleSize(6),
    justifyContent: 'center',
  },
  logoImage: {
    borderRadius: LOGO_BORDER_RADIUS,
    height: LOGO_SIZE,
    width: LOGO_SIZE,
  },
  logoPlaceholder: {
    alignItems: 'center',
    backgroundColor: Colors.gray3,
    borderRadius: LOGO_BORDER_RADIUS,
    height: LOGO_SIZE,
    justifyContent: 'center',
    width: LOGO_SIZE,
  },
  logoWrap: {
    borderColor: LOGO_BORDER_COLOR,
    borderRadius: LOGO_BORDER_RADIUS + ScaleSize(2),
    borderWidth: ScaleSize(2),
    height: LOGO_SIZE + ScaleSize(4),
    overflow: 'hidden',
    // padding: ScaleSize(2),
    width: LOGO_SIZE + ScaleSize(4),
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(12),
  },
  metaText: {
    color: TEXT_MUTED,
    flexShrink: 1,
    fontSize: ScaleSize(13),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(17),
    fontWeight: '700',
  },
  wrapper: {
    marginHorizontal: CARD_HORIZONTAL_INSET,
    marginTop: -CARD_OVERLAP,
  },
});
