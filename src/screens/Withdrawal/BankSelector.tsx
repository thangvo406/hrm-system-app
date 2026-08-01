import type { IBankOption } from '@hooks/useWithdrawal';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';

const ICON_SIZE = ScaleSize(20);
const TEXT_DARK = '#1A1A1A';
const PLACEHOLDER_COLOR = '#9E9E9E';
const ICON_COLOR = '#9E9E9E';
const BORDER_COLOR = '#E0E0E0';

type Properties = {
  readonly onSelect: () => void;
  readonly placeholder: string;
  readonly selectedBank?: IBankOption;
};

function BankSelector({ onSelect, placeholder, selectedBank }: Properties) {
  const bankNameDisplay = useMemo(() => {
    return typeof selectedBank == 'string' ? selectedBank : selectedBank?.name;
  }, [selectedBank]);

  return (
    <View>
      <AppButton
        onPress={onSelect}
        style={styles.field}
        testID="withdrawal-bank"
      >
        <Text
          style={[styles.fieldText, !selectedBank && styles.placeholder]}
          numberOfLines={1}
        >
          {bankNameDisplay || placeholder}
        </Text>
        <Image
          color={ICON_COLOR}
          height={ICON_SIZE}
          name="ic_chevron_down"
          type="svg"
          width={ICON_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(BankSelector);

const styles = StyleSheet.create({
  dropdown: {
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    marginTop: ScaleSize(6),
    overflow: 'hidden',
  },
  field: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(13),
  },
  fieldText: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(15),
  },
  option: {
    alignItems: 'flex-start',
    borderTopColor: BORDER_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  optionText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
  },
  placeholder: {
    color: PLACEHOLDER_COLOR,
  },
});
