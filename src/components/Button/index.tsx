import type { TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { AppConstants, Colors } from '@constants';
import { ScaleSize } from '@kits/core';

const PRIMARY_COLOR = Colors.primary;
const DISABLED_COLOR = '#C4C4C4';
const BUTTON_HEIGHT = 52;

type ButtonType =
  | 'outline'
  | 'primary'
  | 'rounded'
  | 'outline-bordered'
  | 'outline-bordered-rounded'
  | 'outline-green';

const typeOutletBorderedRounded = 'outline-bordered-rounded';
const typeOutletBordered = 'outline-bordered';
type ButtonProps = {
  readonly title: string;
  readonly loading?: boolean;
  readonly type?: ButtonType;
  readonly style?: ViewStyle;
  readonly titleStyle?: TextStyle;
} & Omit<TouchableOpacityProps, 'style'>;

function Button({
  disabled,
  title,
  loading = false,
  type = 'primary',
  style,
  titleStyle,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled === true || loading;
  const isOutlet = [
    'outline',
    typeOutletBorderedRounded,
    typeOutletBordered,
  ].includes(type);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      hitSlop={AppConstants.HISLOP_BUTTON}
      style={[
        styles.base,
        type === 'primary' && styles.primary,
        type === 'rounded' && styles.rounded,
        type === 'outline' && styles.outline,
        type === 'outline-green' && styles.outlineGreen,
        type === typeOutletBorderedRounded && [
          styles.rounded,
          styles.outline,
          styles.border,
        ],
        type === typeOutletBordered && [
          styles.rounded,
          styles.outline,
          styles.border,
          { borderRadius: ScaleSize(16) },
        ],
        isDisabled && !isOutlet && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isOutlet ? PRIMARY_COLOR : '#FFFFFF'} />
      ) : (
        <Text
          style={[
            styles.label,
            isOutlet && styles.labelOutline,
            isDisabled && !isOutlet && styles.labelDisabled,
            type === 'outline-green' && styles.textOutlineGreen,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    width: '100%',
  },
  outlineGreen: {
    borderWidth:1,
    borderColor: Colors.green02,
    borderRadius: ScaleSize(10),
  },
  textOutlineGreen: {
    color: Colors.green02,
  },
  disabled: {
    backgroundColor: DISABLED_COLOR,
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  labelDisabled: {
    color: '#FFFFFF',
  },
  labelOutline: {
    color: '#666666',
    fontWeight: '500',
  },
  border: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: ScaleSize(28),
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    elevation: ScaleSize(3),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primary: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: ScaleSize(28),
    elevation: 4,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  rounded: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    elevation: 4,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default React.memo(Button);
