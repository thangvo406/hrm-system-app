import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToProfile = () => {
  AppNavigator.navigate(Paths.Profile);
};

export const useHome = () => {
  const profile = useAppSelector(AccountSelector.getProfile);
  useNotification();

  return {
    goToProfile,
    openMenu,
    profile,
  };
};
