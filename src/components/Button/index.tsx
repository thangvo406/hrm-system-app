import type { TouchableOpacityProps, ViewStyle } from 'react-native';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const PRIMARY_COLOR = '#5BB85C';
const DISABLED_COLOR = '#C4C4C4';
const BUTTON_HEIGHT = 52;

type ButtonType = 'outline' | 'primary' | 'rounded';

type ButtonProps = {
  readonly title: string;
  readonly loading?: boolean;
  readonly type?: ButtonType;
  readonly style?: ViewStyle;
} & Omit<TouchableOpacityProps, 'style'>;

function Button({
  disabled,
  title,
  loading = false,
  type = 'primary',
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled === true || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        type === 'primary' && styles.primary,
        type === 'rounded' && styles.rounded,
        type === 'outline' && styles.outline,
        isDisabled && type !== 'outline' && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'outline' ? PRIMARY_COLOR : '#FFFFFF'}
        />
      ) : (
        <Text
          style={[
            styles.label,
            type === 'outline' && styles.labelOutline,
            isDisabled && type !== 'outline' && styles.labelDisabled,
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
  outline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primary: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 28,
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
