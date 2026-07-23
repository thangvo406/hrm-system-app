import type { AppStacks, Paths } from '@navigation/paths';
import type { StackScreenProps } from '@react-navigation/stack';
import { TNotificationItem } from '@type';
import { IStoreItem } from '@type/store';
import type { ITransactionDetail } from '@type/payment';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type TabParamList = {
  [Paths.Vouchers]: undefined;
  [Paths.Home]: undefined;
  [Paths.QRCodePayment]: undefined;
  [Paths.Carts]: undefined;
  [Paths.Profile]: undefined;
};

export type RootStackParamList = {
  [AppStacks.Auth]: undefined;
  [AppStacks.App]: undefined;
  [Paths.AppTabs]: undefined;
  [Paths.AcademicVerificationFinish]:
    | { type: 'success' | 'failed' }
    | undefined;
  [Paths.AnnouncementDetail]:
    | { id: number; notification?: TNotificationItem; hideBtnNotify?: boolean }
    | undefined;
  [Paths.Announcements]: undefined;
  [Paths.Authorization]: { isLogin: boolean } | undefined;
  [Paths.SchoolSelection]: undefined;
  [Paths.Carts]: undefined;
  [Paths.Contribution]: undefined;
  [Paths.ContributionInput]: undefined;
  [Paths.ConfirmPaymentContribution]: { amount: number } | undefined;
  [Paths.PaymentConfirmContributeFinish]:
    | {
        amount: number;
        paymentMethod: string;
        paymentTime: string;
      }
    | undefined;
  [Paths.Example]: undefined;
  [Paths.ForgotPass]: undefined;
  [Paths.Home]: undefined;
  [Paths.InputAddress]: undefined;
  [Paths.Notifications]: undefined;
  [Paths.OrderCompleted]:
    | {
        data?: unknown;
        dataOrder?: { deliveryMethod?: string; paymentMethod?: string };
        status?: 'pending' | 'success';
      }
    | undefined;
  [Paths.OrderHistories]: undefined;
  [Paths.TransactionDetail]: { data?: ITransactionDetail } | undefined;
  [Paths.ContributionHistory]: undefined;
  [Paths.PayPointHistories]: undefined;
  [Paths.PointMain]: undefined;
  [Paths.CartDetail]: undefined;
  [Paths.QRCodePayment]: undefined;
  [Paths.RegisterCard]: undefined;
  [Paths.RegisterCompleted]: { goFrom: 'forgot_pass' } | undefined;
  [Paths.ProductDetail]: { id: number; storeId: number } | undefined;
  [Paths.Products]: { data: IStoreItem } | undefined;
  [Paths.Profile]: undefined;
  [Paths.RefundRequest]: undefined;
  [Paths.SourceOfFund]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Stores]: undefined;
  [Paths.Survey]: undefined;
  [Paths.SurveyDetail]: { id: number } | undefined;
  [Paths.TopUp]: undefined;
  [Paths.UpdatePass]: undefined;
  [Paths.Vouchers]: undefined;
  [Paths.Welcome]: undefined;
};
