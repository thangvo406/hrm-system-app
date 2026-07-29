import { AppButton, Image } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import { ProductUtils } from '@utils';
import dayjs from 'dayjs';
import { TransactionResultStatus } from '@navigation/types';

const { ifAndroid } = DeviceUtils;
const { formatCurrency } = ProductUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#8C8C8C';
const CARD_BG = '#F5F6F8';
const ICON_SIZE = ScaleSize(48);

type StatusUiConfig = {
  iconColor: string;
  iconName: string;
  title: string;
  titleColor: string;
  amountColor: string;
};
type RowProps = {
  readonly label: string;
  readonly value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const UI_CONFIG: Record<TransactionResultStatus, StatusUiConfig> = {
  FAILED: {
    iconColor: '#E5484D',
    iconName: 'x-circle',
    title: 'transaction_result.top_up.fail_title',
    titleColor: '#E5484D',
    amountColor: '#D32F2F',
  },
  PENDING: {
    iconColor: Colors.primary,
    iconName: 'ic_clock',
    title: 'transaction_result.top_up.pending_title',
    titleColor: Colors.primary,
    amountColor: '#c9c42e',
  },
  SUCCESS: {
    iconColor: Colors.primary,
    iconName: 'ic_check_filled',
    title: 'transaction_result.top_up.success_title',
    titleColor: Colors.primary,
    amountColor: Colors.primary,
  },
};

function TopUp(props: any) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    bankName,
    onHandleGoBack,
    paymentMethodNumber,
    bonusAmount,
    amount,
    completedAt,
    status,
  } = props || {};
  const onConfirm = () => {
    AppNavigator.goBack();
    onHandleGoBack?.();
  };
  const config = UI_CONFIG[status];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Image
          color={config.iconColor}
          height={ICON_SIZE}
          name={config.iconName}
          type="svg"
          width={ICON_SIZE}
        />

        <Text style={[styles.title, { color: config.titleColor }]}>
          {t(config.title)}
        </Text>
        <Text style={[styles.amount, { color: config.amountColor }]}>
          {t('common.display_price', {
            amount: formatCurrency(amount),
          })}
        </Text>

        <View style={styles.detailCard}>
          <Row
            label={t('transaction_result.top_up.account')}
            value={`${bankName || ''} ${paymentMethodNumber || ''}`}
          />
          <Row
            label={t('transaction_result.top_up.amount')}
            value={t('common.display_price', {
              amount: formatCurrency(amount),
            })}
          />
          <Row
            label={t('transaction_result.top_up.bonus')}
            value={`+${t('common.display_price', {
              amount: formatCurrency(bonusAmount),
            })}`}
          />
          <Row
            label={t('transaction_result.top_up.charged_at')}
            value={dayjs(completedAt).format('YYYY-MM-DD HH:mm')}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom + ScaleSize(12)) },
        ]}
      >
        <AppButton
          onPress={onConfirm}
          style={styles.confirmBtn}
          testID="top-up-result-confirm-btn"
        >
          <Text style={styles.confirmBtnText}>
            {t('transaction_result.close')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default TopUp;

const styles = StyleSheet.create({
  amount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(28),
    fontWeight: '700',
    marginTop: ScaleSize(12),
    textAlign: 'center',
  },
  confirmBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(28),
    height: ScaleSize(52),
    justifyContent: 'center',
    width: '100%',
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(40),
  },
  detailCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    marginTop: ScaleSize(28),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(8),
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(10),
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
  },
  rowValue: {
    color: TEXT_DARK,
    flexShrink: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    textAlign: 'right',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
});
