import { PixelRatio, Platform } from 'react-native';
import isNumber from 'lodash/isNumber';
import { DeviceUtils } from './DeviceUtils';
import { getDimensions } from './scaleConfig'; // dùng width global

const { isAndroid, isDevicePixel, isTablet, isIPad } = DeviceUtils;

// Baseline dimensions for each device type. Chỉ scale theo width; height của
// baseline giữ lại trong comment để tra cứu.
const BASELINE = {
  IPHONE: { width: 414 }, // iPhone 6/7/8 Plus — 414x736
  IPAD: { width: 812 }, // iPad baseline (custom, adjust as needed) — 812x609
  ANDROID_PHONE: { width: 411 }, // Pixel 2 XL — 411x731
  ANDROID_TABLET: { width: 800 }, // Typical Android tablet — 800x1280
};

function getDeviceType() {
  if (isIPad()) {
    return 'IPAD';
  }
  if (isTablet()) {
    return 'ANDROID_TABLET';
  }
  if (isAndroid()) {
    return 'ANDROID_PHONE';
  }
  return 'IPHONE';
}

export function scaleSize(
  size: number,
  iPadSize?: number,
  pixelSize?: number,
) {
  const dimensions = getDimensions();
  // console.log("getDimensions",dimensions)`
  let width = dimensions.width;
  // let height = dimensions.height;
  const _size = isDevicePixel() && isNumber(pixelSize) ? pixelSize : size;

  const deviceType = getDeviceType();
  let baselineWidth = BASELINE.IPHONE.width;

  //   alert(typeof iPadSize)
  //  isShow && alert(deviceType)
  const _iPadSize = isNumber(iPadSize) ? iPadSize : size;
  switch (deviceType) {
  case 'IPAD': {
    baselineWidth = BASELINE.IPAD.width;
    if (typeof iPadSize === 'string') {
      return iPadSize;
    }
    // console.log('scaleSize.dimensions',dimensions);
    // Scale by width for iPad (giống phone)
    const scale = width / baselineWidth;
    const newSize = _iPadSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  case 'ANDROID_TABLET': {
    baselineWidth = BASELINE.ANDROID_TABLET.width;
    const scale = width / baselineWidth;
    const newSize = _iPadSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  case 'ANDROID_PHONE': {
    baselineWidth = BASELINE.ANDROID_PHONE.width;
  
  break;
  }
  // No default
  }

  // For phones, use width as baseline
  if (typeof size === 'string') {
    return size;
  }
  width = Math.min(dimensions.width, dimensions.height);
  const scale = width / baselineWidth;
  const newSize = _size * scale;
  if (isAndroid()) {
    return newSize;
  }
  return Platform.OS === 'ios'
    ? Math.round(PixelRatio.roundToNearestPixel(newSize))
    : Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}
