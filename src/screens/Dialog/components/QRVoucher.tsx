import { Button, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '@components/AppButton';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IVoucher } from '@type';
import {
  setBrightnessLevel,
  resetBrightness,
} from '@reeq/react-native-device-brightness';

const QR_SIZE = ScaleSize(200);
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const TICK_INTERVAL_MS = 1000;
const DEFAULT_DURATION_SECONDS = 120;

const formatTime = (total: number) => {
  const safeTotal = Math.max(total, 0);
  const hours = Math.floor(safeTotal / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (safeTotal % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const seconds = safeTotal % SECONDS_PER_MINUTE;

  const segments = [seconds];
  if (hours > 0 || minutes > 0) {
    segments.unshift(minutes);
  }
  if (hours > 0) {
    segments.unshift(hours);
  }

  return segments.map(segment => String(segment).padStart(2, '0')).join(':');
};

type IQRVoucherData = {
  headerBadge?: string;
  amountText?: string;
};

type QRVoucherProps = {
  readonly durationSeconds?: number;
  readonly onPayOtherMethod?: () => void;
  readonly onRefresh?: () => void;
  readonly onRequestClose?: () => void;
  readonly data?: IQRVoucherData & IVoucher;
};

/**
 * Coupon QR rendered full-screen as a Dialog `screen` (show it with
 * `isFullScreen: true`). Fills the screen: title at the top, the coupon card
 * (label, QR, validity countdown, refresh) centered, and the "pay another
 * way" action pinned to the bottom.
 */
function QRVoucher({
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onPayOtherMethod,
  onRefresh,
  onRequestClose,
  ...restProps
}: QRVoucherProps) {
  const { t } = useTranslation();
  const [remaining, setRemaining] = React.useState(durationSeconds);
  const [data, setData] = useState<any>(restProps?.data);

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
    onRefresh?.(_data => {
      setRemaining(durationSeconds);
      setData(prev => ({
        ...prev,
        qrImageBase64: _data?.qrImageBase64,
      }));
    });
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
      {!!data?.headerBadge && (
        <View style={styles.headerBadgeContainer}>
          <Text style={styles.headerBadge}>{data?.headerBadge}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.card}>
          {!!data?.name && <Text style={styles.couponLabel}>{data?.name}</Text>}
          {!!data?.amountText && (
            <Text style={styles.amountLabel}>{data?.amountText}</Text>
          )}
          <Image
            width={QR_SIZE}
            height={QR_SIZE}
            base64={data?.qrImageBase64}
          />

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
  headerBadgeContainer: {
    paddingVertical: ScaleSize(8),
    paddingHorizontal: ScaleSize(15),
    borderRadius: ScaleSize(20),
    backgroundColor: Colors.green03,
    flexWrap: 'wrap',
    alignSelf: 'baseline',
    marginTop: ScaleSize(10),
    marginLeft: ScaleSize(20),
  },
  headerBadge: {
    color: Colors.green02,
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
  amountLabel: {
    color: Colors.gray09,
    fontSize: ScaleSize(12),
    fontWeight: '700',
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(-15),
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
