import { Environment } from '@constants';
import { FileManager } from '@kits/core/utils/FileManager';
import { Paths } from '@navigation/paths';
import { useAppDispatch } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { updatePushIdRequest } from '@services/slices/account/accountSlice';
import { Globals } from '@utils';
import { useEffect, useRef } from 'react';
import type { NotificationClickEvent } from 'react-native-onesignal';
import { OneSignal } from 'react-native-onesignal';
import { useSelector } from 'react-redux';

const CLICK_DEBOUNCE_MS = 500;
const DEVICE_ID_RETRY_MS = 1000;

const NOTIFICATION_TYPES = {
  // TOPUP_CODE_ISSUED: Paths.Top,
};

const onHandleNotificationClick = (event: any) => {
  //TODO: implement logic notification click
  console.log('onHandleNotificationClick', event);
  const { type } = event?.additionalData || {};
};

const useNotification = () => {
  const dispatch = useAppDispatch();
  const profile = useSelector(AccountSelector.getProfile);
  const clickEventTimeoutId = useRef<NodeJS.Timeout | number>(0);
  const timeOutSendPushRequest = useRef<any>(null);
  const timeOutCheckDeviceId = useRef<any>(null);

  //   const actions = useActions({
  //     updateReadNotifyRequest: notifyActions.updateReadedNotifyRequest,
  //     updateDeviceIdRequest: accountActions.updateDeviceIdRequest,
  //   });

  const getDeviceId = async () => {
    const [subscriptionId, pushToken, optedIn] = await Promise.all([
      OneSignal.User.pushSubscription.getIdAsync(),
      OneSignal.User.pushSubscription.getTokenAsync(),
      OneSignal.User.pushSubscription.getOptedInAsync(),
    ]);
    if (!subscriptionId) {
      clearTimeout(timeOutCheckDeviceId.current);
      timeOutCheckDeviceId.current = setTimeout(() => {
        void getDeviceId();
      }, DEVICE_ID_RETRY_MS);
      return;
    }
    clearTimeout(timeOutSendPushRequest.current);
    timeOutSendPushRequest.current = setTimeout(() => {
      dispatch(
        updatePushIdRequest({
          optedIn,
          pushToken: pushToken ?? '',
          subscriptionId,
        }),
      );
    }, 250);
  };

  const checkPermission = async () => {
    if (!profile?.id) {
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
        void getDeviceId();
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
            onHandleNotificationClick(event);
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
