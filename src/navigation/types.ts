import type { Paths } from '@navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';
import { StoreItem } from '@type/store';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.AnnouncementDetail]: { id: number } | undefined;
  [Paths.Announcements]: undefined;
  [Paths.Authorization]: { isLogin: boolean } | undefined;
  [Paths.Contribution]: undefined;
  [Paths.Example]: undefined;
  [Paths.ForgotPass]: undefined;
  [Paths.Home]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.PayCard]: undefined;
  [Paths.ProductDetail]: { id: number, storeId: number } | undefined;
  [Paths.Products]: { data: StoreItem } | undefined;
  [Paths.Startup]: undefined;
  [Paths.Stores]: undefined;
  [Paths.Survey]: undefined;
  [Paths.SurveyDetail]: { id: number } | undefined;
  [Paths.Welcome]: undefined;
};
