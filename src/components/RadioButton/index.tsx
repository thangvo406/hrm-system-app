import type { StyleProp, ViewStyle } from 'react-native';

import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ICON_SIZE = ScaleSize(22);
const PRIMARY_COLOR = '#5BB85C';
const UNSELECTED_COLOR = '#9E9E9E';
const TEXT_COLOR = '#1A1A1A';

const NOOP = (): void => undefined;

type RadioButtonProps = {
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onPress?: () => void;
  readonly selected: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
};

function RadioButton({
  disabled = false,
  label = undefined,
  onPress = NOOP,
  selected,
  style = undefined,
  testID = undefined,
}: RadioButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{
        bottom: 10,
        left: 10,
        right: 10,
        top: 10,
      }}
      style={[styles.container, style]}
      testID={testID}
    >
      <Image
        color={selected ? PRIMARY_COLOR : UNSELECTED_COLOR}
        height={ICON_SIZE}
        name={selected ? 'ic_radio_selected' : 'ic_radio_unselected'}
        type="svg"
        width={ICON_SIZE}
      />
      {label === undefined ? undefined : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  label: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
  },
});

export default React.memo(RadioButton);
