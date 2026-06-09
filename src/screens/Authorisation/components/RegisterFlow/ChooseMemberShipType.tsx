import { Button } from '@components';
import Image from '@components/Image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);
const PRIMARY_COLOR = '#5BB85C';
const BORDER_COLOR_SELECTED = '#5BB85C';
const BORDER_COLOR_DEFAULT = '#CCCCCC';
const RADIO_OUTER_SIZE = ScaleSize(20);
const RADIO_INNER_SIZE = ScaleSize(10);
const TEXT_COLOR = '#1A1A1A';

export type MembershipOption = {
  readonly id: string;
  readonly label: string;
};

type ChooseMemberShipTypeProps = {
  readonly disabled?: boolean;
  readonly onSelectMembership: (id: string) => void;
  readonly onSubmit: () => void;
  readonly options: readonly MembershipOption[];
  readonly selectedMembershipId?: string;
};

function ChooseMemberShipType({
  disabled = false,
  onSelectMembership,
  onSubmit,
  options,
  selectedMembershipId = undefined,
}: ChooseMemberShipTypeProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          height={BANNER_HEIGHT}
          name="ic_logo_banner"
          width={BANNER_WIDTH}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('choose_membership.title')}</Text>

        {options.map((option, index) => {
          const isSelected = option.id === selectedMembershipId;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={option.id}
              onPress={() => {
                onSelectMembership(option.id);
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
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          disabled={disabled || !selectedMembershipId}
          onPress={onSubmit}
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
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: ScaleSize(16),
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
    marginTop: ScaleSize(60),
  },
  optionLabel: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
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
