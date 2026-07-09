import { NativeModules, Platform } from 'react-native';

type CoopNativeModuleType = {
  readonly hideBottomNavigationBar: () => Promise<boolean>;
  readonly showBottomNavigationBar: () => Promise<boolean>;
};

const NOOP_MODULE: CoopNativeModuleType = {
  hideBottomNavigationBar: async () => false,
  showBottomNavigationBar: async () => false,
};

// Chỉ Android có native module này; iOS không có system navigation bar.
const nativeModule =
  Platform.OS === 'android'
    ? (NativeModules.CoopNativeModule as CoopNativeModuleType | undefined)
    : undefined;

const coopNativeModule = nativeModule ?? NOOP_MODULE;

/**
 * Ẩn thanh navigation bar hệ thống Android (back/home/recent) ở runtime.
 * No-op trên iOS. Trả về `true` nếu thao tác thành công.
 */
function hideBottomNavigationBar(): Promise<boolean> {
  return coopNativeModule.hideBottomNavigationBar();
}

/**
 * Hiện lại thanh navigation bar hệ thống Android. No-op trên iOS.
 */
function showBottomNavigationBar(): Promise<boolean> {
  return coopNativeModule.showBottomNavigationBar();
}

const AppNativeModules = {
  hideBottomNavigationBar,
  showBottomNavigationBar,
};

export default AppNativeModules;
