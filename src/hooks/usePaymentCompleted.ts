import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import AppNavigator from '@navigation/AppNavigator';
import { Paths as AppPaths } from '@navigation/paths';

export type PaymentCompletedResult = {
  readonly amount: number;
  readonly paymentAt: string;
  readonly paymentMethod: string;
  readonly storeName: string;
};

// TODO(api): replace mock values with the payment result passed on navigation.
const MOCK_RESULT: PaymentCompletedResult = {
  amount: 15_500,
  paymentAt: '2026-07-20 14:32',
  paymentMethod: '생협페이카드 **** 4521',
  storeName: '국민대학교 생협매장',
};

export const usePaymentCompleted = (
  props: RootScreenProps<Paths.PaymentCompleted>,
) => {
  const params = AppNavigator.getParams(props) as
    | Partial<PaymentCompletedResult>
    | undefined;

  const result: PaymentCompletedResult = {
    amount: params?.amount ?? MOCK_RESULT.amount,
    paymentAt: params?.paymentAt ?? MOCK_RESULT.paymentAt,
    paymentMethod: params?.paymentMethod ?? MOCK_RESULT.paymentMethod,
    storeName: params?.storeName ?? MOCK_RESULT.storeName,
  };

  const onConfirm = () => {
    AppNavigator.reset(AppPaths.AppTabs, { screen: AppPaths.Home });
  };

  return {
    ...result,
    onConfirm,
  };
};
