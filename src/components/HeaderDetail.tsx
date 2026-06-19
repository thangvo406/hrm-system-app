import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import imageNames from '@assets/images/names';
import { AppConstants } from '@constants';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

const ICON_SIZE = ScaleSize(24);
const ACCENT_COLOR = '#5BB85C';

type Properties = {
  readonly onPressBack?: () => void;
  readonly title: string;
  readonly hideNotify?: boolean;
  readonly transparent?: boolean;
  readonly style?: ViewStyle;
};

function HeaderDetail({
  transparent,
  hideNotify = false,
  onPressBack,
  style,
  title,
}: Properties) {
  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      AppNavigator.goBack();
    }
  };

  const onOpenMenu = () => {
    AppNavigator.showMenu();
  };

  // const onPressHome = () => {
  //   AppNavigator.reset(Paths.Home);
  // };

  const onPressNotification = () => {
    AppNavigator.navigate(Paths.Notifications);
  };

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: transparent ? 'transparent' : '#FFFFFF' },
        style,
      ]}
    >
      <TouchableOpacity
        hitSlop={AppConstants.HISLOP_BUTTON}
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
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.actions}>
        {/* <TouchableOpacity
          hitSlop={AppConstants.HISLOP_BUTTON}
          onPress={onPressHome}
          style={styles.iconButton}
          testID="header-detail-home"
        >
          <Image
            color={ACCENT_COLOR}
            height={ICON_SIZE}
            name="ic_home"
            type="svg"
            width={ICON_SIZE}
          />
        </TouchableOpacity> */}
        {!hideNotify && (
          <TouchableOpacity
            hitSlop={AppConstants.HISLOP_BUTTON}
            onPress={onPressNotification}
            style={styles.iconButton}
            testID="header-detail-notification"
          >
            <Image
              height={ICON_SIZE}
              name={imageNames.ic_bell_green}
              width={ICON_SIZE}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          hitSlop={AppConstants.HISLOP_BUTTON}
          onPress={onOpenMenu}
          style={styles.iconButton}
          testID="header-detail-menu"
        >
          <Image
            color={ACCENT_COLOR}
            height={ICON_SIZE}
            name="ic_menu"
            type="svg"
            width={ICON_SIZE}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(HeaderDetail);

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(10),
  },
  iconButton: {
    alignItems: 'center',
    height: ICON_SIZE + ScaleSize(8),
    justifyContent: 'center',
    width: ICON_SIZE + ScaleSize(8),
  },
  title: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    paddingHorizontal: ScaleSize(8),
  },
});
