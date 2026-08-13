import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#8A8F86';
const RADIO_BORDER = '#D3D6D1';
const RADIO_GREEN = '#2DB34A';
const ICON_BG_GRAY = '#F3F4F6';
const ICON_BG_GREEN = '#E7F6EB';
const DIVIDER_COLOR = '#F0F1EF';
const CARD_SHADOW = 'rgba(23, 68, 33, 0.08)';
const OPTION_ICON_SIZE = ScaleSize(24);
const RADIO_OUTER_SIZE = ScaleSize(22);
const RADIO_INNER_SIZE = ScaleSize(12);

type WithdrawalType = 'academic_change' | 'decrease_refund';

export type OptionDef = {
  readonly desc: string;
  readonly icon: 'ic_coins_refund' | 'ic_graduation_cap';
  readonly iconBg: string;
  readonly title: string;
  readonly type: WithdrawalType;
};

type Properties = {
  readonly onSelect: (item: OptionDef) => void;
  readonly selected: WithdrawalType;
};

function WithdrawalTypeCard({ onSelect, selected }: Properties) {
  const { t } = useTranslation();

  const options: readonly OptionDef[] = [
    {
      desc: t('capital_withdrawal.option_academic_desc'),
      icon: 'ic_graduation_cap',
      iconBg: ICON_BG_GRAY,
      title: t('capital_withdrawal.option_academic_title'),
      type: 'academic_change',
    },
    {
      desc: t('capital_withdrawal.option_refund_desc'),
      icon: 'ic_coins_refund',
      iconBg: ICON_BG_GREEN,
      title: t('capital_withdrawal.option_refund_title'),
      type: 'decrease_refund',
    },
  ];

  return (
    <View style={styles.card}>
      {options.map((option, index) => {
        const isSelected = option.type === selected;
        return (
          <React.Fragment key={option.type}>
            {index > 0 ? <View style={styles.divider} /> : undefined}
            <AppButton
              onPress={() => onSelect(option)}
              style={styles.option}
              testID={`capital-withdrawal-option-${option.type}`}
            >
              <View
                style={[styles.radioOuter, isSelected && styles.radioSelected]}
              >
                {isSelected ? <View style={styles.radioInner} /> : undefined}
              </View>
              <View
                style={[styles.iconWrap, { backgroundColor: option.iconBg }]}
              >
                <Image
                  height={OPTION_ICON_SIZE}
                  name={option.icon}
                  type="svg"
                  width={OPTION_ICON_SIZE}
                />
              </View>
              <View style={styles.texts}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.desc}>{option.desc}</Text>
              </View>
            </AppButton>
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default React.memo(WithdrawalTypeCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    elevation: 4,
    paddingHorizontal: ScaleSize(16),
    shadowColor: CARD_SHADOW,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: ScaleSize(12),
  },
  desc: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12.5),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(3),
  },
  divider: {
    backgroundColor: DIVIDER_COLOR,
    height: ScaleSize(1),
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: ScaleSize(42),
    justifyContent: 'center',
    marginLeft: ScaleSize(12),
    width: ScaleSize(42),
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: ScaleSize(16),
  },
  radioInner: {
    backgroundColor: RADIO_GREEN,
    borderRadius: RADIO_INNER_SIZE / 2,
    height: RADIO_INNER_SIZE,
    width: RADIO_INNER_SIZE,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: RADIO_BORDER,
    borderRadius: RADIO_OUTER_SIZE / 2,
    borderWidth: ScaleSize(1.5),
    height: RADIO_OUTER_SIZE,
    justifyContent: 'center',
    width: RADIO_OUTER_SIZE,
  },
  radioSelected: {
    borderColor: RADIO_GREEN,
  },
  texts: {
    flex: 1,
    marginLeft: ScaleSize(12),
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
