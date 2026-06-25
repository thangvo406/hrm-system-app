import { RadioButton } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import type { PaymentCartMethod } from '@hooks';
import React from 'react';

const PAYMENT_METHODS: readonly {
  readonly id: PaymentCartMethod;
  readonly label: string;
}[] = [
  { id: 'coop_pay', label: '생협 Pay' },
  { id: 'credit_card', label: '신용/체크카드' },
  { id: 'easy_payment', label: '간편결제' },
];

const SECTION_TITLE = '결제수단';
const PRIMARY_GREEN = '#5BB85C';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const RADIO_WHITE = '#FFFFFF';

type PaymentMethodProps = {
  readonly onChange: (method: PaymentCartMethod) => void;
  readonly value: PaymentCartMethod;
};

function PaymentMethod({ onChange, value }: PaymentMethodProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{SECTION_TITLE}</Text>
      <View style={styles.list}>
        {PAYMENT_METHODS.map(method => {
          const isSelected = value === method.id;
          const optionStyle = [
            styles.option,
            isSelected && styles.optionSelected,
          ];
          return (
            <View key={method.id} style={optionStyle}>
              <RadioButton
                iconColor={isSelected ? RADIO_WHITE : undefined}
                label={method.label}
                labelStyle={[isSelected && styles.labelOnGreen]}
                onPress={() => onChange(method.id)}
                selected={isSelected}
                style={[styles.radioItem, styles.radioItemFirst]}
                testID={`payment-method-${method.id}`}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(PaymentMethod);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  labelOnGreen: {
    color: WHITE,
    fontWeight: '700',
  },
  list: {
    gap: ScaleSize(8),
    marginTop: ScaleSize(12),
  },
  option: {
    borderRadius: ScaleSize(10),
  },
  optionPrimary: {
    backgroundColor: Colors.gray3,
  },
  optionSelected: {
    backgroundColor: PRIMARY_GREEN,
  },
  radioItem: {
    paddingVertical: ScaleSize(14),
  },
  radioItemFirst: {
    paddingHorizontal: ScaleSize(12),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
