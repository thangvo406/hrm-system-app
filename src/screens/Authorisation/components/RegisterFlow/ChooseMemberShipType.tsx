import { Button } from '@components';
import RegisterHeader from './Header';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';

const PRIMARY_COLOR = '#5BB85C';
const BORDER_COLOR_SELECTED = '#5BB85C';
const BORDER_COLOR_DEFAULT = '#CCCCCC';
const NOOP = () => undefined;
const RADIO_OUTER_SIZE = ScaleSize(20);
const RADIO_INNER_SIZE = ScaleSize(10);
const TEXT_COLOR = '#1A1A1A';

export type MembershipOption = {
  readonly id: string;
  readonly label: string;
  readonly desc: string;
};

type ChooseMemberShipTypeProps = {
  readonly disabled?: boolean;
  readonly showBtnBack?: boolean;
  readonly onBack?: () => void;
  readonly onSelectMembership: (id: string) => void;
  readonly onSubmit: (data: any) => void;
  readonly options: readonly MembershipOption[];
};

function ChooseMemberShipType({
  disabled = false,
  onBack = NOOP,
  onSelectMembership,
  onSubmit,
  options,
  showBtnBack = false,
}: ChooseMemberShipTypeProps) {
  const { t } = useTranslation();
  const [itemSelected, setItemSelected] = useState('');

  const handleSubmit = () => {
    onSubmit?.(itemSelected);
  };

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} showBtnBack={showBtnBack} />

      <View style={styles.content}>
        <Text style={styles.title}>{t('choose_membership.title')}</Text>
        <Text style={[styles.desc, { marginLeft: 0 }]}>
          {t('choose_membership.desc')}
        </Text>

        <ScrollView
          style={{
            marginTop: ScaleSize(10),
          }}
        >
          {options.map((option, index) => {
            const isSelected = option.id === itemSelected;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={option.id}
                onPress={() => {
                  onSelectMembership?.(option.id);
                  setItemSelected(option.id);
                }}
                style={[
                  styles.option,
                  index === 0 && styles.optionFirst,
                  isSelected && styles.optionSelected,
                ]}
                testID={`choose-membership-option-${option.id}`}
              >
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected ? <View style={styles.radioInner} /> : undefined}
                </View>
                <View>
                  <Text style={styles.optionLabel}>{t(option.label)}</Text>
                  <Text style={styles.desc}>{t(option.desc)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View
          style={{
            width: '100%',
            height: ScaleSize(10),
            backgroundColor: '#F0F0F0',
            marginBottom: ScaleSize(30),
          }}
        />
        <Button
          disabled={disabled || !itemSelected}
          onPress={handleSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          testID="choose-membership-next"
          title={t('choose_membership.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  footer: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  option: {
    alignItems: 'center',
    borderColor: BORDER_COLOR_DEFAULT,
    borderRadius: ScaleSize(12),
    borderWidth: 1.5,
    flexDirection: 'row',
    marginBottom: ScaleSize(30),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(30),
  },
  optionFirst: {
    marginTop: ScaleSize(40),
  },
  optionLabel: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
    marginLeft: ScaleSize(14),
    marginBottom: ScaleSize(4),
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.gray5,
    fontSize: ScaleSize(15),
    marginLeft: ScaleSize(14),
  },
  optionSelected: {
    borderColor: BORDER_COLOR_SELECTED,
  },
  radioInner: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: RADIO_INNER_SIZE / 2,
    height: RADIO_INNER_SIZE,
    width: RADIO_INNER_SIZE,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: BORDER_COLOR_DEFAULT,
    borderRadius: RADIO_OUTER_SIZE / 2,
    borderWidth: 2,
    height: RADIO_OUTER_SIZE,
    justifyContent: 'center',
    width: RADIO_OUTER_SIZE,
  },
  radioOuterSelected: {
    borderColor: PRIMARY_COLOR,
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(26),
    fontWeight: '700',
    marginBottom: ScaleSize(40),
  },
});

export default React.memo(ChooseMemberShipType);
