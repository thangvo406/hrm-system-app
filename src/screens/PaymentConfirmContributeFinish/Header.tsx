import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import imageNames from '@assets/images/names';
import AppNavigator from '@navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '@components/AppButton';
import { DeviceUtils } from '@kits/core/utils';

const { ifIphoneX } = DeviceUtils;
const ICON_SIZE = ScaleSize(24);
const LOGO_HEIGHT = 42;
const LOGO_WIDTH = 96;

type Properties = {
  readonly onPressBack?: () => void;
  readonly transparent?: boolean;
  readonly usePaddingTop?: boolean;
  readonly style?: ViewStyle;
};

function HeaderDetail({
  transparent = false,
  onPressBack = undefined,
  style = undefined,
  usePaddingTop = true,
}: Properties) {
  const insets = useSafeAreaInsets();
  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      AppNavigator.goBack();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: transparent ? 'transparent' : '#FFFFFF',
          paddingTop: usePaddingTop ? insets.top + ifIphoneX(0, 10) : 0,
        },
        style,
      ]}
    >
      <AppButton
        onPress={_onPressBack}
        style={styles.iconButton}
        testID="header-detail-back"
      >
        <Image
          color="#1A1A1A"
          height={ICON_SIZE}
          name="ic_arrow_left_gray"
          type="svg"
          width={ICON_SIZE}
        />
      </AppButton>

      <Image
        height={LOGO_HEIGHT}
        name={imageNames.ic_logo_banner}
        type="image"
        width={LOGO_WIDTH}
      />
    </View>
  );
}

export default React.memo(HeaderDetail);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(10),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    zIndex: 10,
  },
  iconButton: {
    alignItems: 'center',
    height: ICON_SIZE + ScaleSize(8),
    justifyContent: 'center',
    width: ICON_SIZE + ScaleSize(8),
  },
});
