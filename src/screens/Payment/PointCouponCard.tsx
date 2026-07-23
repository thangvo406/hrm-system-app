import type { IPaymentCoupon } from '@hooks/usePayment';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

const COUPON_ICON_SIZE = ScaleSize(20);
const CHEVRON_SIZE = ScaleSize(16);
const ACCENT_COLOR = '#2DB34A';

type Properties = {
  readonly coupon: IPaymentCoupon;
  readonly onSelectCoupon: () => void;
  readonly onUsePoint: () => void;
  readonly pointHolding: number;
  readonly pointUsed: number;
};

function PointCouponCard({
  coupon,
  onSelectCoupon,
  onUsePoint,
  pointHolding,
  pointUsed,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {t('payment.point_coupon_label')}
      </Text>

      <View style={styles.card}>
        <AppButton
          onPress={onSelectCoupon}
          style={styles.row}
          testID="payment-select-coupon"
        >
          <View style={styles.rowLeft}>
            <Image
              color="#E24C4C"
              height={COUPON_ICON_SIZE}
              name="ic_coupon"
              type="svg"
              width={COUPON_ICON_SIZE}
            />
            <Text style={styles.rowLabel}>{t('payment.select_coupon')}</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.couponValue}>{coupon.name}</Text>
            <Image
              color={ACCENT_COLOR}
              height={CHEVRON_SIZE}
              name="ic_chevron_right"
              type="svg"
              width={CHEVRON_SIZE}
            />
          </View>
        </AppButton>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>{t('payment.use_point')}</Text>
            <Text style={styles.holdingLabel}>
              {t('payment.point_holding', {
                amount: formatCurrency(pointHolding),
              })}
            </Text>
          </View>
          <AppButton
            onPress={onUsePoint}
            style={styles.pointPill}
            testID="payment-use-point"
          >
            <Text style={styles.pointPillText}>
              {`${formatCurrency(pointUsed)} ${t('payment.point_unit')}`}
            </Text>
          </AppButton>
        </View>
      </View>
    </View>
  );
}

export default React.memo(PointCouponCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(18),
  },
  couponValue: {
    color: ACCENT_COLOR,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  divider: {
    backgroundColor: '#F0F0F0',
    height: 1,
  },
  holdingLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  pointPill: {
    alignItems: 'center',
    backgroundColor: '#2DB34A',
    borderRadius: ScaleSize(8),
    justifyContent: 'center',
    minWidth: ScaleSize(96),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(12),
  },
  pointPillText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(18),
  },
  rowLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  rowRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  section: {
    marginTop: ScaleSize(24),
  },
  sectionLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
});
