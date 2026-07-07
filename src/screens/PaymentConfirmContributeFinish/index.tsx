import type { RootScreenProps } from '@navigation/types';

import { AppButton, Image } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import Header from './Header';
import { Paths } from '@navigation/paths';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#6B6B6B';
const SCREEN_BG = '#F2F2F2';
const CARD_BG = '#FFFFFF';
const INFO_BG = '#F0FAF0';
const CLOCK_ICON_BG = '#E8F5E8';
const CLOCK_ICON_SIZE = ScaleSize(120);
const STATUS_ORANGE = '#F5A623';

const onConfirm = () => {
  AppNavigator.navigate(Paths.Contribution);
};

type RowProps = {
  readonly label: string;
  readonly value: string;
  readonly valueStyle?: object;
};

function Row({ label, value, valueStyle }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function PaymentConfirmContributeFinish({
  route,
}: RootScreenProps<Paths.PaymentConfirmContributeFinish>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const amount = route.params?.amount ?? 0;
  const paymentMethod = route.params?.paymentMethod ?? '';
  const paymentTime = route.params?.paymentTime ?? '';

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconWrap}>
          <Image
            height={CLOCK_ICON_SIZE}
            name={imageNames.ic_clock_green}
            width={CLOCK_ICON_SIZE}
          />
        </View>

        <Text style={styles.title}>
          {t('payment_confirm_contribute_finish.title')}
        </Text>
        <Text style={styles.subtitle}>
          {t('payment_confirm_contribute_finish.subtitle')}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('payment_confirm_contribute_finish.info_line1')}
          </Text>
          <Text style={styles.infoText}>
            {t('payment_confirm_contribute_finish.info_line2')}
          </Text>
          <Text style={styles.infoText}>
            {t('payment_confirm_contribute_finish.info_line3')}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Row
            label={t('payment_confirm_contribute_finish.contribution_amount')}
            value={`${amount.toLocaleString('ko-KR')}원`}
          />
          <View style={styles.divider} />
          <Row
            label={t('payment_confirm_contribute_finish.payment_method')}
            value={paymentMethod}
          />
          <View style={styles.divider} />
          <Row
            label={t('payment_confirm_contribute_finish.payment_time')}
            value={paymentTime}
          />
          <View style={styles.divider} />
          <Row
            label={t('payment_confirm_contribute_finish.status')}
            value={t('payment_confirm_contribute_finish.status_processing')}
            valueStyle={styles.statusText}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + ScaleSize(12) },
        ]}
      >
        <AppButton
          onPress={onConfirm}
          style={styles.confirmBtn}
          testID="payment-confirm-contribute-finish-btn"
        >
          <Text style={styles.confirmBtnText}>
            {t('payment_confirm_contribute_finish.confirm')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default PaymentConfirmContributeFinish;

const styles = StyleSheet.create({
  confirmBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(28),
    height: ScaleSize(52),
    justifyContent: 'center',
    width: '100%',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(50),
  },
  detailCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(8),
  },
  divider: {
    backgroundColor: '#F0F0F0',
    height: 1,
  },
  footer: {
    backgroundColor: SCREEN_BG,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: CLOCK_ICON_BG,
    borderRadius: ScaleSize(40),
    height: ScaleSize(80),
    justifyContent: 'center',
    marginBottom: ScaleSize(50),
    width: ScaleSize(80),
  },
  infoBox: {
    alignSelf: 'stretch',
    backgroundColor: INFO_BG,
    borderRadius: ScaleSize(10),
    gap: ScaleSize(4),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  infoText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(18),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(14),
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  rowValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  statusText: {
    color: STATUS_ORANGE,
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(18),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(28),
    fontWeight: '700',
    textAlign: 'center',
  },
});
