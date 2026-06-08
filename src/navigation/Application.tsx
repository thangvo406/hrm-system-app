import type { RootStackParamList } from '@navigation/types';

import { Paths } from '@navigation/paths';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Authorization, Example, Home, Startup, Welcome } from '@screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Welcome} name={Paths.Welcome} />
          <Stack.Screen component={Authorization} name={Paths.Authorization} />
          <Stack.Screen component={Home} name={Paths.Home} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
