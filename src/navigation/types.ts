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
  [Paths.AcademicVerificationFinish]:
    | { type: 'success' | 'failed' }
    | undefined;
  [Paths.AnnouncementDetail]:
    | { id: number; notification?: NotificationItem; hideBtnNotify?: boolean }
    | undefined;
  [Paths.Announcements]: undefined;
  [Paths.Authorization]: { isLogin: boolean } | undefined;
  [Paths.SchoolSelection]: undefined;
  [Paths.Carts]: undefined;
  [Paths.Contribution]: undefined;
  [Paths.ContributionInput]: undefined;
  [Paths.ConfirmPaymentContribution]: { amount: number } | undefined;
  [Paths.PaymentConfirmContributeFinish]: {
    amount: number;
    paymentMethod: string;
    paymentTime: string;
  } | undefined;
  [Paths.Example]: undefined;
  [Paths.ForgotPass]: undefined;
  [Paths.Home]: undefined;
  [Paths.InputAddress]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.OrderCompleted]: undefined;
  [Paths.OrderHistories]: undefined;
  [Paths.ContributionHistory]: undefined;
  [Paths.PaymentCart]: undefined;
  [Paths.QRCodePayment]: undefined;
  [Paths.RegisterCompleted]: { goFrom: 'forgot_pass' } | undefined;
  [Paths.ProductDetail]: { id: number; storeId: number } | undefined;
  [Paths.Products]: { data: StoreItem } | undefined;
  [Paths.Startup]: undefined;
  [Paths.Stores]: undefined;
  [Paths.Survey]: undefined;
  [Paths.SurveyDetail]: { id: number } | undefined;
  [Paths.TopUp]: undefined;
  [Paths.Welcome]: undefined;
};
