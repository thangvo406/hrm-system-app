import type { IVoucher } from '@type/account';

// Direct imports, not the '@components' barrel: this folder is re-exported
// from that barrel, so going through it would create an import cycle.
import AppButton from '@components/AppButton';
import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { VOUCHER_TYPES } from '@constants/config';

const ICON_SIZE = ScaleSize(22);
const ACCENT_BAR = Colors.primary;
const BADGE_COLOR = Colors.yellow01;
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = Colors.gray06;

type Properties = {
  readonly onUse: (voucher: IVoucher) => void;
  readonly voucher: IVoucher;
  readonly isExpired?: boolean;
};

function VoucherCard({
  onUse,
  voucher,
  expiredLabel,
  btnUseLabel,
  isExpired,
}: Properties) {
  const { t } = useTranslation();
  const _onUse = () => {
    onUse(voucher);
  };

  const minPaymentText = !voucher.minOrderAmount
    ? t('vouchers.min_payment_none')
    : t('common.display_price', {
        amount: formatCurrency(voucher.minOrderAmount),
      });
  const storeNames = useMemo(() => {
    return voucher?.stores?.map?.(it => it.storeName).join(',');
  }, [JSON.stringify(voucher.stores)]);

  const name = useMemo(() => {
    if (voucher?.type == VOUCHER_TYPES.RATE) {
      return t('vouchers.name_rate', { rate: voucher?.discountRate });
    } else if (voucher?.type == VOUCHER_TYPES.AMOUNT) {
      return t('vouchers.name_amount', {
        amount: formatCurrency(voucher?.discountAmount),
      });
    }
    return '';
  }, [t, voucher]);

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Image
            color={ACCENT_BAR}
            height={ICON_SIZE}
            name="ic_coupon"
            type="svg"
            width={ICON_SIZE}
          />
          <Text numberOfLines={1} style={styles.title}>
            {name}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isExpired
                ? t('vouchers.expired')
                : t('vouchers.dday', { days: voucher.daysRemaining })}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{voucher?.name}</Text>

        <Text style={styles.metaText}>
          {t('vouchers.valid_until', {
            date: dayjs(voucher?.expiredTo).format('YYYY-MM-DD'),
          })}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {t('vouchers.min_payment', { amount: minPaymentText })}
          </Text>
          {!!storeNames && (
            <Text style={styles.metaText} numberOfLines={2}>
              {t('vouchers.applicable_store', {
                store: storeNames,
              })}
            </Text>
          )}
        </View>

        <View style={styles.footerRow}>
          {!isExpired ? (
            <AppButton
              onPress={_onUse}
              style={styles.useButton}
              testID={`voucher-use-${voucher.id}`}
            >
              <Text style={styles.useButtonText}>
                {btnUseLabel || t('vouchers.use_now')}
              </Text>
            </AppButton>
          ) : undefined}
        </View>
      </View>
    </View>
  );
}

export default React.memo(VoucherCard);

const styles = StyleSheet.create({
  accentBar: {
    backgroundColor: ACCENT_BAR,
    borderBottomLeftRadius: ScaleSize(14),
    borderTopLeftRadius: ScaleSize(14),
    width: ScaleSize(6),
  },
  badge: {
    backgroundColor: BADGE_COLOR,
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
  },
  badgeText: {
    color: Colors.white,
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(14),
    elevation: 3,
    flexDirection: 'row',
    marginBottom: ScaleSize(16),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  description: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(10),
  },
  footerRow: {
    alignItems: 'flex-end',
    marginTop: ScaleSize(14),
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(12),
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
  },
  title: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  useButton: {
    alignItems: 'center',
    borderColor: Colors.primary,
    borderRadius: ScaleSize(20),
    borderWidth: ScaleSize(1),
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(8),
  },
  useButtonText: {
    color: Colors.primary,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
