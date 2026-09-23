import type { AppStacks, Paths } from '@navigation/paths';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';
import type { TRequestType } from '@type/requests';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type TabScreenProps<S extends keyof TabParamList = keyof TabParamList> =
  BottomTabScreenProps<TabParamList, S>;

export type TabParamList = {
  [Paths.Attendance]: undefined;
  [Paths.Home]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.Profile]: undefined;
  [Paths.Requests]: undefined;
};

export type RootStackParamList = {
  [AppStacks.App]: undefined;
  [AppStacks.Auth]: undefined;
  [Paths.AppTabs]: undefined;
  [Paths.Attendance]: undefined;
  [Paths.AttendanceHistories]: undefined;
  [Paths.Authorization]: undefined;
  [Paths.Carts]: undefined;
  [Paths.CreateRequest]: undefined;
  [Paths.Home]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.PaymentOffline]: { isTab?: boolean } | undefined;
  [Paths.Profile]: undefined;
  [Paths.ProfileInformation]: undefined;
  [Paths.QRCodeViewer]: { isTab?: boolean } | undefined;
  [Paths.RequestDetail]: { id?: string; type?: TRequestType } | undefined;
  [Paths.Requests]: undefined;
  [Paths.Startup]: undefined;
  [Paths.WorkspaceInformation]: undefined;
};
