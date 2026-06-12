import type { RootStackParamList } from '@navigation/types';

import { Paths } from '@navigation/paths';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Authorization,
  Example,
  Home,
  Profile,
  Startup,
  Welcome,
} from '@screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const navigationReference = useNavigationContainerRef<RootStackParamList>();

  return (
    <SafeAreaProvider>
      <NavigationContainer
        onReady={() => {
          AppNavigator.setRootNavigator(navigationReference);
        }}
        ref={navigationReference}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Welcome} name={Paths.Welcome} />
          <Stack.Screen component={Authorization} name={Paths.Authorization} />
          <Stack.Screen component={Home} name={Paths.Home} />
          <Stack.Screen component={Profile} name={Paths.Profile} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
