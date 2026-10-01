/* eslint-disable unicorn/no-useless-fallback-in-spread */
// import { DeviceUtils } from '@kits/core/utils';
import { CommonActions, StackActions } from '@react-navigation/native';
// import Information from '@dialogs/Information';
// import { CrashlyticsUtils } from '@utils';
import type { NavigationState, PartialState } from '@react-navigation/native';
import type { DialogHandle } from '@screens/Dialog/types';
import NetworkError from '@dialogs/NetworkError';
import { Keyboard, Linking } from 'react-native';
import Information from '@dialogs/Information';
import ForceUpdateApp from '@dialogs/ForceUpdateApp';
// import analytics from '@react-native-firebase/analytics';
// import ForceUpdate from '@dialogs/ForceUpdate';
// import { AppNativeModules } from '@config/AppNativeModules';
// import { AppConstants } from '@constants';

let navigator: any;
let dialogReference: DialogHandle | undefined;
let debounce: any;

type TSnackBar = {
  readonly message: string;
  readonly type: 'failed' | 'info' | 'success';
};

const setRootNavigator = (navigationRef = {}) => {
  if (!navigator || navigationRef) {
    navigator = navigationRef;
  }
};

function showLoading(options?: Parameters<DialogHandle['showLoading']>[0]) {
  Keyboard.dismiss();
  // dialogReference?.setWillShow(true);
  dialogReference?.showLoading?.(options);
}

function setRefDialog(reference: DialogHandle | null) {
  dialogReference = reference ?? undefined;
}

function navigate(name: string, params = {}, key = `${name}_${Date.now()}`) {
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

function getInnermostActiveStackState(state: any): any {
  if (!state?.routes?.length) return state;
  const active = state.routes[state.index ?? state.routes.length - 1];
  if (active?.state?.routes?.length)
    return getInnermostActiveStackState(active.state);
  return state;
}

function getPreviousRoute() {
  const rootState = navigator?.getRootState?.();
  if (!rootState) return undefined;
  const stackState = getInnermostActiveStackState(rootState);
  const index = stackState.index ?? stackState.routes.length - 1;
  return index > 0 ? stackState.routes[index - 1] : undefined;
}

function showDialog(params: any) {
  const { onDidAppear, popupType, timeOutDialog = 250 } = params || {};
  Keyboard.dismiss();
  // dialogReference?.setWillShow(true);
  const _params = { ...(params || {}) };
  console.log('showDialog', params);
  setTimeout(() => {
    // Branch on the existing `popupType` discriminator — `'bottomSheet'`
    // routes to the bottom-sheet overlay, anything else (including the
    // legacy/undefined value) keeps the existing dialog behavior.
    if (popupType === 'bottomSheet') {
      dialogReference?.showBottomSheet?.(_params);
    } else {
      dialogReference?.showDialog?.(_params);
    }
    onDidAppear?.();
  }, timeOutDialog);
}

function showToast(params: any) {
  dialogReference?.showToast?.({ ...(params || {}), isToast: true });
}

function showSnackBar(params: TSnackBar) {
  Keyboard.dismiss();
  dialogReference?.showSnackBar?.(params);
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
function goBack(params?: object) {
  if (navigator?.canGoBack?.()) {
    if (params) {
      const previous = getPreviousRoute();
      if (previous?.key) {
        navigator?.dispatch({
          ...CommonActions.setParams({
            dataGoBack: params,
          }),
          source: previous.key,
        });
      }
    }
    navigator?.goBack();
  }
}

function canGoBack() {
  return navigator?.canGoBack?.();
}

function reset(name: string, params = {}) {
  navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    }),
  );
}

function resetToNestedState(
  name: string,
  state: PartialState<NavigationState>,
) {
  navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, state }],
    }),
  );
}

let debounceHideLoading: ReturnType<typeof setTimeout> | undefined = undefined;
function hideLoading(): Promise<unknown> {
  return new Promise(resolve => {
    clearTimeout(debounceHideLoading);
    debounceHideLoading = setTimeout(() => {
      dialogReference?.hideLoading?.();
      debounceHideLoading = undefined;
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
  showDialog({
    screen: Information,
    title: 'common.popup.title_error',
    desc: 'common.popup.desc_camera_error',
    confirmTitle: 'common.popup.btn_open_setting',
    cancelTitle: 'common.popup.btn_close',
    needTranslate: true,
    onConfirm: () => {
      Linking.openSettings()
        .then(() => undefined)
        .catch(() => undefined);
    },
  });
}

function showForceUpdate() {
  showDialog({
    screen: ForceUpdateApp,
    // isFullScreen: true,
    cancelable: false,
  });
}

function showCodePushAvailable({ onConfirm }: { onConfirm: () => void }) {
  showDialog({
    screen: Information,
    title: 'code_push.update_available_title',
    desc: 'code_push.update_available_desc',
    confirmTitle: 'code_push.update_now',
    cancelTitle: 'code_push.update_later',
    needTranslate: true,
    onConfirm,
  });
}

function showDialogErrorOpenPhoto() {
  showDialog({
    screen: Information,
    title: 'common.popup.title_error',
    desc: 'common.popup.desc_photo_error',
    confirmTitle: 'common.popup.btn_open_setting',
    cancelTitle: 'common.popup.btn_close',
    needTranslate: true,
    onConfirm: () => {
      Linking.openSettings()
        .then(() => undefined)
        .catch(() => undefined);
    },
  });
}
function showDialogNetworkError({ callback, onDismiss }: any = {}) {
  showDialog({
    screen: NetworkError,
    popupType: 'dialog',
    onRetry: callback,
    onDismiss,
  });
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
  } else if (navigator.getCurrentRoute()) {
    navigator.getCurrentRoute().params = {
      ...navigator.getCurrentRoute().params,
      ...params,
    };
  }
}

export default {
  setRootNavigator,
  navigate,
  setRefDialog,
  showDialog,
  replace,
  getCurrentRoute,
  getPreviousRoute,
  showSnackBar,
  showToast,
  setParams,
  getParams,
  showLoading,
  canGoBack,
  hideAllPopup,
  showDialogErrorOpenCamera,
  showDialogErrorOpenPhoto,
  hideLoading,
  pop,
  popToTop,
  goBack,
  showForceUpdate,
  showCodePushAvailable,
  showDialogNetworkError,
  onTrackScreenChange,
  reset,
  resetToNestedState,
};
