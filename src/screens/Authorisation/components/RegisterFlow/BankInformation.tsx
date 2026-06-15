import { Button } from '@components';
import RegisterHeader from './Header';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const TEXT_COLOR = '#1A1A1A';

const DEFAULT_AMOUNT = 'N';
const DEFAULT_BANK_NAME = '우리은행';
const DEFAULT_ACCOUNT_NUMBER = '8888-00-888888';
const DEFAULT_SCHOOL_NAME = 'OO대학교 생협';

type BankInformationProps = {
  readonly accountNumber?: string;
  readonly amount?: string;
  readonly bankName?: string;
  readonly disabled?: boolean;
  readonly onSubmit: () => void;
  readonly schoolName?: string;
};

function BankInformation({
  accountNumber = DEFAULT_ACCOUNT_NUMBER,
  amount = DEFAULT_AMOUNT,
  bankName = DEFAULT_BANK_NAME,
  disabled = false,
  onSubmit,
  schoolName = DEFAULT_SCHOOL_NAME,
}: BankInformationProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <RegisterHeader />

      <View style={styles.content}>
        <Text style={styles.intro}>{t('bank_information.intro')}</Text>
        <Text style={styles.intro}>
          {t('bank_information.instruction', { amount })}
        </Text>

        <Text style={styles.bankName}>{bankName}</Text>
        <Text style={styles.accountNumber}>{accountNumber}</Text>
        <Text style={styles.schoolName}>{schoolName}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          disabled={disabled}
          onPress={onSubmit}
          style={styles.submitButton}
          testID="bank-information-next"
          title={t('bank_information.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountNumber: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(28),
    fontWeight: '700',
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  bankName: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(18),
    marginTop: ScaleSize(40),
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(32),
    paddingTop: ScaleSize(80),
  },
  footer: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: ScaleSize(10),
    marginBottom: ScaleSize(30),
    width: '100%',
  },
  intro: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(18),
    lineHeight: ScaleSize(28),
    marginBottom: ScaleSize(20),
    textAlign: 'center',
  },
  schoolName: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(15),
    marginTop: ScaleSize(16),
    textAlign: 'center',
  },
  submitButton: {
    alignSelf: 'center',
    width: '90%',
  },
});

export default React.memo(BankInformation);
