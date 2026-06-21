import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import { Animated, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StoreItem } from '@type/store';

const CARD_OVERLAP = ScaleSize(68);
const CARD_BORDER_RADIUS = ScaleSize(16);
const CARD_HORIZONTAL_INSET = ScaleSize(16);
const LOGO_BORDER_RADIUS = ScaleSize(12);
const LOGO_BORDER_COLOR = '#5BB85C';
const LOGO_SIZE = ScaleSize(56);
const META_ICON_SIZE = ScaleSize(14);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = Colors.gray1;

type Properties = {
  readonly storeInfo?: StoreItem;
  readonly titleOpacity?: Animated.AnimatedInterpolation<number>;
};

function StoreInfo({
  storeInfo = undefined,
  titleOpacity = undefined,
}: Properties) {
  const { t } = useTranslation();
  const titleStyle = titleOpacity
    ? [styles.storeName, { opacity: titleOpacity }]
    : styles.storeName;

  const minOrderText = storeInfo?.minOrder
    ? `${t('product_detail.min_order_label')}: ${ProductUtils.formatCurrency(storeInfo.minOrder)}`
    : '';

  const logoUri = storeInfo?.logo?.fileUrl;
  const hasMeta = Boolean(storeInfo?.estimateTime || minOrderText);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.logoWrap}>
          {logoUri ? (
            <Image
              height={LOGO_SIZE}
              resizeMode="cover"
              style={styles.logoImage}
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
          <Animated.Text numberOfLines={2} style={titleStyle}>
            {storeInfo?.name}
          </Animated.Text>
          {hasMeta ? (
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
                  <Text style={styles.metaText}>{storeInfo.estimateTime}</Text>
                </View>
              ) : undefined}
              {minOrderText ? (
                <Text style={styles.metaText}>{minOrderText}</Text>
              ) : undefined}
            </View>
          ) : undefined}
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
