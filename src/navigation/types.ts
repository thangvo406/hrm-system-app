import type { AppStacks, Paths } from '@navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';
import { NotificationItem } from '@type';
import { StoreItem } from '@type/store';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [AppStacks.Auth]: undefined;
  [AppStacks.App]: undefined;
  [Paths.AnnouncementDetail]: { id: number, notification?: NotificationItem, hideBtnNotify?: boolean } | undefined;
  [Paths.Announcements]: undefined;
  [Paths.Authorization]: { isLogin: boolean } | undefined;
  [Paths.Carts]: undefined;
  [Paths.Contribution]: undefined;
  [Paths.Example]: undefined;
  [Paths.ForgotPass]: undefined;
  [Paths.Home]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.PayCard]: undefined;
  [Paths.PaymentCart]: undefined;
  [Paths.ProductDetail]: { id: number, storeId: number } | undefined;
  [Paths.Products]: { data: StoreItem } | undefined;
  [Paths.Startup]: undefined;
  [Paths.Stores]: undefined;
  [Paths.Survey]: undefined;
  [Paths.SurveyDetail]: { id: number } | undefined;
  [Paths.TopUp]: undefined;
  [Paths.Welcome]: undefined;
};
