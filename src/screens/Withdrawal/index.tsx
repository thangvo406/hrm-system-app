import { Button, HeaderDetail, TextField } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants';
import { DeviceUtils } from '@kits/core/utils';
import { formatCurrency } from '@utils/product';
import { useWithdrawal } from '@hooks/useWithdrawal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BalanceCard from './BalanceCard';
import BankSelector from './BankSelector';
import NoticeBox from './NoticeBox';

const { ifAndroid } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const BORDER_COLOR = '#E0E0E0';

function Withdrawal() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    amount,
    bonusAmount,
    enabledBtnSubmit,
    onAccountNumberChange,
    onAmountChange,
    onSubmit,
    selectedBank,
    setAccountHolder,
    onPressBank,
    walletBalance,
    withdrawableAmount,
  } = useWithdrawal();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('withdrawal.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('withdrawal.title')}</Text>

        <BalanceCard
          bonusAmount={bonusAmount}
          walletBalance={walletBalance ?? 0}
          withdrawableAmount={withdrawableAmount}
        />

        <Text style={styles.sectionLabel}>
          {t('withdrawal.amount_section')}
        </Text>
        <TextField
          inputWrapperStyle={styles.amountWrapper}
          keyboardType="numeric"
          onChangeText={onAmountChange}
          placeholder={t('withdrawal.amount_placeholder')}
          renderRightComponent={() => (
            <View style={styles.unitGroup}>
              <View style={styles.unitDivider} />
              <Text style={styles.unitText}>{t('withdrawal.currency')}</Text>
            </View>
          )}
          style={styles.amountInput}
          testID="withdrawal-amount"
          value={formatCurrency(amount)}
        />

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
            keyboardType="numbers-and-punctuation"
            onChangeText={onAccountNumberChange}
            placeholder={t('withdrawal.account_number_placeholder')}
            testID="withdrawal-account-number"
            showClear
          />
          <TextField
            onChangeText={setAccountHolder}
            placeholder={t('withdrawal.account_holder_placeholder')}
            testID="withdrawal-account-holder"
            showClear
          />
        </View>

        <NoticeBox />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom || 20) },
        ]}
      >
        <Button
          disabled={!enabledBtnSubmit}
          onPress={onSubmit}
          testID="withdrawal-submit"
          title={t('withdrawal.submit')}
        />
      </View>
    </View>
  );
}

export default Withdrawal;

const styles = StyleSheet.create({
  amountInput: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    paddingVertical: ScaleSize(14),
    textAlign: 'right',
  },
  amountWrapper: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  accountCard: {
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    gap: ScaleSize(10),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  accountTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(2),
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
    marginBottom: ScaleSize(18),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  sectionLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
    marginTop: ScaleSize(24),
  },
  unitDivider: {
    backgroundColor: Colors.primary,
    height: ScaleSize(22),
    width: 1,
  },
  unitGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  unitText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(15),
  },
});
