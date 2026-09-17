import type { AppStacks, Paths } from '@navigation/paths';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type TabScreenProps<S extends keyof TabParamList = keyof TabParamList> =
  BottomTabScreenProps<TabParamList, S>;

export type TabParamList = {
  [Paths.Carts]: undefined;
  [Paths.Home]: undefined;
  [Paths.PaymentOffline]: { isTab?: boolean } | undefined;
  [Paths.Profile]: undefined;
  [Paths.QRCodeViewer]: { isTab?: boolean } | undefined;
};

export type RootStackParamList = {
  [AppStacks.App]: undefined;
  [AppStacks.Auth]: undefined;
  [Paths.AppTabs]: undefined;
  [Paths.Authorization]: undefined;
  [Paths.Carts]: undefined;
  [Paths.Home]: undefined;
  [Paths.PaymentOffline]: { isTab?: boolean } | undefined;
  [Paths.Profile]: undefined;
  [Paths.QRCodeViewer]: { isTab?: boolean } | undefined;
  [Paths.Startup]: undefined;
};
