import type { Paths } from '@navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';

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
  [Paths.ProductDetail]: { id: number } | undefined;
  [Paths.Products]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Survey]: undefined;
  [Paths.SurveyDetail]: { id: number } | undefined;
  [Paths.Welcome]: undefined;
};
