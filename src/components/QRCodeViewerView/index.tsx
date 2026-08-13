import AppButton from '@components/AppButton';
import HeaderDetail from '@components/HeaderDetail';
import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import {
  resetBrightness,
  setBrightnessLevel,
} from '@reeq/react-native-device-brightness';

import imageNames from '@assets/images/names';
import type { IQRCodeViewerData } from '@type';
import { formatTime } from '@utils/date';

import NoticeBar from './NoticeBar';
import ScanFrame from './ScanFrame';
import TicketHead from './TicketHead';
import ValidityMeter from './ValidityMeter';
import { DeviceUtils } from '@kits/core/utils';
const { ifIOS } = DeviceUtils;
const QR_SIZE = ScaleSize(240);
const TICK_INTERVAL_MS = 1000;
const DEFAULT_DURATION_SECONDS = 300;

const BADGE_SIZE = ScaleSize(54);
const FOOT_NOTCH_SIZE = ScaleSize(26);
const TICKET_RADIUS = ScaleSize(24);
const VOUCHER_ICON_SIZE = ScaleSize(24);
// Diameter of the two circles bitten out of the ticket's waist.
const WAIST_NOTCH_SIZE = ScaleSize(22);

const BADGE_SHADOW_OFFSET = { height: ScaleSize(4), width: 0 };

const NOTCH_RIM_COLOR = 'rgba(15, 75, 37, 0.06)';

export type QRCodeViewerViewHandle = {
  readonly close: () => void;
  readonly refresh: () => void;
  readonly checkRefresh: () => void;
  readonly setMounted: (value: boolean) => void;
  readonly restartTimer: (seconds?: number) => void;
  readonly setData: (data?: IQRCodeViewerData) => void;
};

export type QRCodeViewerViewProps = {
  readonly data?: IQRCodeViewerData;
  readonly durationSeconds?: number;
  readonly ref?: Ref<QRCodeViewerViewHandle>;
  readonly titleKey?: string;
  readonly contentStyle?: ViewStyle;
  readonly titleVoucher?: string;
  readonly btnVoucher?: string;
  readonly subtitle?: string;
  readonly showBtnVoucher?: boolean;
  readonly showIconVoucher?: boolean;
  readonly onPressVoucher?: () => void;
  readonly onRefresh?: (
    onRefreshed: (data?: IQRCodeViewerData) => void,
  ) => void;
  readonly onRequestClose?: () => void;
};

function QRCodeViewerView({
  durationSeconds = DEFAULT_DURATION_SECONDS,
  onRefresh,
  onRequestClose,
  ref,
  showBtnVoucher,
  titleVoucher,
  onPressVoucher,
  btnVoucher,
  subtitle,
  titleKey = 'qr_voucher.title',
  contentStyle,
  showIconVoucher = true,
  ...restProps
}: QRCodeViewerViewProps) {
  const { t } = useTranslation();
  const incomingData = restProps?.data;
  const [remaining, setRemaining] = useState(durationSeconds);
  const [data, setData] = useState<IQRCodeViewerData | undefined>(incomingData);
  const remainingId = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setBrightnessLevel(1);
    return () => {
      isMounted.current = false;
      resetBrightness();
    };
  }, []);

  useEffect(() => {
    setData(incomingData);
  }, [incomingData]);

  useEffect(() => {
    if (isMounted.current && remaining == 0) {
      onPressRefresh();
    }
  }, [remaining]);

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

  const applyRefreshedData = useCallback(
    (refreshed?: IQRCodeViewerData) => {
      setData(previous => ({ ...previous, ...refreshed }));
      startRunningRemaining(refreshed?.expiresIn ?? durationSeconds);
    },
    [durationSeconds, startRunningRemaining],
  );

  const onPressRefresh = useCallback(() => {
    onRefresh?.(applyRefreshedData);
  }, [applyRefreshedData, onRefresh]);

  useImperativeHandle(
    ref,
    () => ({
      close: () => {
        onRequestClose?.();
      },
      checkRefresh: () => {
        if (remaining == 0) {
          onPressRefresh();
        }
      },
      refresh: onPressRefresh,
      restartTimer: (seconds?: number) => {
        startRunningRemaining(seconds ?? durationSeconds);
      },
      setData: applyRefreshedData,
      setMounted: (value: boolean) => (isMounted.current = value),
    }),
    [
      applyRefreshedData,
      durationSeconds,
      remaining,
      onPressRefresh,
      onRequestClose,
      startRunningRemaining,
    ],
  );

  const _onPressVoucher = () => {
    onRequestClose?.();
    onPressVoucher?.();
  };

  return (
    <View style={styles.screen}>
      <HeaderDetail
        hideNotify
        onPressBack={onRequestClose}
        title={t(titleKey)}
        usePaddingTop={false}
      />

      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticketWrap}>
          {/* Sits in the wrap's top padding, so it straddles the ticket edge
              without ever drawing outside its parent (Android clips that). */}
          {/* <View style={styles.badge}>
            <Image
              color={Colors.green08}
              height={BADGE_ICON_SIZE}
              name="ic_leaf"
              type="svg"
              width={BADGE_ICON_SIZE}
            />
          </View> */}

          <View style={styles.ticket}>
            <TicketHead
              amountText={data?.amountText}
              badge={data?.headerBadge}
              subtitle={subtitle || t('qr_voucher.show_to_staff')}
              title={titleVoucher}
            />

            {/* Collapsed row: the notches ride the seam wherever the head ends. */}
            <View style={styles.waist}>
              <View style={[styles.notch, styles.notchLeft]} />
              <View style={[styles.notch, styles.notchRight]} />
            </View>

            <View style={styles.stub}>
              <ScanFrame value={data?.token} size={QR_SIZE} />

              <ValidityMeter
                label={t('qr_voucher.valid_label')}
                onPressRefresh={onPressRefresh}
                value={formatTime(remaining)}
              />

              <View style={styles.divider}>
                <View style={styles.dividerDash} />
              </View>
              <View>
                <View
                  style={[
                    styles.notch,
                    styles.notchLeft,
                    {
                      left: ScaleSize(-28),
                      top: ScaleSize(-30),
                    },
                  ]}
                />
                <View
                  style={[
                    styles.notch,
                    styles.notchRight,
                    {
                      right: ScaleSize(-28),
                      top: ScaleSize(-30),
                    },
                  ]}
                />
              </View>
              {!!showBtnVoucher && (
                <AppButton
                  onPress={_onPressVoucher}
                  style={styles.voucherButton}
                  testID="qr-code-viewer-voucher"
                >
                  {!!showIconVoucher && (
                    <Image
                      height={VOUCHER_ICON_SIZE}
                      name={imageNames.ic_vouchers}
                      tintColor={Colors.green02}
                      width={VOUCHER_ICON_SIZE}
                    />
                  )}
                  <Text style={styles.voucherLabel}>
                    {btnVoucher || t('qr_voucher.btn_return_voucher')}
                  </Text>
                </AppButton>
              )}
              <NoticeBar text={t('qr_voucher.auto_expire_notice')} />
            </View>

            <View style={styles.footNotch} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default React.memo(QRCodeViewerView);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(17),
    height: BADGE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: Colors.black,
    shadowOffset: BADGE_SHADOW_OFFSET,
    shadowOpacity: 0.12,
    shadowRadius: ScaleSize(6),
    top: 0,
    width: BADGE_SIZE,
    zIndex: 3,
  },
  content: {
    flexGrow: 1,
    // justifyContent: 'center',
    paddingBottom: ScaleSize(28),
    paddingHorizontal: ScaleSize(20),
  },
  // A one-pixel window onto a fully dashed box, so only its top edge shows —
  // RN will not draw a dashed border on a single side.
  divider: {
    height: ScaleSize(1),
    marginVertical: ScaleSize(18),
    overflow: 'hidden',
  },
  dividerDash: {
    borderColor: Colors.green05,
    borderRadius: ScaleSize(1),
    borderStyle: 'dashed',
    borderWidth: ScaleSize(1),
    height: ScaleSize(3),
  },
  footNotch: {
    backgroundColor: Colors.green11,
    borderColor: NOTCH_RIM_COLOR,
    borderRadius: FOOT_NOTCH_SIZE / 2,
    bottom: -FOOT_NOTCH_SIZE / 2,
    height: FOOT_NOTCH_SIZE,
    left: '50%',
    marginLeft: -FOOT_NOTCH_SIZE / 2,
    position: 'absolute',
    width: FOOT_NOTCH_SIZE,
  },
  notch: {
    backgroundColor: Colors.green11,
    // borderColor: NOTCH_RIM_COLOR,
    borderRadius: WAIST_NOTCH_SIZE / 2,
    // borderWidth: ScaleSize(1),
    height: WAIST_NOTCH_SIZE,
    position: 'absolute',
    top: 0,
    width: WAIST_NOTCH_SIZE,
  },
  notchLeft: {
    left: -WAIST_NOTCH_SIZE / 2,
  },
  notchRight: {
    right: -WAIST_NOTCH_SIZE / 2,
  },

  screen: {
    backgroundColor: Colors.green11,
    flex: 1,
  },
  stub: {
    borderBottomLeftRadius: TICKET_RADIUS,
    borderBottomRightRadius: TICKET_RADIUS,
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  ticket: {
    backgroundColor: Colors.white,
    borderRadius: TICKET_RADIUS,
  },

  ticketWrap: {
    marginTop: ScaleSize(ifIOS(12, 40)),
    // paddingTop: BADGE_SIZE / 2,
  },
  voucherButton: {
    alignItems: 'center',
    borderColor: Colors.green02,
    borderRadius: ScaleSize(12),
    borderWidth: ScaleSize(1),
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    // marginTop: ScaleSize(28),
    paddingVertical: ScaleSize(8),
    marginBottom: ScaleSize(15),
  },
  voucherLabel: {
    color: Colors.green02,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  // Full-height so the circles stay within it vertically, then pulled back to
  // zero net height by the margins.
  waist: {
    height: WAIST_NOTCH_SIZE,
    marginBottom: -WAIST_NOTCH_SIZE / 2,
    marginTop: -WAIST_NOTCH_SIZE / 2,
    zIndex: 2,
  },
});
