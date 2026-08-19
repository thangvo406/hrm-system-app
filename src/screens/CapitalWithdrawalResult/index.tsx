import type { IconName } from '@assets/icons';
import type { RootScreenProps, RootStackParamList } from '@navigation/types';
import type { TransactionResultStatus } from '@navigation/types';

import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { formatCurrency } from '@utils/product';
import dayjs from 'dayjs';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { ifAndroid } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#6B6B6B';
const SCREEN_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const ICON_SIZE = ScaleSize(48);
const SPARKLE_SIZE = ScaleSize(14);
const SPARKLE_SMALL_SIZE = ScaleSize(9);
const DETAIL_ICON_SIZE = ScaleSize(20);
const MEGAPHONE_ICON_SIZE = ScaleSize(38);
const CONFIRM_ICON_SIZE = ScaleSize(20);

type ResultParams = Partial<
  NonNullable<RootStackParamList[Paths.CapitalWithdrawalResult]>
>;

type StatusUiConfig = {
  readonly badgeBg: string;
  readonly badgeText: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly infoBg: string;
};

const UI_CONFIG: Record<TransactionResultStatus, StatusUiConfig> = {
  FAILED: {
    badgeBg: '#FDE0E0',
    badgeText: '#E5484D',
    iconBg: '#FCEAEA',
    iconColor: '#E5484D',
    infoBg: '#FCEAEA',
  },
  PENDING: {
    badgeBg: '#FDEFD5',
    badgeText: Colors.yellow01,
    iconBg: Colors.green09,
    iconColor: Colors.primary,
    infoBg: '#F0FAF0',
  },
  SUCCESS: {
    badgeBg: Colors.green03,
    badgeText: Colors.green01,
    iconBg: Colors.green09,
    iconColor: Colors.primary,
    infoBg: '#F0FAF0',
  },
};

const onConfirm = () => {
  AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
};

const onPressBack = () => {
  AppNavigator.goBack();
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

type SparkleProps = {
  readonly size: number;
  readonly style: object;
};

function Sparkle({ size, style }: SparkleProps) {
  return (
    <Image
      color={Colors.primary}
      height={size}
      name={'ic_sparkle' as IconName}
      style={style}
      type="svg"
      width={size}
    />
  );
}

function CapitalWithdrawalResult(
  props: RootScreenProps<Paths.CapitalWithdrawalResult>,
) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = (AppNavigator.getParams(props) || {}) as ResultParams;
  const {
    amount,
    applicantName,
    applicationId,
    bankInfo,
    currentUnitCount,
    expectedCompletionAt,
    memberId,
    requestedAt,
    totalUnitCountAfter,
    unitCount,
    verifyCode,
  } = params;

  // Refund account: prefer the bankInfo object built by the withdrawal form,
  // fall back to the flat params for callers that only send those.
  const accountHolder = bankInfo?.accountHolder ?? params.accountHolder;
  const accountNumber = bankInfo?.accountNumber ?? params.accountNumber;
  const bankName = bankInfo?.bank?.name ?? params.bankName;
  const bankAndNumber = [bankName, accountNumber].filter(Boolean).join(' ');
  const depositAccount =
    bankAndNumber && accountHolder
      ? `${bankAndNumber} (${accountHolder})`
      : bankAndNumber;

  const status: TransactionResultStatus = params.status ?? 'PENDING';

  const config = UI_CONFIG[status];
  const statusDisplay = status.toLocaleLowerCase();

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <RegisterHeader onBack={onPressBack} showBtnBack />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
          <Sparkle size={SPARKLE_SIZE} style={styles.sparkleTopRight} />
          <Sparkle size={SPARKLE_SMALL_SIZE} style={styles.sparkleLeft} />
          <Sparkle size={SPARKLE_SMALL_SIZE} style={styles.sparkleBottomLeft} />
          <Image
            color={config.iconColor}
            height={ICON_SIZE}
            name="ic_clock"
            type="svg"
            width={ICON_SIZE}
          />
        </View>

        <Text style={styles.title}>
          {t(`capital_withdrawal_result.${statusDisplay}.title`)}
        </Text>
        <Text style={styles.subtitle}>
          {t(`capital_withdrawal_result.${statusDisplay}.subtitle`)}
        </Text>

        <View style={[styles.infoBox, { backgroundColor: config.infoBg }]}>
          <View style={[styles.infoIconWrap, { backgroundColor: CARD_BG }]}>
            <Image
              color={config.iconColor}
              height={MEGAPHONE_ICON_SIZE}
              name="ic_megaphone"
              type="svg"
              width={MEGAPHONE_ICON_SIZE}
            />
          </View>
          <View style={styles.infoTextCol}>
            <Text style={[styles.infoTextStrong, { color: config.iconColor }]}>
              {t(`capital_withdrawal_result.${statusDisplay}.info_line1`)}
            </Text>
            <Text style={[styles.infoTextStrong, { color: config.iconColor }]}>
              {t(`capital_withdrawal_result.${statusDisplay}.info_line2`)}
            </Text>
            <Text style={styles.infoTextMuted}>
              {t(`capital_withdrawal_result.${statusDisplay}.info_line3`)}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View
              style={[
                styles.detailIconWrap,
                { backgroundColor: Colors.green09 },
              ]}
            >
              <Image
                color={Colors.primary}
                height={DETAIL_ICON_SIZE}
                name="ic_order_receipt"
                type="svg"
                width={DETAIL_ICON_SIZE}
              />
            </View>
            <Text style={styles.detailTitle}>
              {t('capital_withdrawal_result.detail_title')}
            </Text>
          </View>
          <View style={styles.divider} />
          {applicationId ? (
            <Row
              label={t('capital_withdrawal_result.application_id')}
              value={applicationId}
            />
          ) : undefined}
          {applicantName || memberId ? (
            <Row
              label={t('capital_withdrawal_result.applicant')}
              value={
                applicantName && memberId
                  ? `${applicantName} (${memberId})`
                  : (applicantName ?? memberId ?? '')
              }
            />
          ) : undefined}
          {unitCount === undefined ? undefined : (
            <Row
              label={t('capital_withdrawal_result.unit_count')}
              value={t('capital_withdrawal_result.unit_value', {
                count: unitCount,
              })}
            />
          )}
          {currentUnitCount === undefined ? undefined : (
            <Row
              label={t('capital_withdrawal_result.current_unit_count')}
              value={t('capital_withdrawal_result.unit_value', {
                count: currentUnitCount,
              })}
            />
          )}
          {totalUnitCountAfter === undefined ? undefined : (
            <Row
              label={t('capital_withdrawal_result.total_unit_count_after')}
              value={t('capital_withdrawal_result.unit_value', {
                count: totalUnitCountAfter,
              })}
            />
          )}
          {amount === undefined ? undefined : (
            <Row
              label={t('capital_withdrawal_result.amount')}
              value={`${formatCurrency(amount)}${t('capital_withdrawal_result.currency_suffix')}`}
            />
          )}
          {depositAccount ? (
            <Row
              label={t('capital_withdrawal_result.deposit_account')}
              value={depositAccount}
            />
          ) : undefined}
          {verifyCode ? (
            <Row
              label={t('capital_withdrawal_result.verify_code')}
              value={verifyCode}
            />
          ) : undefined}
          <Row
            label={t('capital_withdrawal_result.requested_at')}
            value={dayjs(requestedAt).format('YYYY-MM-DD hh:mmA')}
          />
          {expectedCompletionAt ? (
            <Row
              label={t('capital_withdrawal_result.expected_completion_at')}
              value={dayjs(expectedCompletionAt).format('YYYY-MM-DD')}
            />
          ) : undefined}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {t('capital_withdrawal_result.status')}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: config.badgeBg }]}
            >
              <Text
                style={[styles.statusBadgeText, { color: config.badgeText }]}
              >
                {t(`capital_withdrawal_result.${statusDisplay}.status_label`)}
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
          testID="capital-withdrawal-result-confirm-btn"
        >
          <Image
            color={Colors.white}
            height={CONFIRM_ICON_SIZE}
            name="ic_check_circle"
            type="svg"
            width={CONFIRM_ICON_SIZE}
          />
          <Text style={styles.confirmBtnText}>
            {t('capital_withdrawal_result.confirm')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default CapitalWithdrawalResult;

const styles = StyleSheet.create({
  confirmBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(28),
    flexDirection: 'row',
    gap: ScaleSize(8),
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
    paddingVertical: ScaleSize(16),
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  detailIconWrap: {
    alignItems: 'center',
    borderRadius: ScaleSize(18),
    height: ScaleSize(36),
    justifyContent: 'center',
    width: ScaleSize(36),
  },
  detailTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  divider: {
    backgroundColor: '#EFEFEF',
    height: 1,
    marginVertical: ScaleSize(14),
  },
  footer: {
    backgroundColor: SCREEN_BG,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: (ICON_SIZE + 48) / 2,
    height: ICON_SIZE + 48,
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: ICON_SIZE + 48,
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
  infoIconWrap: {
    alignItems: 'center',
    borderRadius: (MEGAPHONE_ICON_SIZE + 20) / 2,
    height: MEGAPHONE_ICON_SIZE + 20,
    justifyContent: 'center',
    width: MEGAPHONE_ICON_SIZE + 20,
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
    fontWeight: '600',
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
  sparkleBottomLeft: {
    bottom: ScaleSize(6),
    left: ScaleSize(10),
    position: 'absolute',
  },
  sparkleLeft: {
    left: ScaleSize(-2),
    position: 'absolute',
    top: '48%',
  },
  sparkleTopRight: {
    position: 'absolute',
    right: ScaleSize(4),
    top: ScaleSize(2),
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
    fontSize: ScaleSize(22),
    fontWeight: '700',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
});
