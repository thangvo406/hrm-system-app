import { useEffect, useRef } from 'react';
import type { RootStackParamList } from '@navigation/types';

import {
  AppStacks,
  AUTH_PATHS,
  Paths,
  SCREEN_IGNORE_SWIPE_LEFT,
} from '@navigation/paths';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from '@navigation/AppNavigator';
import {
  AppState,
  Dimensions,
  Keyboard,
  PanResponder,
  Platform,
  View,
  Linking,
  StatusBar,
} from 'react-native';
import { Globals } from '@utils';
import AppNativeModules from '@services/native/AppNativeModules';
import { AppStack, AuthStack } from './Stacks';
import { deepLinkGate } from './deepLinkGate';

import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import dayjs from 'dayjs';
import { useAppDispatch } from '@services/common/storeHooks';
import { getAppConfigRequest } from '@services/slices/app/appSlice';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const Stack = createStackNavigator<RootStackParamList>();

const IS_PAN_RESPONDER_ENABLED = true;

// const HIDDEN_CART_PATHS = new Set<string>([
//   Paths.Carts,
//   Paths.CartDetail,
//   Paths.OrderCompleted,
//   Paths.InputAddress,
// ]);

const handleNavigationStateChange = () => {
  console.log('currentRoute', AppNavigator.getCurrentRoute());
  // const currentName = AppNavigator.getCurrentRoute()?.name ?? '';
  // if (HIDDEN_CART_PATHS.has(currentName)) {
  //   Globals.cartBtnRef?.hide?.();
  // } else {
  //   Globals.cartBtnRef?.show?.();
  // }
};

function ApplicationNavigator() {
  const navigationReference = useNavigationContainerRef<RootStackParamList>();
  const hasTriggeredSwipeAction = useRef(false);
  const isScrolling = useRef(false);
  const dispatch = useAppDispatch();
  const pendingSwipeAction = useRef<
    'NONE' | 'GO_BACK' | 'GO_TAB_GENERAL' | 'RESOURCE_DETAIL_SWIPE'
  >('NONE');

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      dispatch(getAppConfigRequest());
      const url = deepLinkGate.consumePending();
      if (url) {
        const data = deepLinkGate.getPathFromUrl(url);
        const { screen, ...params } = data || {};
        if (screen?.toLowerCase?.() == 'vouchers') {
          const currentRoute = AppNavigator.getCurrentRoute().name;
          if (!AUTH_PATHS.has(currentRoute)) {
            AppNavigator.navigate(Paths.Vouchers);
          }
        }
      }
    }
  };

  useEffect(() => {
    Globals.isScrollingRef = isScrolling;
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Android 9: khi keyboard ẩn, system navigation bar hiện lại và immersive
    // mode bị mất. Ẩn lại thanh nav hệ thống để giữ layout ổn định.
    const keyboardHideSubscription =
      Platform.OS === 'android'
        ? Keyboard.addListener('keyboardDidHide', () => {
            void AppNativeModules.hideBottomNavigationBar();
          })
        : undefined;

    return () => {
      subscription.remove();
      keyboardHideSubscription?.remove();
    };
  }, []);

  // PanResponder callbacks are invoked by the gesture system, not during render.
  // The `react-hooks/refs` rule cannot see across PanResponder.create's boundary,
  // so we disable it for the standard React Native PanResponder-with-useRef pattern.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!IS_PAN_RESPONDER_ENABLED) {
          return false;
        }

        const { width: screenWidth } = Dimensions.get('window');
        const pageX = evt.nativeEvent?.pageX ?? 0;
        const locationX = evt.nativeEvent?.locationX ?? 0;
        const isLeftEdge = locationX < 200;
        const isRightEdge = screenWidth - pageX < 200; // For future left swipe support
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 0.6; // More forgiving ratio
        const hasSignificantMovement = Math.abs(gestureState.dx) > 6; // Reduced from 5 to 3

        if (isScrolling.current) {
          return false;
        }

        // Allow swipe from both left and right edges for future extensibility
        return (
          (isLeftEdge || isRightEdge) &&
          isHorizontalSwipe &&
          hasSignificantMovement
        );
      },
      onPanResponderGrant: () => {
        isScrolling.current = false;
        hasTriggeredSwipeAction.current = false;
        // pendingSwipeAction.current = 'NONE';
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (!IS_PAN_RESPONDER_ENABLED) {
          return;
        }

        if (hasTriggeredSwipeAction.current) {
          return;
        }

        const SWIPE_THRESHOLD = 160; // Increased from 80 to require a longer, deliberate swipe
        const SWIPE_VELOCITY_THRESHOLD = 0.4; // Increased from 0.07 to 0.2 to reduce sensitivity

        if (isScrolling.current) {
          return;
        }

        // Handle right swipe (go back)
        if (
          gestureState.dx > SWIPE_THRESHOLD &&
          Math.abs(gestureState.vx) >= SWIPE_VELOCITY_THRESHOLD
        ) {
          hasTriggeredSwipeAction.current = true;
          const currentRouteName = AppNavigator.getCurrentRoute()?.name;
          if (SCREEN_IGNORE_SWIPE_LEFT.includes(currentRouteName)) {
            pendingSwipeAction.current = 'NONE';
            return;
          }
          pendingSwipeAction.current = 'GO_BACK';
        }

        // Handle left swipe (go back)
        if (
          gestureState.dx < -SWIPE_THRESHOLD &&
          Math.abs(gestureState.vx) >= SWIPE_VELOCITY_THRESHOLD
        ) {
          hasTriggeredSwipeAction.current = true;
          const currentRouteName = AppNavigator.getCurrentRoute()?.name;
          if (SCREEN_IGNORE_SWIPE_LEFT.includes(currentRouteName)) {
            pendingSwipeAction.current = 'NONE';
            return;
          }
          pendingSwipeAction.current = 'GO_BACK';
        }
      },
      onPanResponderRelease: () => {
        // Fire swipe action on release to avoid a visible "flash" frame when triggering
        // navigation actions mid-gesture on the JS thread.
        switch (pendingSwipeAction.current) {
          case 'RESOURCE_DETAIL_SWIPE': {
            //  AppNativeModules.emitEvent(AppConstants.SWIPE_LEFT_DETECTED_KEY, '');
            break;
          }
          case 'GO_TAB_GENERAL': {
            //  AppNativeModules.emitEvent(AppConstants.GO_TAB_SCREEN_KEY, {
            //    screenName: TabScreen.GENERAL,
            //  });
            break;
          }
          case 'GO_BACK': {
            AppNavigator.goBack();
            break;
          }
          default: {
            break;
          }
        }

        isScrolling.current = false;
        hasTriggeredSwipeAction.current = false;
        // pendingSwipeAction.current = 'NONE';
      },
      onPanResponderTerminate: () => {
        isScrolling.current = false;
        hasTriggeredSwipeAction.current = false;
        // pendingSwipeAction.current = 'NONE';
      },
    }),
  ).current;
  // coop://Authorization
  const linking = {
    prefixes: ['coop://', 'https://app.coop.com'],
    config: {
      screens: {
        [AppStacks.Auth]: {
          path: '',
          screens: {
            [Paths.Authorization]: Paths.Authorization,
          },
        },
      },
    },
    getInitialURL: async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        deepLinkGate.setPending(url.toLowerCase());
      }
      return undefined;
    },
    subscribe: (_listener: (_url: string) => void) => {
      const subscription = Linking.addEventListener('url', ({ url }) => {
        deepLinkGate.setPending(url.toLowerCase());
      });
      return () => subscription.remove();
    },
  };

  const configTranslate =
    Platform.OS == 'android'
      ? ({
          presentation: 'modal',
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        } as const)
      : {};
  return (
    <View
      // {...(IS_PAN_RESPONDER_ENABLED ? panResponder.panHandlers : {})}
      style={{
        flex: 1,
        //  backgroundColor: navigationTheme.colors.background,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <NavigationContainer
        linking={linking}
        onReady={() => {
          AppNavigator.setRootNavigator(navigationReference);
        }}
        onStateChange={handleNavigationStateChange}
        ref={navigationReference}
      >
        <Stack.Navigator
          initialRouteName={AppStacks.Auth}
          screenOptions={{
            ...configTranslate,
            gestureEnabled: false,
            headerShown: false,
          }}
        >
          <Stack.Screen
            component={AuthStack}
            name={AppStacks.Auth}
            options={{ headerShown: false, ...configTranslate }}
          />
          <Stack.Screen
            component={AppStack}
            name={AppStacks.App}
            options={{ headerShown: false, ...configTranslate }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default ApplicationNavigator;
