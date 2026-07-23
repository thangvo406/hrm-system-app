import { Button, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '@components/AppButton';
import QRCode from 'react-native-qrcode-svg';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IVoucher } from '@type';
import {
  setBrightnessLevel,
  resetBrightness,
} from '@reeq/react-native-device-brightness';

const QR_SIZE = ScaleSize(200);
const SECONDS_PER_MINUTE = 60;
const TICK_INTERVAL_MS = 1000;
const DEFAULT_DURATION_SECONDS = 120;

const formatTime = (total: number) => {
  const minutes = Math.floor(total / SECONDS_PER_MINUTE);
  const seconds = total % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

type QRVoucherProps = {
  readonly durationSeconds?: number;
  readonly onPayOtherMethod?: () => void;
  readonly onRefresh?: () => void;
  readonly onRequestClose?: () => void;
  readonly data?: IVoucher;
};

/**
 * Coupon QR rendered full-screen as a Dialog `screen` (show it with
 * `isFullScreen: true`). Fills the screen: title at the top, the coupon card
 * (label, QR, validity countdown, refresh) centered, and the "pay another
 * way" action pinned to the bottom.
 */
function QRVoucher({
  data,
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onPayOtherMethod,
  onRefresh,
  onRequestClose,
}: QRVoucherProps) {
  const { t } = useTranslation();
  const [remaining, setRemaining] = React.useState(durationSeconds);

  useEffect(() => {
    setBrightnessLevel(1);
    return () => {
      resetBrightness();
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(previous => (previous > 0 ? previous - 1 : 0));
    }, TICK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const onPressRefresh = () => {
    setRemaining(durationSeconds);
    onRefresh?.();
  };

  const onPressPayOther = () => {
    onPayOtherMethod?.();
    onRequestClose?.();
  };

  return (
    <View style={styles.safeArea}>
      <HeaderDetail
        onPressBack={onRequestClose}
        hideNotify
        usePaddingTop={false}
        title={t('qr_voucher.title')}
      />

      <View style={styles.content}>
        <View style={styles.card}>
          {!!data?.title && (
            <Text style={styles.couponLabel}>{data?.title}</Text>
          )}

          <QRCode size={QR_SIZE} value={data?.applicableStore} />

          <Text style={styles.validTime}>
            {t('qr_voucher.valid_time', { time: formatTime(remaining) })}
          </Text>

          <AppButton onPress={onPressRefresh} testID="qr-voucher-refresh">
            <Text style={styles.refresh}>{t('qr_voucher.refresh')}</Text>
          </AppButton>
        </View>
        <Button
          onPress={onPressPayOther}
          testID="qr-voucher-pay-other"
          title={`‹ ${t('qr_voucher.pay_other_method')}`}
          type="outline-green"
          style={{
            marginTop: ScaleSize(30),
          }}
        />
      </View>
    </View>
  );
}

export default React.memo(QRVoucher);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(32),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(24),
  },
  couponLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginBottom: ScaleSize(24),
  },
  footer: {
    paddingVertical: ScaleSize(16),
  },
  refresh: {
    color: Colors.gray06,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(10),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginTop: ScaleSize(8),
  },
  validTime: {
    color: Colors.green02,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(24),
  },
});
