import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToProfile = () => {
  AppNavigator.navigate(Paths.Profile);
};

export const useHome = () => {
  const profile = useAppSelector(AccountSelector.getProfile);

  return {
    goToProfile,
    openMenu,
    profile,
  };
};
