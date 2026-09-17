import type { ComponentType } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '@screens';
import { AUTH_PATHS, Paths } from './paths';
import { AppTabNavigator } from './AppTabNavigator';

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

// AppTabs không có component cùng tên trong @screens (nó là navigator), nên lọc
// theo những key thực sự được export ra màn hình.
const APP_SCREENS: ScreenDef[] = (Object.keys(Paths) as (keyof typeof Paths)[])
  .filter(key => !AUTH_PATHS.has(Paths[key]) && key in Screens)
  .map(key => ({
    component: Screens[key as keyof typeof Screens] as ComponentType<unknown>,
    name: Paths[key],
  }));

export function AppStack() {
  return (
    <>
      <AppNavigator.Navigator
        initialRouteName={Paths.AppTabs}
        screenOptions={{ gestureEnabled: false, headerShown: false }}
      >
        <AppNavigator.Screen
          component={AppTabNavigator as ComponentType<unknown>}
          name={Paths.AppTabs}
          options={{ headerShown: false }}
        />
        {APP_SCREENS.map(({ component, name }) => (
          <AppNavigator.Screen
            key={name}
            component={component}
            name={name}
            options={{ headerShown: false }}
          />
        ))}
      </AppNavigator.Navigator>
    </>
  );
}
