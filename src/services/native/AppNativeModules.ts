import { NativeModules, Platform } from 'react-native';

type CoopNativeModuleType = {
  readonly hideBottomNavigationBar: () => Promise<boolean>;
  readonly openIntentUrl: (url: string) => Promise<boolean>;
  readonly showBottomNavigationBar: () => Promise<boolean>;
};

const NOOP_MODULE: CoopNativeModuleType = {
  hideBottomNavigationBar: () => Promise.resolve(false),
  openIntentUrl: () => Promise.resolve(false),
  showBottomNavigationBar: () => Promise.resolve(false),
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
 * Mở một Android intent-URI (vd `intent://...#Intent;...;package=...;end`) để
 * chuyển sang app khác — xác thực SKT tauth, app ngân hàng trong luồng KCP...
 *
 * `Linking.openURL` của RN không parse được đoạn `#Intent;...` nên phải xử lý ở
 * native. No-op trên iOS (iOS dùng custom/universal scheme qua `Linking`). Trả
 * về `true` nếu đã mở được app đích hoặc màn hình cài đặt (CH Play) tương ứng.
 */
function openIntentUrl(url: string): Promise<boolean> {
  return coopNativeModule.openIntentUrl(url);
}

/**
 * Hiện lại thanh navigation bar hệ thống Android. No-op trên iOS.
 */
function showBottomNavigationBar(): Promise<boolean> {
  return coopNativeModule.showBottomNavigationBar();
}

const AppNativeModules = {
  hideBottomNavigationBar,
  openIntentUrl,
  showBottomNavigationBar,
};

export default AppNativeModules;
