import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import imageNames from '@assets/images/names';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from './AppButton';

const ICON_SIZE = ScaleSize(24);
const ACCENT_COLOR = '#5BB85C';
const DISABLED_COLOR = '#A1A1A1';

type Properties = {
  readonly onPressBack?: () => void;
  readonly onPressReadAll?: () => void;
  readonly title: string;
  readonly hideNotify?: boolean;
  readonly transparent?: boolean;
  readonly disabledBtnReadAll?: boolean;
  readonly showIconReadAll?: boolean;
  readonly style?: ViewStyle;
};

const onOpenMenu = () => {
  AppNavigator.showMenu();
};


const onPressNotification = () => {
  AppNavigator.navigate(Paths.Notifications);
};

function HeaderDetail({
  transparent = false,
  hideNotify = false,
  onPressBack = undefined,
  onPressReadAll = undefined,
  style = undefined,
  disabledBtnReadAll = false,
  title,
  showIconReadAll = false,
}: Properties) {
  const inssets = useSafeAreaInsets();
  const _onPressBack = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      AppNavigator.goBack();
    }
  };


  // const onPressHome = () => {
  //   AppNavigator.reset(Paths.Home);
  // };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: transparent ? 'transparent' : '#FFFFFF',
          paddingTop: inssets.top,
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
          <AppButton
            onPress={onPressNotification}
            style={styles.iconButton}
            testID="header-detail-notification"
          >
            <Image
              height={ICON_SIZE}
              name={imageNames.ic_bell_green}
              width={ICON_SIZE}
            />
          </AppButton>
        )}
        {!!showIconReadAll && (
          <AppButton
            onPress={onPressReadAll}
            disabled={disabledBtnReadAll}
            style={styles.iconButton}
            testID="header-detail-notification"
          >
            <Image
              color={disabledBtnReadAll ? DISABLED_COLOR : ACCENT_COLOR}
              height={ICON_SIZE}
              name='ic_notify_read_all'
              type="svg"
              width={ICON_SIZE}
            />
          </AppButton>
        )}
        <AppButton
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
        </AppButton>
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
  title: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    paddingHorizontal: ScaleSize(8),
  },
});
