import { AppButton, HeaderDetail } from '@components';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { formatCurrency } from '@utils/product';
import { DeviceUtils } from '@kits/core/utils';
const { ifAndroid } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const PLACEHOLDER_COLOR = '#CCCCCC';
const BORDER_COLOR = '#E0E0E0';

function ContributionInput() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');

  const isEnabled = amount.length > 0;

  const onAmountChange = (text: string) => {
    const digits = text.replaceAll(/\D/g, '');
    setAmount(digits);
  };

  const onNext = () => {
    AppNavigator.navigate(Paths.ConfirmPaymentContribution, {
      amount: Number(amount),
    });
  };

  return (
    <View style={styles.container}>
      <HeaderDetail title={t('contribution_input.title')} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('contribution_input.subtitle')}</Text>
        <Text style={styles.label}>{t('contribution_input.amount_label')}</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={onAmountChange}
          placeholder={t('contribution_input.amount_placeholder')}
          placeholderTextColor={PLACEHOLDER_COLOR}
          style={styles.input}
          testID="contribution-input-amount"
          value={formatCurrency(amount)}
        />
        <View style={styles.inputUnderline} />
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom + ScaleSize(12)) },
        ]}
      >
        <AppButton
          disabled={!isEnabled}
          onPress={isEnabled ? onNext : undefined}
          style={[styles.nextBtn, !isEnabled && styles.nextBtnDisabled]}
          testID="contribution-input-next"
        >
          <Text
            style={[
              styles.nextBtnText,
              !isEnabled && styles.nextBtnTextDisabled,
            ]}
          >
            {t('contribution_input.next')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default ContributionInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(32),
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  input: {
    color: TEXT_DARK,
    fontSize: ScaleSize(28),
    fontWeight: '300',
    paddingVertical: ScaleSize(12),
    textAlign: 'center',
    width: '100%',
  },
  inputUnderline: {
    backgroundColor: BORDER_COLOR,
    height: 1,
  },
  label: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(32),
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
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
  nextBtnTextDisabled: {
    color: '#AAAAAA',
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
});
