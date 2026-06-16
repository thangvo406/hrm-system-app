import { Environment } from '@constants';
// import { AppStorage } from '@config/storage';
// import { NotificationType } from '@constants';
// import { AppConstants } from '@constants';
import { FileManager } from '@kits/core/utils/FileManager';
import { AccountSelector } from '@services/selectors';
// import AppNavigator from '@navigations/AppNavigator';
// import { ROUTES } from '@navigations/Routes';
// import { AccountSelector } from '@reducers/account/selectors';
import Globals from '@utils/Globals';
import { useEffect, useRef } from 'react';
import type { NotificationClickEvent } from 'react-native-onesignal';
import { OneSignal } from 'react-native-onesignal';
import { useSelector } from 'react-redux';
// import { useActions } from './useActions';
// import { notifyActions } from '@actions/notify';

const CLICK_DEBOUNCE_MS = 500;
const DEVICE_ID_RETRY_MS = 1000;

const onHandleNotificationClick = () => {
  //TODO: implement logic notification click
};

const useNotification = () => {
  const profile = useSelector(AccountSelector.getProfile);
  const clickEventTimeoutId = useRef<NodeJS.Timeout | number>(0);

  //   const actions = useActions({
  //     updateReadNotifyRequest: notifyActions.updateReadedNotifyRequest,
  //     updateDeviceIdRequest: accountActions.updateDeviceIdRequest,
  //   });

  const getDeviceId = () => {
    void OneSignal.User.getOnesignalId().then(token => {
      if (!token) {
        setTimeout(() => {
          getDeviceId();
        }, DEVICE_ID_RETRY_MS);
      } else {
        // actions.updateDeviceIdRequest({ oneSignalId: token });
      }
    });
  };

  const checkPermission = async () => {
    // alert(JSON.stringify(profile));
    if (!profile?.identityNumber) {
      return;
    }
    // const statusPermission = AppStorage.getBoolean(
    //   PERMISSIONS_NOTIFICATION_KEY,
    // );
    const statusPermission = false;
    if (!statusPermission) {
      // Request permission with prompt
      await OneSignal.Notifications.requestPermission(false);
      //   AppStorage.set(PERMISSIONS_NOTIFICATION_KEY, true);
    }
    void OneSignal.Notifications.getPermissionAsync().then(permission => {
      if (permission) {
        // Force sync lên server
        OneSignal.User.pushSubscription.optIn();
        OneSignal.login(`user_${profile?.phone ?? ''}`);
        getDeviceId();
      }
    });
  };

  const init = () => {
    if (Environment.ONE_SIGNAL_ID) {
      OneSignal.initialize(Environment.ONE_SIGNAL_ID);

      // Request permission immediately after initialization
      void checkPermission();
      OneSignal.Notifications.addEventListener(
        'click',
        (event: NotificationClickEvent) => {
          clearTimeout(clickEventTimeoutId.current);
          clickEventTimeoutId.current = setTimeout(() => {
            FileManager.appendLog(
              'Notification click event: ',
              JSON.stringify(event),
            );
            onHandleNotificationClick();
          }, CLICK_DEBOUNCE_MS) as unknown as number;
        },
      );
      OneSignal.Notifications.addEventListener(
        'foregroundWillDisplay',
        event => {
          // Don't prevent default - let the system handle the notification
          try {
            // Ensure the notification is displayed
            setTimeout(() => {
              event.getNotification().display();
            }, 0);
          } catch (error) {
            console.error('Error displaying notification:', error);
          }
        },
      );
      OneSignal.Notifications.addEventListener('permissionChange', () => {});
    } else {
      console.warn('ONE_SIGNAL_ID not found in environment');
    }
  };

  useEffect(() => {
    init();
    // Method for listening for notification clicks
  }, []);

  useEffect(() => {
    if (!Globals.hasUpdateDeviceId && profile) {
      void checkPermission();
      Globals.hasUpdateDeviceId = true;
    }
  }, [profile]);
};

export default useNotification;
