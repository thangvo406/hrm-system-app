import type { RootScreenProps } from '@navigation/types';
import { AppStacks, Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { startupApp } from '@services/slices/app/appSlice';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from '@navigation/AppNavigator';

function Startup() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      startupApp({
        onFailure: () => {
          SplashScreen.hide();
          AppNavigator.navigate(Paths.Welcome);
        },
        onSuccess: isAuthenticated => {
          SplashScreen.hide();
          if (isAuthenticated) {
            AppNavigator.replace(AppStacks.App);
          } else {
            AppNavigator.navigate(Paths.Welcome);
          }
        },
      }),
    );
  }, [dispatch]);

  return <></>;
}

export default Startup;
