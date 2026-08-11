import type { KeyboardEvent } from 'react-native';

import { AppButton, HeaderDetail, Image, TextField } from '@components';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { useCapitalWithdrawal } from '@hooks';
import { formatCurrency } from '@utils/product';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import HeroSection from '../ContributionInput/HeroSection';
import MemberSummaryCard from '../ContributionInput/MemberSummaryCard';
import UnitsInputCard from '../ContributionInput/UnitsInputCard';
import BankSelector from '../Withdrawal/BankSelector';
import WithdrawalTypeCard from './WithdrawalTypeCard';

const { ifAndroid, isIOS, isIPadOrTablet } = DeviceUtils;

const PAGE_BG = '#F5F6F4';
const TEXT_DARK = '#1A1A1A';
const INFO_BG = '#EAF2FD';
const INFO_BORDER = '#D6E4FA';
const INFO_TEXT = '#3D4B63';
const INFO_BLUE_ICON = '#3B82F6';
const CAUTION_BG = '#FFF8E9';
const CAUTION_BORDER = '#F6E7C6';
const CAUTION_ORANGE = '#F5A623';
const BTN_GREEN = '#2F9E44';
const BTN_DISABLED = '#C9CFC9';
const CARD_SHADOW = 'rgba(23, 68, 33, 0.08)';
const BANNER_ICON_SIZE = ScaleSize(24);
const CHEVRON_SIZE = ScaleSize(18);
const KEYBOARD_ANIMATION_DURATION_MS = 250;

function CapitalWithdrawal() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const {
    amount,
    currentContribution,
    currentUnits,
    enabledBtnSubmit,
    expectedContribution,
    expectedUnits,
    membershipLabel,
    onAccountNumberChange,
    onAmountChange,
    onPressBank,
    onSubmit,
    selectedBank,
    setAccountHolder,
    setWithdrawalType,
    unitPrice,
    withdrawalType,
  } = useCapitalWithdrawal();

  useEffect(() => {
    if (isIPadOrTablet()) {
      return;
    }
    const showEvent = isIOS() ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS() ? 'keyboardWillHide' : 'keyboardDidHide';

    // Shift the content up by half the keyboard height so the focused units
    // input stays visible (same pattern as ChooseMemberShipType).
    const onShow = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        toValue: -event.endCoordinates.height / 2,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title="" transparent />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.avoidingView,
            { transform: [{ translateY: keyboardOffset }] },
          ]}
        >
          <HeroSection
            subtitle={t('capital_withdrawal.hero_subtitle')}
            title={t('capital_withdrawal.hero_title')}
          />

          <View style={styles.content}>
            <MemberSummaryCard
              contributionAmount={t('contribution_input.current_units_amount', {
                amount: formatCurrency(currentContribution),
              })}
              contributionUnits={t('contribution_input.current_units_value', {
                count: currentUnits,
              })}
              membershipLabel={membershipLabel}
            />

          

            <View style={styles.typeCardWrap}>
              <WithdrawalTypeCard
                onSelect={setWithdrawalType}
                selected={withdrawalType}
              />
            </View>

            <View style={styles.inputCardWrap}>
              <UnitsInputCard
                amount={amount}
                expectedAmountText={t('contribution_input.amount_won', {
                  amount: formatCurrency(expectedContribution),
                })}
                expectedUnitsText={t('contribution_input.units_count', {
                  count: expectedUnits,
                })}
                onAmountChange={onAmountChange}
                unitPriceText={t('contribution_input.amount_won', {
                  amount: formatCurrency(unitPrice),
                })}
              />
            </View>

            <View style={styles.accountCard}>
              <Text style={styles.accountTitle}>
                {t('withdrawal.account_section')}
              </Text>
              <BankSelector
                onSelect={onPressBank}
                placeholder={t('withdrawal.bank_placeholder')}
                selectedBank={selectedBank}
              />
              <TextField
                onChangeText={onAccountNumberChange}
                placeholder={t('withdrawal.account_number_placeholder')}
                testID="capital-withdrawal-account-number"
                showClear
                returnKeyType="done"
                keyboardType="number-pad"
              />
              <TextField
                onChangeText={setAccountHolder}
                placeholder={t('withdrawal.account_holder_placeholder')}
                testID="capital-withdrawal-account-holder"
                returnKeyType="done"
                showClear
              />
            </View>
            <View style={styles.infoBanner}>
              <Image
                color={INFO_BLUE_ICON}
                height={BANNER_ICON_SIZE}
                name="ic_info"
                type="svg"
                width={BANNER_ICON_SIZE}
              />
              <Text style={styles.infoText}>
                {t('capital_withdrawal.info_banner')}
              </Text>
            </View>

            <View style={styles.cautionBanner}>
              <Image
                color={CAUTION_ORANGE}
                height={BANNER_ICON_SIZE}
                name="ic_alert_triangle"
                type="svg"
                width={BANNER_ICON_SIZE}
              />
              <View style={styles.cautionTexts}>
                <Text style={styles.cautionTitle}>
                  {t('contribution_input.caution_title')}
                </Text>
                <Text style={styles.cautionDesc}>
                  {`•  ${t('contribution_input.caution_desc')}`}
                </Text>
              </View>
            </View>

          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom || 20) },
        ]}
      >
        <AppButton
          disabled={!enabledBtnSubmit}
          onPress={onSubmit}
          style={[
            styles.submitBtn,
            !enabledBtnSubmit && styles.submitBtnDisabled,
          ]}
          testID="contribution-input-submit"
        >
          <Text style={styles.submitBtnText}>
            {t('contribution_input.submit')}
          </Text>
          <Image
            color="#FFFFFF"
            height={CHEVRON_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={CHEVRON_SIZE}
          />
        </AppButton>
      </View>
    </View>
  );
}

export default CapitalWithdrawal;

const styles = StyleSheet.create({
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    elevation: 4,
    gap: ScaleSize(10),
    marginTop: ScaleSize(18),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
    shadowColor: CARD_SHADOW,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: ScaleSize(12),
  },
  accountTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(2),
  },
  avoidingView: {
    flex: 1,
  },
  cautionBanner: {
    backgroundColor: CAUTION_BG,
    borderColor: CAUTION_BORDER,
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(1),
    flexDirection: 'row',
    marginTop: ScaleSize(14),
    padding: ScaleSize(16),
  },
  cautionDesc: {
    color: TEXT_DARK,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(6),
  },
  cautionTexts: {
    flex: 1,
    marginLeft: ScaleSize(10),
  },
  cautionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
  footer: {
    backgroundColor: PAGE_BG,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  infoBanner: {
    alignItems: 'center',
    backgroundColor: INFO_BG,
    borderColor: INFO_BORDER,
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(1),
    flexDirection: 'row',
    marginTop: ScaleSize(18),
    padding: ScaleSize(16),
  },
  infoText: {
    color: INFO_TEXT,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    lineHeight: ScaleSize(21),
    marginLeft: ScaleSize(10),
  },
  inputCardWrap: {
    marginTop: ScaleSize(18),
  },
  typeCardWrap: {
    marginTop: ScaleSize(14),
  },
  safeArea: {
    backgroundColor: PAGE_BG,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: BTN_GREEN,
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    height: ScaleSize(58),
    justifyContent: 'center',
    width: '100%',
  },
  submitBtnDisabled: {
    backgroundColor: BTN_DISABLED,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(18),
    fontWeight: '800',
    marginRight: ScaleSize(6),
  },
});
