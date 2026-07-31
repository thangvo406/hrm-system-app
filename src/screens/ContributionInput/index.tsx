import { AppButton, HeaderDetail } from '@components';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { formatCurrency } from '@utils/product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceUtils } from '@kits/core/utils';
import { CardSelection } from '@components';
import { useTopUp } from '@hooks';
import AppNavigator from '@navigation/AppNavigator';
import BankInformationView from '@screens/BankInformation/BankInformationView';

const { ifAndroid } = DeviceUtils;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH - ScaleSize(64);
const CARD_HEIGHT = ScaleSize(92);

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const TEXT_HINT = '#C4C4C4';
const BORDER_COLOR = '#E0E0E0';
const GREEN = Colors.primary;

function ContributionInput() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    amountTopUp,
    bankAccounts,
    selectedAccountId,
    enabledBtnSubmit,
    isEnablePaymentCard,
    onAmountChange,
    onSelectAccount,
    onSubmit,
  } = useTopUp({ isContribute: true });

  if (!isEnablePaymentCard) {
    return (
      <BankInformationView
        showBtnBack
        onBack={AppNavigator.goBack}
        onSubmit={AppNavigator.goBack}
        btnSubmit={t('common.popup.btn_close')}
      />
    );
  }

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('contribution_input.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {t('contribution_input.subtitle')}
          </Text>

          <Text style={styles.sectionLabel}>
            {t('contribution_input.amount_label')}
          </Text>
          <View style={styles.amountRow}>
            <TextInput
              keyboardType="numeric"
              onChangeText={onAmountChange}
              placeholder="0"
              placeholderTextColor={TEXT_HINT}
              style={styles.amountInput}
              testID="contribution-input-amount-input"
              value={formatCurrency(amountTopUp)}
            />
            <Text style={styles.currencyLabel}>{t('top_up.currency')}</Text>
          </View>
        </View>

        {bankAccounts.length > 0 ? (
          <View style={styles.carouselWrap}>
            <CardSelection
              accounts={bankAccounts}
              onSelect={onSelectAccount}
              selectedId={selectedAccountId}
            />
          </View>
        ) : undefined}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom || 20) },
        ]}
      >
        <AppButton
          onPress={onSubmit}
          style={[styles.nextBtn, !enabledBtnSubmit && styles.nextBtnDisabled]}
          testID="contribution-input-next"
        >
          <Text style={styles.nextBtnText}>{t('contribution_input.next')}</Text>
        </AppButton>
      </View>
    </View>
  );
}

export default ContributionInput;

const styles = StyleSheet.create({
  accountField: {
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  accountFieldText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
  },
  amountInput: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(30),
    fontWeight: '700',
    padding: 0,
  },
  amountRow: {
    alignItems: 'flex-end',
    borderBottomColor: GREEN,
    borderBottomWidth: ScaleSize(2),
    flexDirection: 'row',
    paddingBottom: ScaleSize(10),
  },
  bonusText: {
    color: GREEN,
    fontSize: ScaleSize(13),
    fontWeight: '600',
    marginTop: ScaleSize(10),
  },
  carousel: {
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  carouselWrap: {
    alignSelf: 'center',
    marginTop: ScaleSize(56),
    width: SCREEN_WIDTH,
  },
  cardSlot: {
    alignItems: 'center',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    width: ITEM_WIDTH,
  },
  content: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  currencyLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginLeft: ScaleSize(8),
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  heading: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  methodLabel: {
    marginTop: ScaleSize(28),
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: GREEN,
    borderRadius: ScaleSize(28),
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
  paginationRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(12),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
  },
  sectionLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    fontWeight: '600',
    marginBottom: ScaleSize(12),
    marginTop: ScaleSize(24),
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
});
