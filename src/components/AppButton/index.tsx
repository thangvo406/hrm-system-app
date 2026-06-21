import { AppConstants } from '@constants';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

type Properties = {
  readonly children: React.ReactNode;
  readonly onPress?: () => void;
  readonly style?: ViewStyle | ViewStyle[];
  readonly testID?: string;
} & TouchableOpacityProps;

function AppButton({
  testID = '',
  children,
  style = undefined,
  onPress = undefined,
  ...rest
}: Properties) {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.9}
      style={style}
      testID={testID}
      hitSlop={AppConstants.HISLOP_BUTTON}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

export default React.memo(AppButton);
