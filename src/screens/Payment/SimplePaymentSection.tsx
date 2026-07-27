import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { EASY_PAY_METHODS } from '@constants/config';

const CIRCLE_SIZE = ScaleSize(44);
const CARD_HEIGHT = ScaleSize(104);

type SimpleMethod = {
  readonly cardBg: string;
  readonly cardBorder: string;
  readonly circleBg: string;
  readonly id: string;
  readonly labelColor: string;
  readonly labelKey: string;
  readonly letter: string;
  readonly letterColor: string;
};

const METHODS: readonly SimpleMethod[] = [
  {
    cardBg: '#FFFDF2',
    cardBorder: '#EFE7C4',
    circleBg: '#FEE500',
    id: EASY_PAY_METHODS.KAKAOPAY,
    labelColor: '#1A1A1A',
    labelKey: 'payment.kakao_pay',
    letter: 'K',
    letterColor: '#191919',
  },
  {
    cardBg: '#EAF7EF',
    cardBorder: '#CFEBD9',
    circleBg: '#03C75A',
    id: EASY_PAY_METHODS.NAVERPAY,
    labelColor: '#3B8B57',
    labelKey: 'payment.naver_pay',
    letter: 'N',
    letterColor: '#FFFFFF',
  },
  {
    cardBg: '#EAF1FE',
    cardBorder: '#CFE0FB',
    circleBg: '#3182F6',
    id: EASY_PAY_METHODS.TOSSPAY,
    labelColor: '#3F72C4',
    labelKey: 'payment.toss_pay',
    letter: 'T',
    letterColor: '#FFFFFF',
  },
];

type OptionProps = {
  readonly method: SimpleMethod;
  readonly onPress: (id: string) => void;
  readonly selected: boolean;
};

function SimplePaymentOption({ method, onPress, selected }: OptionProps) {
  const { t } = useTranslation();

  return (
    <AppButton
      onPress={() => onPress(method.id)}
      style={styles.option}
      testID={`payment-simple-method-${method.id}`}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: method.cardBg, borderColor: method.cardBorder },
          selected && {
            borderColor: method.circleBg,
            borderWidth: ScaleSize(2),
          },
        ]}
      >
        <View style={[styles.circle, { backgroundColor: method.circleBg }]}>
          <Text style={[styles.letter, { color: method.letterColor }]}>
            {method.letter}
          </Text>
        </View>
        <Text style={[styles.label, { color: method.labelColor }]}>
          {t(method.labelKey)}
        </Text>
      </View>
    </AppButton>
  );
}

function SimplePaymentSection() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(METHODS[0].id);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {t('payment.simple_payment_label')}
      </Text>

      <View style={styles.optionRow}>
        {METHODS.map(method => (
          <SimplePaymentOption
            key={method.id}
            method={method}
            onPress={setSelectedId}
            selected={method.id === selectedId}
          />
        ))}
      </View>
    </View>
  );
}

export default React.memo(SimplePaymentSection);

const styles = StyleSheet.create({
  card: {
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    width: CIRCLE_SIZE,
  },
  label: {
    fontSize: ScaleSize(14),
    fontWeight: '700',
    textAlign: 'center',
  },
  letter: {
    fontSize: ScaleSize(20),
    fontWeight: '800',
  },
  option: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  section: {
    marginTop: ScaleSize(24),
  },
  sectionLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(12),
  },
});
