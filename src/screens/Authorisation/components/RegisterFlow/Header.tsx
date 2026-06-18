import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AppConstants } from '@constants';

const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);
const BACK_ICON_SIZE = ScaleSize(24);
const BACK_ICON_COLOR = '#9CA3AF';
const NOOP = () => undefined;

type RegisterHeaderProps = {
  readonly onBack?: () => void;
  readonly showBtnBack?: boolean;
};

function RegisterHeader({
  onBack = NOOP,
  showBtnBack = false,
}: RegisterHeaderProps) {
  return (
    <View style={styles.header}>
      <Image
        height={BANNER_HEIGHT}
        name="ic_logo_banner"
        width={BANNER_WIDTH}
      />
      {showBtnBack ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          hitSlop={AppConstants.HISLOP_BUTTON}
          style={styles.backButton}
          testID="register-header-back"
        >
          <Image
            color={BACK_ICON_COLOR}
            height={BACK_ICON_SIZE}
            name="ic_arrow_left_gray"
            type="svg"
            width={BACK_ICON_SIZE}
          />
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: BACK_ICON_SIZE,
    justifyContent: 'center',
    left: ScaleSize(16),
    position: 'absolute',
    top: ScaleSize(16),
    width: BACK_ICON_SIZE,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: ScaleSize(16),
    position: 'relative',
  },
});

export default React.memo(RegisterHeader);
