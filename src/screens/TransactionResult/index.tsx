import type { IconName } from '@assets/icons';
import type {
  RootScreenProps,
  TransactionResultStatus,
} from '@navigation/types';

import { AppButton, Image } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#6B6B6B';
const SCREEN_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const ICON_SIZE = ScaleSize(74);

type StatusUiConfig = {
  readonly badgeBg: string;
  readonly badgeText: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly iconName: IconName;
  readonly infoBg: string;
  readonly infoIconName?: IconName;
  readonly infoStrongColor: string;
};

const UI_CONFIG: Record<TransactionResultStatus, StatusUiConfig> = {
  FAILED: {
    badgeBg: '#FDE0E0',
    badgeText: '#E5484D',
    iconBg: '#FCEAEA',
    iconColor: '#E5484D',
    iconName: 'x-circle',
    infoBg: '#FCEAEA',
    infoStrongColor: TEXT_DARK,
  },
  PENDING: {
    badgeBg: '#FDEFD5',
    badgeText: Colors.yellow01,
    iconBg: '#E8F5E8',
    iconColor: Colors.primary,
    iconName: 'ic_clock',
    infoBg: '#F0FAF0',
    infoStrongColor: Colors.green01,
  },
  SUCCESS: {
    badgeBg: Colors.green03,
    badgeText: Colors.green01,
    iconBg: '#E8F5E8',
    iconColor: Colors.primary,
    iconName: 'ic_check_circle',
    infoBg: '#F0FAF0',
    infoIconName: 'ic_info',
    infoStrongColor: Colors.green01,
  },
};

const { ifAndroid } = DeviceUtils;

const onPressBack = () => {
  AppNavigator.goBack();
};

const onConfirm = () => {
  AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
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

function TransactionResult(props: RootScreenProps<Paths.TransactionResult>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    amount,
    errorCode,
    paymentMethod,
    requestedAt,
    isContribute,
    ...params
  } = AppNavigator.getParams(props) || {};

  const status: TransactionResultStatus = params?.status ?? 'PENDING';
  const statusDisplay = status.toLocaleLowerCase();
  const prefixKeyTranslate = isContribute ? '.contribute.' : '.';

  const config = UI_CONFIG[status];
  const mutedLine = (() => {
    if (status === 'FAILED') {
      return errorCode
        ? t('transaction_result.error_code', { code: errorCode })
        : undefined;
    }
    if (status === 'SUCCESS') {
      return '';
    }
    return t(
      `transaction_result${prefixKeyTranslate}${statusDisplay}.info_line3`,
    );
  })();

  const line2 = (() => {
    if (status === 'SUCCESS') {
      return !isContribute
        ? ''
        : t(
            `transaction_result${prefixKeyTranslate}${statusDisplay}.info_line2`,
          );
    }
    return t(
      `transaction_result${prefixKeyTranslate}${statusDisplay}.info_line2`,
    );
  })();

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <RegisterHeader onBack={onPressBack} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
          <Image
            color={config.iconColor}
            height={ICON_SIZE}
            name={config.iconName}
            type="svg"
            width={ICON_SIZE}
          />
        </View>

        <Text style={styles.title}>
          {t(`transaction_result${prefixKeyTranslate}${statusDisplay}.title`)}
        </Text>
        <Text style={styles.subtitle}>
          {t(
            `transaction_result${prefixKeyTranslate}${statusDisplay}.subtitle`,
          )}
        </Text>

        <View style={[styles.infoBox, { backgroundColor: config.infoBg }]}>
          {config.infoIconName ? (
            <Image
              color={config.infoStrongColor}
              height={ScaleSize(20)}
              name={config.infoIconName}
              type="svg"
              width={ScaleSize(20)}
            />
          ) : undefined}
          <View style={styles.infoTextCol}>
            <Text
              style={[styles.infoTextStrong, { color: config.infoStrongColor }]}
            >
              {t(
                `transaction_result${prefixKeyTranslate}${statusDisplay}.info_line1`,
              )}
            </Text>
            {line2 ? (
              <Text
                style={[
                  styles.infoTextStrong,
                  { color: config.infoStrongColor },
                ]}
              >
                {line2}
              </Text>
            ) : undefined}
            {mutedLine ? (
              <Text style={styles.infoTextMuted}>{mutedLine}</Text>
            ) : undefined}
          </View>
        </View>

        <View style={styles.detailCard}>
          <Row
            label={t(
              `transaction_result${prefixKeyTranslate}contribution_amount`,
            )}
            value={`${amount.toLocaleString('ko-KR')}원`}
          />
          <Row
            label={t(`transaction_result${prefixKeyTranslate}payment_method`)}
            value={paymentMethod}
          />
          <Row
            label={t(`transaction_result${prefixKeyTranslate}payment_time`)}
            value={dayjs(requestedAt).format('YYYY-MM-DD hh:mmA')}
          />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {t(`transaction_result${prefixKeyTranslate}status`)}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: config.badgeBg }]}
            >
              <Text
                style={[styles.statusBadgeText, { color: config.badgeText }]}
              >
                {t(
                  `transaction_result${prefixKeyTranslate}${statusDisplay}.status_label`,
                )}
              </Text>
            </View>
          </View>
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
          testID="transaction-result-confirm-btn"
        >
          <Text style={styles.confirmBtnText}>
            {t('transaction_result.close')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default TransactionResult;

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
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(28),
  },
  detailCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(16),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(8),
  },
  footer: {
    backgroundColor: SCREEN_BG,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: (ICON_SIZE + 40) / 2,
    height: ICON_SIZE + 40,
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: ICON_SIZE + 40,
  },
  infoBox: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  infoTextCol: {
    flex: 1,
    gap: ScaleSize(6),
  },
  infoTextMuted: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(2),
  },
  infoTextStrong: {
    fontSize: ScaleSize(14),
    fontWeight: '500',
    lineHeight: ScaleSize(20),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  rowValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  statusBadgeText: {
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
});
