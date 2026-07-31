import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Screens from '@screens';
import BottomTabBar from '../screens/Home/BottomTabBar';
import { Paths } from './paths';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Paths.Home}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Tab.Screen component={Screens.Home} name={Paths.Home} />
      <Tab.Screen component={Screens.Carts} name={Paths.Carts} />
      <Tab.Screen
        component={Screens.QRCodeMember}
        name={Paths.QRCodeMember}
      />
      <Tab.Screen component={Screens.Vouchers} name={Paths.Vouchers} />
      <Tab.Screen component={Screens.Profile} name={Paths.Profile} />
    </Tab.Navigator>
  );
}
