import { useEffect, useRef, type ComponentType } from 'react';
import type { RootStackParamList } from '@navigation/types';

import { AppStacks, Paths } from '@navigation/paths';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '@screens';
import AppNavigator from '@navigation/AppNavigator';
import { Dimensions, PanResponder, Platform, View } from 'react-native';
import { Globals } from '@utils';
import FloatingCartButton from './FloatingCartButton';
import { AuthStack } from './Stacks';

const Stack = createStackNavigator<RootStackParamList>();

type ScreenKey = keyof typeof Paths;
const SCREEN_KEYS = Object.keys(Paths) as ScreenKey[];
const ScreenAny = Stack.Screen as ComponentType<{
  component: ComponentType<unknown>;
  name: string;
}>;

const IS_PAN_RESPONDER_ENABLED = true;

function ApplicationNavigator() {
  const navigationReference = useNavigationContainerRef<RootStackParamList>();
  const hasTriggeredSwipeAction = useRef(false);
  const isScrolling = useRef(false);
  const pendingSwipeAction = useRef<
    'NONE' | 'GO_BACK' | 'GO_TAB_GENERAL' | 'RESOURCE_DETAIL_SWIPE'
  >('NONE');

  useEffect(() => {
    Globals.isScrollingRef = isScrolling;
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
      // panHandlers is built from the ref created above; the gesture system owns it.
      // eslint-disable-next-line react-hooks/refs
      {...(IS_PAN_RESPONDER_ENABLED ? panResponder.panHandlers : {})}
      style={{
        flex: 1,
        //  backgroundColor: navigationTheme.colors.background,
      }}
    >
      <NavigationContainer
        onReady={() => {
          AppNavigator.setRootNavigator(navigationReference);
        }}
        ref={navigationReference}
      >
        <Stack.Navigator
          initialRouteName={Paths.Startup}
          screenOptions={{
            ...configTranslate,
            gestureEnabled: false,
            headerShown: false,
          }}
        >
          <Stack.Screen
            component={AuthStack}
            name={AppStacks.Auth as string}
            options={{
              headerShown: false,
              // ...optionDefault,
              ...configTranslate,
            }}
          />
          <Stack.Screen
            component={AuthStack}
            name={AppStacks.App}
            options={{
              headerShown: false,
              // ...optionDefault,
              ...configTranslate,
            }}
          />
          {SCREEN_KEYS.map(key => (
            <ScreenAny
              key={key}
              component={Screens[key] as ComponentType<unknown>}
              name={Paths[key]}
            />
          ))}
        </Stack.Navigator>
        <FloatingCartButton />
      </NavigationContainer>
    </View>
  );
}

export default ApplicationNavigator;
