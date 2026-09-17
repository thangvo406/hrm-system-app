import {
  check,
  request,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

export {
  check,
  checkNotifications,
  PERMISSIONS,
  requestMultiple,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

export const checkPermissions = async (
  permission: Permission,
): Promise<boolean> => {
  const result = await check(permission);
  return result === RESULTS.GRANTED;
};

export const requestPermission = async (permission: Permission) => {
  return request(permission);
};
