import { Button, HeaderDetail, TextField } from '@components';
import { ScaleSize } from '@kits/core';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '@constants';
import { DeviceUtils } from '@kits/core/utils';
import { formatCurrency } from '@utils/product';
import { useRefundRequest } from '@hooks/useRefundRequest';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BalanceCard from './BalanceCard';
import BankSelector from './BankSelector';
import NoticeBox from './NoticeBox';

const { ifAndroid } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const BORDER_COLOR = '#E0E0E0';

function RefundRequest() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    accountHolder,
    accountNumber,
    amount,
    banks,
    bonusAmount,
    enabledBtnSubmit,
    onAccountNumberChange,
    onAmountChange,
    onRefundAll,
    onSubmit,
    refundableAmount,
    selectedBank,
    setAccountHolder,
    setSelectedBank,
    walletBalance,
  } = useRefundRequest();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('refund_request.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('refund_request.title')}</Text>

        <BalanceCard
          bonusAmount={bonusAmount}
          refundableAmount={refundableAmount}
          walletBalance={walletBalance}
        />

        <Text style={styles.sectionLabel}>
          {t('refund_request.amount_section')}
        </Text>
        <TextField
          keyboardType="numeric"
          onChangeText={onAmountChange}
          placeholder={t('refund_request.amount_placeholder')}
          renderRightComponent={() => (
            <TouchableOpacity onPress={onRefundAll} testID="refund-all">
              <Text style={styles.refundAll}>
                {t('refund_request.refund_all')}
              </Text>
            </TouchableOpacity>
          )}
          testID="refund-amount"
          value={formatCurrency(amount)}
        />

        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>
            {t('refund_request.account_section')}
          </Text>
          <BankSelector
            banks={banks}
            onSelect={setSelectedBank}
            placeholder={t('refund_request.bank_placeholder')}
            selectedBank={selectedBank}
          />
          <TextField
            keyboardType="numbers-and-punctuation"
            onChangeText={onAccountNumberChange}
            placeholder={t('refund_request.account_number_placeholder')}
            testID="refund-account-number"
            value={accountNumber}
          />
          <TextField
            onChangeText={setAccountHolder}
            placeholder={t('refund_request.account_holder_placeholder')}
            testID="refund-account-holder"
            value={accountHolder}
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
          testID="refund-submit"
          title={t('refund_request.submit')}
        />
      </View>
    </View>
  );
}

export default RefundRequest;

const styles = StyleSheet.create({
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
  refundAll: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '700',
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
});
