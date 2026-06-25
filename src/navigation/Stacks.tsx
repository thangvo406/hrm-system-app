import type { ComponentType } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '@screens';
import { Paths } from './paths';
import FloatingCartButton from './FloatingCartButton';

// ─── Auth stack ───────────────────────────────────────────────────────────────

type ScreenDef = { component: ComponentType<unknown>; name: string };

const AuthNavigator = createStackNavigator();

const AUTH_SCREENS: ScreenDef[] = [
  {
    component: Screens.Startup as ComponentType<unknown>,
    name: Paths.Startup,
  },
  {
    component: Screens.Authorization as ComponentType<unknown>,
    name: Paths.Authorization,
  },
  {
    component: Screens.ForgotPass as ComponentType<unknown>,
    name: Paths.ForgotPass,
  },
  { component: Screens.Welcome as ComponentType<unknown>, name: Paths.Welcome },
];

export function AuthStack() {
  return (
    <AuthNavigator.Navigator
      initialRouteName={Paths.Startup}
      screenOptions={{ gestureEnabled: false, headerShown: false }}
    >
      {AUTH_SCREENS.map(({ component, name }) => (
        <AuthNavigator.Screen
          key={name}
          component={component}
          name={name}
          options={{ headerShown: false }}
        />
      ))}
    </AuthNavigator.Navigator>
  );
}

// ─── App stack ────────────────────────────────────────────────────────────────

const AppNavigator = createStackNavigator();

const AUTH_PATHS = new Set<string>([
  Paths.Welcome,
  Paths.Authorization,
  Paths.ForgotPass,
]);

const APP_SCREENS: ScreenDef[] = (Object.keys(Paths) as (keyof typeof Paths)[])
  .filter(key => !AUTH_PATHS.has(Paths[key]))
  .map(key => ({
    component: Screens[key] as ComponentType<unknown>,
    name: Paths[key],
  }));

export function AppStack() {
  return (
    <>
      <AppNavigator.Navigator
        initialRouteName={Paths.Home}
        screenOptions={{ gestureEnabled: false, headerShown: false }}
      >
        {APP_SCREENS.map(({ component, name }) => (
          <AppNavigator.Screen
            key={name}
            component={component}
            name={name}
            options={{ headerShown: false }}
          />
        ))}
      </AppNavigator.Navigator>
      <FloatingCartButton />
    </>
  );
}
