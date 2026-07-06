import { AppStacks, Paths } from '@navigation/paths';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { useAppDispatch } from '@services/common/storeHooks';
import { startupApp } from '@services/slices/app/appSlice';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from '@navigation/AppNavigator';

// coop://AcademicVerifySuccess?stack=Auth&screen=AcademicVerifySuccess
// npx uri-scheme add coop --ios

function navigateToPendingDeepLink(isAuthenticated: boolean) {
  const url = deepLinkGate.consumePending();
  if (!url) {
    if (isAuthenticated) {
      AppNavigator.replace(AppStacks.App);
    } else {
      AppNavigator.navigate(Paths.Welcome);
    }
    return;
  }
  const path = deepLinkGate.getPathFromUrl(url);
  if (path) {
    AppNavigator.navigate(path);
  } else if (isAuthenticated) {
    AppNavigator.replace(AppStacks.App);
  } else {
    AppNavigator.navigate(Paths.Welcome);
  }
}

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

  return <></>;
}

export default Startup;
