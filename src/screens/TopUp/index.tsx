import { AppButton, HeaderDetail, Image } from '@components';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import imageNames from '@assets/images/names';
import { PAYMENT_METHODS, useTopUp } from '@hooks';
import { formatCurrency } from '@utils/product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const TEXT_HINT = '#AAAAAA';
const BORDER_COLOR = '#E0E0E0';
const GREEN = Colors.primary;
const GREEN_BG = '#F0FAF0';
const ICON_SIZE = ScaleSize(44);
const CHECK_SIZE = ScaleSize(16);
const LOCK_SIZE = ScaleSize(18);
const SHIELD_SIZE = ScaleSize(22);
const WALLET_SIZE = ScaleSize(120);

type MethodCardProps = {
  readonly icon: 'ic_credit_card' | 'ic_bank';
  readonly isSelected: boolean;
  readonly onPress: () => void;
  readonly subtitle: string;
  readonly testID: string;
  readonly title: string;
};

function MethodCard({
  icon,
  isSelected,
  onPress,
  subtitle,
  testID,
  title,
}: MethodCardProps) {
  return (
    <AppButton
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.methodCard, isSelected && styles.methodCardSelected]}
      testID={testID}
    >
      <View
        style={[
          styles.methodIconWrap,
          isSelected && styles.methodIconWrapSelected,
        ]}
      >
        <Image height={ICON_SIZE} name={icon} width={ICON_SIZE} />
      </View>
      <View style={styles.methodInfo}>
        <Text
          style={[styles.methodTitle, isSelected && styles.methodTitleSelected]}
        >
          {title}
        </Text>
        <Text style={styles.methodSubtitle}>{subtitle}</Text>
      </View>
      <View
        style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
      >
        {isSelected ? <View style={styles.radioInner} /> : undefined}
      </View>
    </AppButton>
  );
}

function TopUp() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    amountTopUp,
    enabledBtnSubmit,
    methodPayment,
    onAmountChange,
    setMethodPayment,
    onSubmit,
  } = useTopUp();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('top_up.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBanner}>
          <Text style={styles.heroText}>{t('top_up.description')}</Text>
          <Image
            height={WALLET_SIZE}
            name={imageNames.ic_right_topup}
            width={WALLET_SIZE}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>{t('top_up.amount_label')}</Text>

          <View style={styles.inputRow}>
            <Image
              height={ScaleSize(28)}
              name={imageNames.ic_wallet_top_up}
              width={ScaleSize(28)}
            />
            <TextInput
              keyboardType="numeric"
              onChangeText={onAmountChange}
              placeholder={t('top_up.amount_placeholder')}
              placeholderTextColor={TEXT_HINT}
              style={styles.input}
              testID="top-up-amount-input"
              value={formatCurrency(amountTopUp, false)}
            />
            <Text style={styles.currencyLabel}>{t('top_up.currency')}</Text>
          </View>

          <View style={styles.minHintWrap}>
            <Text style={styles.minHintText}>
              {t('top_up.min_amount_hint')}
            </Text>
          </View>

          <Text style={[styles.sectionLabel, styles.methodLabel]}>
            {t('top_up.payment_method_label')}
          </Text>

          <MethodCard
            icon="ic_credit_card_green"
            isSelected={methodPayment === PAYMENT_METHODS.CREDIT_CARD}
            onPress={() => setMethodPayment(PAYMENT_METHODS.CREDIT_CARD)}
            subtitle={t('top_up.method_credit_card_desc')}
            testID="top-up-method-credit-card"
            title={t('top_up.method_credit_card')}
          />

          <MethodCard
            icon="ic_bank_green"
            isSelected={methodPayment === PAYMENT_METHODS.VIRTUAL_ACCOUNT}
            onPress={() => setMethodPayment(PAYMENT_METHODS.VIRTUAL_ACCOUNT)}
            subtitle={t('top_up.method_virtual_account_desc')}
            testID="top-up-method-virtual-account"
            title={t('top_up.method_virtual_account')}
          />

          <View style={styles.securityNote}>
            <Image
              height={SHIELD_SIZE}
              name={imageNames.ic_protect_green}
              width={SHIELD_SIZE}
            />
            <Text style={styles.securityText}>{t('top_up.security_note')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom }]}>
        <AppButton
          style={[styles.nextBtn, !enabledBtnSubmit && styles.nextBtnDisabled]}
          testID="top-up-next"
          onPress={onSubmit}
        >
          <Image
            color={enabledBtnSubmit ? '#FFFFFF' : '#AAAAAA'}
            height={LOCK_SIZE}
            name="lock"
            type="svg"
            width={LOCK_SIZE}
          />
          <Text
            style={[
              styles.nextBtnText,
              !enabledBtnSubmit && styles.nextBtnTextDisabled,
            ]}
          >
            {t('top_up.next')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default TopUp;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  currencyLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    // paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  heroBanner: {
    alignItems: 'center',
    backgroundColor: GREEN_BG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(20),
  },
  heroText: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    lineHeight: ScaleSize(30),
    marginRight: ScaleSize(12),
  },
  input: {
    // color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(16),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(0),
  },
  inputRow: {
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  methodCard: {
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(14),
    borderWidth: 1.5,
    flexDirection: 'row',
    marginBottom: ScaleSize(12),
    padding: ScaleSize(16),
  },
  methodCardSelected: {
    backgroundColor: GREEN_BG,
    borderColor: GREEN,
  },
  methodIconWrap: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: ScaleSize(10),
    height: ScaleSize(56),
    justifyContent: 'center',
    marginRight: ScaleSize(14),
    width: ScaleSize(56),
  },
  methodIconWrapSelected: {
    backgroundColor: '#E0F2E0',
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    marginTop: ScaleSize(24),
  },
  methodSubtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(2),
  },
  methodTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  methodTitleSelected: {
    color: GREEN,
  },
  minHintText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  minHintWrap: {
    alignItems: 'center',
    backgroundColor: GREEN_BG,
    borderRadius: ScaleSize(20),
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(6),
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: GREEN,
    borderRadius: ScaleSize(28),
    flexDirection: 'row',
    gap: ScaleSize(8),
    height: ScaleSize(52),
    justifyContent: 'center',
    width: '100%',
  },
  nextBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  nextBtnTextDisabled: {
    color: '#AAAAAA',
  },
  radioInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(5),
    height: ScaleSize(8),
    width: ScaleSize(8),
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderRadius: CHECK_SIZE / 2,
    borderWidth: 1.5,
    height: CHECK_SIZE,
    justifyContent: 'center',
    width: CHECK_SIZE,
  },
  radioOuterSelected: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
  },
  securityNote: {
    alignItems: 'center',
    backgroundColor: GREEN_BG,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  securityText: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(13),
  },
  sectionLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginBottom: ScaleSize(12),
  },
});
