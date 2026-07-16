import {
  requestMultiple,
  requestNotifications,
  checkNotifications,
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const checkPermissions = (permission: any) => {
  return new Promise(resolve => {
    check(permission).then(result => {
      resolve(result == RESULTS.GRANTED);
    });
  });
};

const requestPermission = (permission: any) => {
  return new Promise((resolve, reject) => {
    request(permission)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export {
  checkPermissions,
  checkNotifications,
  requestNotifications,
  requestMultiple,
  check,
  PERMISSIONS,
  requestPermission,
  RESULTS,
};
