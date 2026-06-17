import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import { getProfileRequest } from '@services/slices/account/accountSlice';
import { useEffect } from 'react';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToProfile = () => {
  // AppNavigator.navigate(Paths.Contribution);
};

const onPressContribution = () => {
  AppNavigator.navigate(Paths.Contribution);
};

const onPressOrder = () => {
  // AppNavigator.navigate(Paths.Contribution);
};

export const useHome = () => {
  const profile = useAppSelector(AccountSelector.getProfile);
  useNotification();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  return {
    goToProfile,
    openMenu,
    profile,
    onPressOrder,
    onPressContribution,
  };
};
