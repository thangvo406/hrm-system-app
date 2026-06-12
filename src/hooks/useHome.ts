import type { RootStackParamList } from '@navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { logout } from '@services/slices/auth/authSlice';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import Information from '@screens/Dialog/components/Information';
import { useTranslation } from 'react-i18next';

export type UseHome = ReturnType<typeof useHome>;

export const useHome = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const profile = useAppSelector(AccountSelector.getProfile);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemPress = (itemKey: string) => {
    setMenuVisible(false);
    AppNavigator.showSnackBar({
      message: `menu.${itemKey}`,
      type: 'info',
    });
  };

  const handleLogout = () => {
    setMenuVisible(false);
    // dispatch(logout());
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: Paths.Authorization }],
    // });
    AppNavigator.showDialog({
      screen: Information,
      title: t('home.logout.title'),
      desc: t('home.logout.desc'),
      confirmTitle: t('home.logout.button_submit'),
      cancelTitle: t('home.logout.button_cancel'),
      onConfirm: () => {
        dispatch(logout());
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Authorization }],
        });
      },
    });
  };

  return {
    closeMenu,
    handleLogout,
    handleMenuItemPress,
    menuVisible,
    openMenu,
    profile,
  };
};
