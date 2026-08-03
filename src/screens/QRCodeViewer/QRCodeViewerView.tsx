import { Button, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '@components/AppButton';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IVoucher } from '@type';
import {
  setBrightnessLevel,
  resetBrightness,
} from '@reeq/react-native-device-brightness';
import { formatTime } from '@utils/date';

const QR_SIZE = ScaleSize(200);
const TICK_INTERVAL_MS = 1000;
const DEFAULT_DURATION_SECONDS = 120;

export type IQRCodeViewerData = {
  readonly amountText?: string;
  readonly headerBadge?: string;
  readonly expiresIn?: number;
  readonly qrImageBase64?: string;
} & Partial<IVoucher>;

export type QRCodeViewerViewProps = {
  readonly data?: IQRCodeViewerData;
  readonly durationSeconds?: number;
  readonly titleKey?: string;
  readonly titleVoucher?: string;
  readonly showPayOther?: boolean;
  readonly onPayOtherMethod?: () => void;
  readonly onRefresh?: (
    onRefreshed: (data?: IQRCodeViewerData) => void,
  ) => void;
  readonly onRequestClose?: () => void;
};

function QRCodeViewerView({
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onPayOtherMethod,
  onRefresh,
  onRequestClose,
  showPayOther,
  titleVoucher,
  titleKey = 'qr_voucher.title',
  ...restProps
}: QRCodeViewerViewProps) {
  const { t } = useTranslation();
  const incomingData = restProps?.data;
  const [remaining, setRemaining] = useState(durationSeconds);
  const [data, setData] = useState<IQRCodeViewerData | undefined>(incomingData);
  const remainingId = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    setBrightnessLevel(1);
    return () => {
      resetBrightness();
    };
  }, []);

  useEffect(() => {
    setData(incomingData);
  }, [incomingData]);

  const startRunningRemaining = useCallback((seconds: number) => {
    clearInterval(remainingId.current);
    setRemaining(Math.max(seconds, 0));
    remainingId.current = setInterval(() => {
      setRemaining(previous => (previous > 0 ? previous - 1 : 0));
    }, TICK_INTERVAL_MS);
  }, []);

  useEffect(() => {
    startRunningRemaining(incomingData?.expiresIn ?? durationSeconds);

    return () => clearInterval(remainingId.current);
  }, [durationSeconds]);

  const onPressRefresh = () => {
    onRefresh?.(refreshed => {
      setData(previous => ({ ...previous, ...refreshed }));
      startRunningRemaining(refreshed?.expiresIn ?? durationSeconds);
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
        title={t(titleKey)}
      />
      {!!data?.headerBadge && (
        <View style={styles.headerBadgeContainer}>
          <Text style={styles.headerBadge}>{data?.headerBadge}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.card}>
          {!!titleVoucher && (
            <Text style={styles.couponLabel}>{titleVoucher}</Text>
          )}
          {!!data?.amountText && (
            <Text style={styles.amountLabel}>{data?.amountText}</Text>
          )}
          <Image
            width={QR_SIZE}
            height={QR_SIZE}
            base64={data?.qrImageBase64 ?? ''}
          />

          <Text style={styles.validTime}>
            {t('qr_voucher.valid_time', { time: formatTime(remaining) })}
          </Text>

          <AppButton onPress={onPressRefresh} testID="qr-code-viewer-refresh">
            <Text style={styles.refresh}>{t('qr_voucher.refresh')}</Text>
          </AppButton>
        </View>
        {!!showPayOther && (
          <Button
            onPress={onPressPayOther}
            testID="qr-code-viewer-pay-other"
            title={`‹ ${t('qr_voucher.pay_other_method')}`}
            type="outline-green"
            style={styles.payOtherButton}
          />
        )}
      </View>
    </View>
  );
}

export default React.memo(QRCodeViewerView);

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
  payOtherButton: {
    marginTop: ScaleSize(30),
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
  validTime: {
    color: Colors.green02,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(24),
  },
});
