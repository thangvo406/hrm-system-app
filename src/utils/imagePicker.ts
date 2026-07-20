// import { PermissionUtils } from './Permission';
import { DeviceUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import ImagePickerPopup from '@dialogs/ImagePicker';
import { PermissionUtils } from '@utils';
// import { AppNavigator } from '@navigation';
import { openPicker, openCamera } from 'react-native-image-crop-picker';
import { bytesToSize } from './common';
const { isIOS } = DeviceUtils;

const openCameraDevice = async (): Promise<any> => {
  try {
    const options = {
      mediaType: 'photo',
    };
    const permission = isIOS()
      ? PermissionUtils.PERMISSIONS.IOS.CAMERA
      : PermissionUtils.PERMISSIONS.ANDROID.CAMERA;
    const result = await PermissionUtils.requestPermission(permission);
    if (
      ![
        PermissionUtils.RESULTS.DENIED,
        PermissionUtils.RESULTS.BLOCKED,
      ].includes(result)
    ) {
      return await openCamera(options);
    } else {
      AppNavigator.showDialogErrorOpenCamera();
    }
  } catch {
    AppNavigator.showDialogErrorOpenCamera();
  }
  throw new Error('Permission denied');
};
const openLibrary = async (): Promise<any> => {
  try {
    const options = {
      mediaType: 'photo',
      sortOrder: 'desc',
      directAlbum: true,
    };
    // return launchImageLibrary(options)
    const permission = isIOS()
      ? PermissionUtils.PERMISSIONS.IOS.PHOTO_LIBRARY
      : PermissionUtils.PERMISSIONS.ANDROID.CAMERA;
    const result = await PermissionUtils.requestPermission(permission);
    if (
      ![
        PermissionUtils.RESULTS.DENIED,
        PermissionUtils.RESULTS.BLOCKED,
      ].includes(result)
    ) {
      return await openPicker(options);
    } else {
      AppNavigator.showDialogErrorOpenPhoto();
    }
    // return openPicker(options);
    throw new Error('Permission denied');
  } catch {
    throw new Error('Permission denied');
  }
};

const getFileName = (url: string) => {
  if (url) {
    const parts = url?.split('/');
    if (parts && parts?.length > 0) {
      const filename = parts?.[parts?.length - 1];
      return filename;
    }
  }
  return '';
};
const showImagePicker = (callback: any) => {
  const onCheckValidFile = (data: any) => {
    const size = bytesToSize(data?.size);
    let isLimitSize = false;
    if (size != 'n/a' && typeof size == 'object' && 'unit' in size) {
      isLimitSize =
        size.unit == 'KB' ? Number.parseFloat(size.value) > 50 : false; // limit 50MB
    }
    if (isLimitSize) {
      callback(false, 'common.popup.error_limit_size_file');
    } else {
      callback?.(true, data);
    }
  };
  const handleSubmit = (item: any) => {
    if (item?.type == 'camera') {
      openCameraDevice()
        .then(onCheckValidFile)
        .catch(() => undefined);
    } else {
      openLibrary()
        .then(onCheckValidFile)
        .catch(() => undefined);
    }
  };
  AppNavigator.showDialog({
    screen: ImagePickerPopup,
    isFullScreen: true,
    popupType: 'bottomSheet',
    onSubmit: handleSubmit,
  });
};

export const ImagePicker = {
  openLibrary,
  showImagePicker,
  getFileName,
  openCameraDevice,
};
