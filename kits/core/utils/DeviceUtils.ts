import { Platform, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { NumberUtils } from '.';
import { getDimensions } from './scaleConfig';

function isAndroid() {
  return Platform.OS === 'android';
}

function isIPad() {
  return Platform.isPad;
}

const isLargeDevice = () => {
  const { width, height } = getDimensions();
  return width >= 400 && height >= 800;
};

const isDeviceSmall = () => {
  const { width, height } = getDimensions();
  return width <= 414 && height <= 736;
};

const ifDeviceSmall = (a: any, b: any) => {
  if (isDeviceSmall()) {
    return a;
  }
  return b;
};

function getDeviceName() {
  return DeviceInfo.getDeviceNameSync();
}

function convertBytes(bytes: number, options = {}) {
  const { useBinaryUnits = true, decimals = 2 } = options;

  if (decimals < 0) {
    throw new Error(`Invalid decimals ${decimals}`);
  }

  const base = useBinaryUnits ? 1024 : 1000;
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(base));

  return {
    value: (bytes / Math.pow(base, i)).toFixed(decimals),
    unit: units[i],
  };
  return `${(bytes / Math.pow(base, i)).toFixed(decimals)} ${units[i]}`;
}

function getDeviceId() {
  const model = DeviceInfo.getModel();
  const randomId = NumberUtils.nextUUID();
  return `${model}-${randomId}`;
}

function isIOS() {
  return Platform.OS === 'ios';
}

function getTotalRAM() {
  const bytes = DeviceInfo.getTotalMemorySync();
  const mb = bytes / 1024 ** 2;
  return Number((mb / 1024).toFixed(2)); // return GB of memory
}

function isDeviceLowPerf() {
  const ram = getTotalRAM();
  if (ram < 3 && !isIPadOrTablet()) {
    return true;
  }

  return false;

  const model = DeviceInfo.getModel();
  const models = model?.split(' ');
  let phoneName = -1;
  try {
    phoneName = Number.parseInt(models?.[models.length - 1]);
  } catch {}
  //ip 7 stop play animation
  if (phoneName > -1 && isIOS() && phoneName <= 8) {
    return true;
  }
  return false;
}

function isIPhone8() {
  const model = DeviceInfo.getModel();
  const models = model?.split(' ');
  let phoneName = -1;
  try {
    phoneName = Number.parseInt(models?.[models.length - 1]);
    return phoneName <= 8;
  } catch {}
  return false;
}

function isTablet() {
  return DeviceInfo.isTablet() && isAndroid();
}

function isIPadOrTablet() {
  return isIPad() || isTablet();
}

function ifIphone8(styleIpad: any, styleOther: any) {
  return isIPhone8() ? styleIpad : styleOther;
}

function ifIPadOrTablet(styleIpad: any, styleOther: any) {
  return isIPadOrTablet() ? styleIpad : styleOther;
}
function ifIpad(styleIpad: any, styleOther: any) {
  return isIPad() ? styleIpad : styleOther;
}

function ifTablet(styleIpad: any, styleOther: any) {
  return isTablet() ? styleIpad : styleOther;
}

function ifIOS(styleIOS: any, styleOther: any) {
  return isIOS() ? styleIOS : styleOther;
}

const isIphoneX = () => {
  const dimension = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimension.height >= 812 ||
      dimension.width >= 812 ||
      dimension.height >= 896 ||
      dimension.width >= 896)
  );
};

const ifIphoneX = (a: any, b: any) => {
  if (isIphoneX()) {
    return a;
  }
  return b;
};

const ifAndroid = (a: any, b: any) => {
  if (isAndroid()) {
    return a;
  }
  return b;
};

const isDevicePixel = () => {
  if (isAndroid() && DeviceInfo.getBrand().toLowerCase?.() == 'google') {
    return true;
  }
  return false;
};

const ifDevicePixel = (a: any, b: any) => {
  if (isDevicePixel()) {
    return a;
  }
  return b;
};

const getAppVersion = () => {
  return DeviceInfo.getVersion();
};

export const isIphonePro = () => {
  const model = DeviceInfo.getModel();
  return model.split(' ')?.slice(-1)?.toString()?.toLocaleLowerCase() == 'pro';
};
class Insets {
  static value: any;
}

export const DeviceUtils = {
  isAndroid,
  isIPad,
  Insets,
  isIphonePro,
  isTablet,
  getAppVersion,
  isIPadOrTablet,
  isLargeDevice,
  isDevicePixel,
  ifDevicePixel,
  isDeviceSmall,
  ifDeviceSmall,
  ifIPadOrTablet,
  ifAndroid,
  getDeviceId,
  ifIphoneX,
  convertBytes,
  getDeviceName,
  ifIpad,
  isDeviceLowPerf,
  ifTablet,
  getTotalRAM,
  ifIphone8,
  isIphoneX,
  isIOS,
  ifIOS,
  dimensions: getDimensions(),
};
