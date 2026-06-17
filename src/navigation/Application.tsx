import type { ComponentType } from 'react';
import type { RootStackParamList } from '@navigation/types';

import { Paths } from '@navigation/paths';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '@screens';
import AppNavigator from '@navigation/AppNavigator';

const Stack = createStackNavigator<RootStackParamList>();

type ScreenKey = keyof typeof Paths;
const SCREEN_KEYS = Object.keys(Paths) as ScreenKey[];
const ScreenAny = Stack.Screen as ComponentType<{
  component: ComponentType<unknown>;
  name: string;
}>;

function ApplicationNavigator() {
  const navigationReference = useNavigationContainerRef<RootStackParamList>();

  return (
    <NavigationContainer
      onReady={() => {
        AppNavigator.setRootNavigator(navigationReference);
      }}
      ref={navigationReference}
    >
      <Stack.Navigator
        initialRouteName={Paths.Startup}
        screenOptions={{ headerShown: false }}
      >
        {SCREEN_KEYS.map(key => (
          <ScreenAny
            key={key}
            component={Screens[key] as ComponentType<unknown>}
            name={Paths[key]}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
