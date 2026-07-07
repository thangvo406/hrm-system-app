import { useEffect, useRef } from 'react';
import type { RootStackParamList } from '@navigation/types';

import { AppStacks, Paths } from '@navigation/paths';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from '@navigation/AppNavigator';
import {
  AppState,
  Dimensions,
  PanResponder,
  Platform,
  View,
  Linking,
} from 'react-native';
import { Globals } from '@utils';
import { AppStack, AuthStack } from './Stacks';
import { deepLinkGate } from './deepLinkGate';

const Stack = createStackNavigator<RootStackParamList>();

const IS_PAN_RESPONDER_ENABLED = true;

const HIDDEN_CART_PATHS = new Set<string>([
  Paths.Carts,
  Paths.PaymentCart,
  Paths.OrderCompleted,
  Paths.InputAddress,
]);

const handleNavigationStateChange = () => {
  console.log('currentRoute', AppNavigator.getCurrentRoute());
  const currentName = AppNavigator.getCurrentRoute()?.name ?? '';
  if (HIDDEN_CART_PATHS.has(currentName)) {
    Globals.cartBtnRef?.hide?.();
  } else {
    Globals.cartBtnRef?.show?.();
  }
};

function ApplicationNavigator() {
  const navigationReference = useNavigationContainerRef<RootStackParamList>();
  const hasTriggeredSwipeAction = useRef(false);
  const isScrolling = useRef(false);
  const pendingSwipeAction = useRef<
    'NONE' | 'GO_BACK' | 'GO_TAB_GENERAL' | 'RESOURCE_DETAIL_SWIPE'
  >('NONE');

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      const url = deepLinkGate.consumePending();
      if (url) {
        const data = deepLinkGate.getPathFromUrl(url);
        console.log('data', {
          url,
          data,
        });
        const { screen, ...params } = data || {};
        let type;
        if (screen == 'academicverifysuccess') {
          type = 'success';
        } else if (screen == 'academicverifyfail') {
          type = 'failed';
        }
        AppNavigator.navigate(Paths.AcademicVerificationFinish, {
          type,
          ...(params || {}),
        });
        // AppNavigator.navigate(data?.stack, {
        //   screen: data?.screen,
        // });
      }
    }
  };

  useEffect(() => {
    Globals.isScrollingRef = isScrolling;
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // PanResponder callbacks are invoked by the gesture system, not during render.
  // The `react-hooks/refs` rule cannot see across PanResponder.create's boundary,
  // so we disable it for the standard React Native PanResponder-with-useRef pattern.
  const panResponder = useRef(
    // eslint-disable-next-line react-hooks/refs
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
        const hasSignificantMovement = Math.abs(gestureState.dx) > 3; // Reduced from 5 to 3

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

        const SWIPE_THRESHOLD = 80; // Increased from 10 to 30 to reduce sensitivity
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
          pendingSwipeAction.current = 'GO_BACK';
        }

        // Handle left swipe (future use)
        if (
          gestureState.dx < -SWIPE_THRESHOLD &&
          Math.abs(gestureState.vx) >= SWIPE_VELOCITY_THRESHOLD
        ) {
          // Add your left swipe action here if needed
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
      {...(IS_PAN_RESPONDER_ENABLED ? panResponder.panHandlers : {})}
      style={{
        flex: 1,
        //  backgroundColor: navigationTheme.colors.background,
      }}
    >
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
