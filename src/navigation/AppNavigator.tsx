// import { DeviceUtils } from '@kits/core/utils';
import { CommonActions, StackActions } from '@react-navigation/native';
// import Information from '@dialogs/Information';
// import { CrashlyticsUtils } from '@utils';
import type { DialogHandle } from '@screens/Dialog/types';
import { Keyboard } from 'react-native';
// import analytics from '@react-native-firebase/analytics';
// import ForceUpdate from '@dialogs/ForceUpdate';
// import { AppNativeModules } from '@config/AppNativeModules';
// import { AppConstants } from '@constants';

let navigator: any;
let dialogReference: DialogHandle | undefined;
let debounce: any;

const setRootNavigator = (navigationRef = {}) => {
  if (!navigator || navigationRef) {
    navigator = navigationRef;
  }
};

function showLoading(options?: Parameters<DialogHandle['showLoading']>[0]) {
  Keyboard.dismiss();
  dialogReference?.setWillShow(true);
  dialogReference?.showLoading?.(options);
}

function setRefDialog(reference: DialogHandle | null) {
  dialogReference = reference ?? undefined;
}

function navigate(
  name: string,
  params = {},
  key = `${name}_${new Date().getTime()}`,
) {
  Keyboard.dismiss();
  if (navigator) {
    // if (debounce) {
    //   console.log('Debounce effect');
    //   return;
    // }

    debounce = setTimeout(() => {
      clearTimeout(debounce);
      debounce = null; // clear time out
    }, 1200);

    if (navigator?.getRootState()) {
      navigator.navigate({
        name,
        params,
        key,
      });
    }

    // const delayTime = navigator?.getRootState() ? 0 : 500;
    // setTimeout(() => {
    //    if (navigator?.getRootState()) {
    //       navigator.navigate({
    //          name,
    //          params,
    //          key,
    //       });
    //    }
    // }, delayTime);
  }
}

function getCurrentRoute() {
  return navigator?.getCurrentRoute?.();
}
function showDialog(params: any) {
  console.log('showDialog', params);
  const { onDidAppear, popupType, timeOutDialog = 250 } = params || {};
  Keyboard.dismiss();
  dialogReference?.setWillShow(true);
  const _params = { ...(params || {}) };
  _params.popupType = popupType;
  setTimeout(() => {
    dialogReference?.showDialog(_params);
    onDidAppear?.();
  }, timeOutDialog);
}

function showToast(params: any) {
  console.log('showToast', params);
  dialogReference?.showToast?.({ ...(params || {}), isToast: true });
}

function hideAllPopup() {
  dialogReference?.closeDialog?.();
  dialogReference?.hideLoading?.();
}

function getParams(props: any) {
  return props?.route?.params || {};
}

function replace(nameStack: string, params?: any) {
  navigator.dispatch(StackActions.replace(nameStack, params));
}
function goBack() {
  if (navigator?.canGoBack?.()) {
    console.log('goBack', navigator?.getCurrentRoute()?.name);
    navigator?.goBack?.();
  }
}
function reset(name: string, params = {}) {
  navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    }),
  );
}

let debounceHideLoading: ReturnType<typeof setTimeout> | null = null;
function hideLoading(): Promise<unknown> {
  return new Promise(resolve => {
    clearTimeout(debounceHideLoading ?? undefined);
    debounceHideLoading = setTimeout(() => {
      dialogReference?.hideLoading?.();
      debounceHideLoading = null;
      resolve({});
    }, 200);
  });
}

function pop(numberBack = 1) {
  navigator?.dispatch(StackActions.pop(numberBack));
}

function popToTop() {
  navigator?.dispatch(StackActions.popToTop());
}
function showDialogErrorOpenCamera() {
  //   showDialog({
  //     screen: Information,
  //     popupType: 'dialog',
  //     isFullScreen: true,
  //     title: 'Ops!',
  //     desc: 'common.popup.desc_camera_error',
  //     needTranslate: true,
  //     buttons: [
  //       {
  //         title: 'common.popup.btn_close',
  //         outlet: true,
  //       },
  //       {
  //         title: 'common.popup.btn_open_setting',
  //         onPress: () => {
  //           Linking.openSettings();
  //         },
  //       },
  //     ],
  //   });
}

function showForceUpdate() {
  //   showDialog({
  //     screen: ForceUpdate,
  //     popupType: 'dialog',
  //     isFullScreen: true,
  //     cancelable: false,
  //   });
}

function showDialogErrorOpenPhoto() {
  //   showDialog({
  //     screen: Information,
  //     popupType: 'dialog',
  //     isFullScreen: true,
  //     title: 'Ops!',
  //     desc: 'common.popup.desc_photo_error',
  //     needTranslate: true,
  //     buttons: [
  //       {
  //         title: 'common.popup.btn_close',
  //         outlet: true,
  //       },
  //       {
  //         title: 'common.popup.btn_open_setting',
  //         onPress: () => {
  //           Linking.openSettings();
  //         },
  //       },
  //     ],
  //   });
}
function showDialogNetworkError({ callback }: any) {
  //   showDialog({
  //     screen: Information,
  //     popupType: 'dialog',
  //     isFullScreen: true,
  //     title: 'common.popup.desc_network_title',
  //     desc: 'common.popup.desc_network_error',
  //     needTranslate: true,
  //     styleContainer,
  //     buttons: [
  //       {
  //         title: 'common.popup.btn_try_again',
  //         onPress: () => {
  //           callback?.();
  //         },
  //       },
  //     ],
  //   });
}

function onTrackScreenChange() {
  //   const currentRouteName = navigator?.getCurrentRoute()?.name;
  //   console.log(
  //     'currentRouteName',
  //     currentRouteName,
  //     navigator?.getCurrentRoute(),
  //   );
  //   AppNativeModules.emitEvent(AppConstants.SCREEN_CHANGE_KEY, currentRouteName);
  //   if (currentRouteName) {
  //     CrashlyticsUtils.log(
  //       JSON.stringify({
  //         screen: currentRouteName,
  //         params: navigator?.getCurrentRoute()?.params,
  //       }),
  //     );
  //     analytics()
  //       .logScreenView({
  //         screen_name: currentRouteName,
  //         screen_class: currentRouteName,
  //       })
  //       .then(() => null);
  //   }
}

function setParams(props: any, params: object) {
  if (props?.navigation && typeof props.navigation.setParams === 'function') {
    props.navigation.setParams(params);
  } else {
    if (navigator.getCurrentRoute()) {
      navigator.getCurrentRoute().params = {
        ...navigator.getCurrentRoute().params,
        ...params,
      };
    }
  }
}

export default {
  setRootNavigator,
  navigate,
  setRefDialog,
  showDialog,
  replace,
  getCurrentRoute,
  showToast,
  setParams,
  getParams,
  showLoading,
  hideAllPopup,
  showDialogErrorOpenCamera,
  showDialogErrorOpenPhoto,
  hideLoading,
  pop,
  popToTop,
  goBack,
  showForceUpdate,
  showDialogNetworkError,
  onTrackScreenChange,
  reset,
};
