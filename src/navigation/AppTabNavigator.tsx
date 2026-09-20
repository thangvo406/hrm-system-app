import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Screens from '@screens';
import BottomTabBar from '../screens/Home/BottomTabBar';
import { Paths } from './paths';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

// Định nghĩa ngoài render: nếu tạo inline, React coi đây là component type mới
// mỗi lần render và dựng lại toàn bộ tab bar.
const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

export function AppTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Paths.Home}
      tabBar={renderTabBar}
    >
      <Tab.Screen component={Screens.Home} name={Paths.Home} />
      <Tab.Screen component={Screens.Attendance} name={Paths.Attendance} />
      <Tab.Screen component={Screens.Requests} name={Paths.Requests} />
      <Tab.Screen
        component={Screens.Notifications}
        name={Paths.Notifications}
      />
      <Tab.Screen component={Screens.Profile} name={Paths.Profile} />
    </Tab.Navigator>
  );
}
