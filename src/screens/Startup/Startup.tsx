import { AppStacks, Paths } from '@navigation/paths';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { useAppDispatch } from '@services/common/storeHooks';
import { startupApp } from '@services/slices/app/appSlice';
import { useCallback, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from '@navigation/AppNavigator';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceEventEmitter } from 'react-native';
import { Globals } from '@utils';

// coop://AcademicVerifySuccess?screen=AcademicVerifySuccess&school=KUPI University&department=Computer Engineering&type=Student
// npx uri-scheme add coop --ios

function navigateToPendingDeepLink(isAuthenticated: boolean) {
  const url = deepLinkGate.consumePending();
  AppStorage.set(AppConstants.NEED_CONTRIBUTION_KEY, false);
  Globals.isAuthenticated = isAuthenticated;
  if (!url) {
    handleNavigateScreen();
    return;
  }
  const data = deepLinkGate.getPathFromUrl(url);
  if (!data) {
    handleNavigateScreen();
    return;
  }
  const { screen, ...params } = data || {};
  let type;
  if (screen == 'academicverifysuccess') {
    type = 'success';
  } else if (screen == 'academicverifyfail') {
    type = 'failed';
  }
  AppNavigator.navigate(Paths.AcademicVerificationFinish, {
    type,
    ...(params || {}),
  });
}

const handleNavigateScreen = () => {
  if (Globals.isAuthenticated) {
    AppNavigator.replace(AppStacks.App);
  } else {
    AppNavigator.replace(Paths.Welcome);
  }
};

function Startup() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      startupApp({
        onFailure: () => {
          SplashScreen.hide();
          navigateToPendingDeepLink(false);
        },
        onSuccess: isAuthenticated => {
          SplashScreen.hide();
          navigateToPendingDeepLink(isAuthenticated);
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      AppConstants.INIT_SCREEN_START_UP_KEY,
      () => {
        handleNavigateScreen();
      },
    );
    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // const sub = DeviceEventEmitter.addListener(
      //   AppConstants.INIT_SCREEN_START_UP_KEY,
      //   () => {
      //     handleNavigateScreen();
      //   },
      // );
      // return () => sub.remove();
    }, []),
  );

  return <></>;
}

export default Startup;
