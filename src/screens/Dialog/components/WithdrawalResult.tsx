import type { StyleProp, TextStyle } from 'react-native';

import imageNames from '@assets/images/names';
import { Button, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { BankUtils } from '@utils';

const TEXT_COLOR = '#1A1A1A';
const MASCOT_SIZE = ScaleSize(300);
const SEPARATOR_HEIGHT = ScaleSize(10);

type WithdrawalResultProps = {
  readonly onRequestClose: () => void;
  readonly amount: number;
  readonly bankName: string;
  readonly accountNumber: string;
};

type RowProps = {
  readonly title: string;
  readonly value: string;
  readonly valueStyle?: StyleProp<TextStyle>;
};

function Row({ title, value, valueStyle }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function WithdrawalResult({
  onRequestClose,
  amount,
  bankName,
  accountNumber,
}: WithdrawalResultProps) {
  const { t } = useTranslation();
  const onSubmit = () => {
    onRequestClose?.();
  };

  const accountDisplay = useMemo(() => {
    return `${bankName} ${BankUtils.maskShortNumber(accountNumber)}`;
  }, []);

  return (
    <View style={styles.container}>
      <RegisterHeader />

      <ScrollView>
        <View style={styles.content}>
          <Image
            height={MASCOT_SIZE}
            name={imageNames.img_register_success}
            resizeMode="stretch"
            width={MASCOT_SIZE}
          />
          <Text style={styles.desc}>{t('withdrawal.result.title')}</Text>
          <Text style={styles.subDesc}>{t('withdrawal.result.desc')}</Text>

          <View style={styles.summary}>
            <Row
              title={t('withdrawal.amount_section')}
              value={t('common.display_price', {
                amount: formatCurrency(amount),
              })}
              valueStyle={styles.amountValue}
            />
            <View style={styles.line} />
            <Row
              title={t('withdrawal.account_section')}
              value={accountDisplay}
            />
            <Row
              title={t('withdrawal.result.eta_label')}
              value={t('withdrawal.result.eta_value')}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerSeparator} />
          <Button
            onPress={onSubmit}
            style={styles.nextButton}
            testID="withdrawal-result-primary"
            title={t('withdrawal.result.confirm')}
            type="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  amountValue: {
    color: Colors.primary,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    marginTop: ScaleSize(40),
  },
  desc: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(24),
    lineHeight: ScaleSize(26),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(24),
    textAlign: 'center',
  },
  footer: {
    paddingBottom: ScaleSize(24),
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: SEPARATOR_HEIGHT,
    marginBottom: ScaleSize(24),
    width: '100%',
  },
  line: {
    backgroundColor: Colors.gray2,
    height: ScaleSize(1),
    marginVertical: ScaleSize(10),
    width: '100%',
  },
  nextButton: {
    alignSelf: 'center',
    marginBottom: ScaleSize(10),
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: '#718096',
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(26),
  },
  rowValue: {
    color: Colors.black,
    fontSize: ScaleSize(14),
    fontWeight: 'bold',
    lineHeight: ScaleSize(26),
  },
  subDesc: {
    color: Colors.gray4,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(26),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(24),
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#F7F9FC',
    borderRadius: ScaleSize(15),
    marginTop: ScaleSize(30),
    padding: ScaleSize(15),
    width: '100%',
  },
});

export default React.memo(WithdrawalResult);
