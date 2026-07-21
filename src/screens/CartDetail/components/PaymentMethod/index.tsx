import { RadioButton } from '@components';
import { AppConstants, Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
const { PaymentTypes } = AppConstants;
const PAYMENT_METHODS: readonly {
  readonly id: string;
  readonly label: string;
}[] = [
  {
    id: PaymentTypes.BALANCE,
    label: 'payment_cart.payment_methods.coop_pay',
  },
  {
    id: PaymentTypes.CARD_SAVE,
    label: 'payment_cart.payment_methods.credit_card',
  },
  {
    id: PaymentTypes.EASY_PAY,
    label: 'payment_cart.payment_methods.easy_payment',
  },
];

const SECTION_TITLE = '결제수단';
const PRIMARY_GREEN = '#5BB85C';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const RADIO_WHITE = '#FFFFFF';

type PaymentMethodProps = {
  readonly onChange: (method: string) => void;
  readonly value: string;
};

function PaymentMethod({ onChange, value }: PaymentMethodProps) {
  const { t } = useTranslation();
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
                label={t(method.label)}
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
