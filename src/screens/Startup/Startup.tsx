import type { RootScreenProps } from '@navigation/types';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { startupApp } from '@services/slices/app/appSlice';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      startupApp({
        onFailure: () => {
          SplashScreen.hide();
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Welcome }],
          });
        },
        onSuccess: isAuthenticated => {
          SplashScreen.hide();
          navigation.reset({
            index: 0,
            routes: [{ name: isAuthenticated ? Paths.Home : Paths.Welcome }],
          });
        },
      }),
    );
  }, [dispatch, navigation]);

  return <></>;
}

export default Startup;
