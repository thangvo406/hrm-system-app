import type { IVoucher } from '@type/account';

import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

const ICON_SIZE = ScaleSize(22);
const ACCENT_BAR = Colors.primary;
const BADGE_COLOR = Colors.yellow01;
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = Colors.gray06;

type Properties = {
  readonly onUse: (voucher: IVoucher) => void;
  readonly voucher: IVoucher;
};

function VoucherCard({ onUse, voucher }: Properties) {
  const { t } = useTranslation();
  const _onUse = () => {
    onUse(voucher);
  };

  const minPaymentText =
    voucher.minPayment === undefined
      ? t('vouchers.min_payment_none')
      : t('common.display_price', { amount: formatCurrency(voucher.minPayment) });

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
            {voucher.title}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t('vouchers.dday', { days: voucher.daysLeft })}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{voucher.description}</Text>

        <Text style={styles.metaText}>
          {t('vouchers.valid_until', { date: voucher.validUntil })}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {t('vouchers.min_payment', { amount: minPaymentText })}
          </Text>
          {voucher.applicableStore !== undefined && (
            <Text style={styles.metaText}>
              {t('vouchers.applicable_store', {
                store: voucher.applicableStore,
              })}
            </Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <AppButton
            onPress={_onUse}
            style={styles.useButton}
            testID={`voucher-use-${voucher.id}`}
          >
            <Text style={styles.useButtonText}>{t('vouchers.use_now')}</Text>
          </AppButton>
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
