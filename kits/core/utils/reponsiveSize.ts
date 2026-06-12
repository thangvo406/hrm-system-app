import { PixelRatio, Platform } from 'react-native';
import isNumber from 'lodash/isNumber';
import { DeviceUtils } from './DeviceUtils';
import { getDimensions } from './scaleConfig'; // dùng width global

const { isAndroid, isDevicePixel, isTablet, isIPad } = DeviceUtils;

// Baseline dimensions for each device type
const BASELINE = {
  IPHONE: { width: 414, height: 736 }, // iPhone 6/7/8 Plus
  IPAD: { width: 812, height: 609 }, // iPad baseline (custom, adjust as needed)
  ANDROID_PHONE: { width: 411, height: 731 }, // Pixel 2 XL
  ANDROID_TABLET: { width: 800, height: 1280 }, // Typical Android tablet
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
  isShow = false,
) {
  const dimensions = getDimensions();
  // console.log("getDimensions",dimensions)`
  let width = dimensions.width;
  // let height = dimensions.height;
  const _size = isDevicePixel() && isNumber(pixelSize) ? pixelSize : size;

  const deviceType = getDeviceType();
  let baselineWidth = BASELINE.IPHONE.width;
  let baselineHeight = BASELINE.IPHONE.height;

  //   alert(typeof iPadSize)
  //  isShow && alert(deviceType)
  const _iPadSize = isNumber(iPadSize) ? iPadSize : size;
  if (deviceType === 'IPAD') {
    baselineWidth = BASELINE.IPAD.width;
    if (typeof iPadSize === 'string') {
      return iPadSize;
    }
    // console.log('scaleSize.dimensions',dimensions);
    // Scale by width for iPad (giống phone)
    const scale = width / baselineWidth;
    const newSize = _iPadSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else if (deviceType === 'ANDROID_TABLET') {
    baselineWidth = BASELINE.ANDROID_TABLET.width;
    baselineHeight = BASELINE.ANDROID_TABLET.height;
    const scale = width / baselineWidth;
    const newSize = _iPadSize * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else if (deviceType === 'ANDROID_PHONE') {
    baselineWidth = BASELINE.ANDROID_PHONE.width;
    baselineHeight = BASELINE.ANDROID_PHONE.height;
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
