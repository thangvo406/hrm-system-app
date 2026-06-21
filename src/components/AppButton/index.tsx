import { AppConstants } from '@constants';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

type Properties = {
  readonly children: React.ReactNode;
  readonly onPress?: () => void;
  readonly style?: ViewStyle
  readonly testID?: string;
};

function AppButton({ testID = "", children, style = undefined, onPress = undefined }: Properties) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={style} testID={testID} hitSlop={AppConstants.HISLOP_BUTTON} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

export default React.memo(AppButton);
