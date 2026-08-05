import type { IAccount } from '@type';

import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import CardActions from './CardActions';
import Pill from './Pill';
import {
  ACCENT_INK,
  ACCENT_SURFACE,
  CARD_GRADIENTS,
  MUTED_INK,
  ROW_GAP,
  ROW_PADDING,
  ROW_RADIUS,
  ROW_SURFACE,
  THUMBNAIL_RADIUS,
  TITLE_INK,
  WARNING_INK,
  WARNING_SURFACE,
} from './tokens';
import { BankUtils } from '@utils';

const THUMBNAIL_WIDTH = ScaleSize(96);
const THUMBNAIL_HEIGHT = ScaleSize(72);

const { formatExpiry, isActiveStatus, maskFullNumber, maskShortNumber } =
  BankUtils;

type Properties = {
  readonly card: IAccount;
  readonly cardIndex: number;
  readonly onRemove?: (card: IAccount) => void;
  readonly onSettings?: (card: IAccount) => void;
};

function PaymentCardRow({ card, cardIndex, onRemove, onSettings }: Properties) {
  const { t } = useTranslation();

  const colors = CARD_GRADIENTS[cardIndex % CARD_GRADIENTS.length];
  const expiry = formatExpiry(card.expiryMonth, card.expiryYear);
  const isActive = isActiveStatus(card.status);

  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <LinearGradient
          colors={[...colors]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.thumbnail}
        >
          <Text numberOfLines={1} style={styles.thumbnailBrand}>
            {card.provider?.toUpperCase()}
          </Text>
          <View style={styles.thumbnailFooter}>
            <Text style={styles.thumbnailNumber}>
              {maskShortNumber(card.displayNumber)}
            </Text>
            {/* <Text style={styles.thumbnailExpiry}>{expiry}</Text> */}
          </View>
        </LinearGradient>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {card.displayName}
          </Text>
          <Text numberOfLines={1} style={styles.number}>
            {card.holderName}
          </Text>
          <Text numberOfLines={1} style={styles.number}>
            {maskFullNumber(card.displayNumber)}
          </Text>
          {expiry === undefined ? undefined : (
            <Text style={styles.expiry}>
              {t('account_management.expires', { value: expiry })}
            </Text>
          )}
          <Pill
            ink={isActive ? ACCENT_INK : WARNING_INK}
            label={t(
              isActive
                ? 'account_management.status_active'
                : 'account_management.status_inactive',
            )}
            showDot
            surface={isActive ? ACCENT_SURFACE : WARNING_SURFACE}
          />
        </View>
        <View style={styles.topRight}>
          {card?.default ? (
            <Pill
              ink={ACCENT_INK}
              label={t('account_management.primary')}
              surface={ACCENT_SURFACE}
            />
          ) : undefined}
        </View>
      </View>

      <View style={styles.actions}>
        <CardActions
          direction="row"
          onRemove={() => onRemove?.(card)}
          onSettings={() => onSettings?.(card)}
          testIDSuffix={`-card-${card.id}`}
        />
      </View>
    </View>
  );
}

export default React.memo(PaymentCardRow);

const styles = StyleSheet.create({
  actions: {
    paddingTop: ROW_GAP,
  },
  topRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  expiry: {
    color: MUTED_INK,
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(8),
  },
  info: {
    flex: 1,
    gap: ScaleSize(3),
  },
  name: {
    color: TITLE_INK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  number: {
    color: '#5C5C5C',
    fontSize: ScaleSize(13),
  },
  row: {
    backgroundColor: ROW_SURFACE,
    borderRadius: ROW_RADIUS,
    padding: ROW_PADDING,
  },
  thumbnail: {
    borderRadius: THUMBNAIL_RADIUS,
    height: THUMBNAIL_HEIGHT,
    justifyContent: 'space-between',
    padding: ScaleSize(8),
    width: THUMBNAIL_WIDTH,
  },
  thumbnailBrand: {
    color: '#FFFFFF',
    fontSize: ScaleSize(12),
    fontWeight: '800',
    letterSpacing: ScaleSize(0.5),
  },
  thumbnailExpiry: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: ScaleSize(10),
    fontWeight: '600',
    lineHeight: ScaleSize(13),
  },
  thumbnailFooter: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScaleSize(10),
  },
  thumbnailNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    // color: 'white',
    fontSize: ScaleSize(10),
    fontWeight: '600',
    lineHeight: ScaleSize(13),
  },
  top: {
    flexDirection: 'row',
    gap: ROW_GAP,
  },
});
