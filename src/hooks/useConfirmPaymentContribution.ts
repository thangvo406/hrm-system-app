import { useState } from 'react';
import { useAppDispatch } from '@services/common/storeHooks';
import { increaseContributionRequest } from '@services/slices/payment/paymentSlice';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import dayjs from 'dayjs';

export type ContributionPaymentMethod = 'BANK_TRANSFER';

export const CONTRIBUTION_PAYMENT_METHODS: readonly {
  readonly id: ContributionPaymentMethod;
  readonly labelKey: string;
}[] = [
  {
    id: 'BANK_TRANSFER',
    labelKey: 'confirm_payment_contribution.method_bank_transfer',
  },
];

export const useConfirmPaymentContribution = (amount: number) => {
  const dispatch = useAppDispatch();
  const [selectedMethod, setSelectedMethod] =
    useState<ContributionPaymentMethod>('BANK_TRANSFER');

  const onSubmit = () => {
    dispatch(
      increaseContributionRequest({
        amount,
        payment: {
          paymentType: 'VIRTUAL_ACCOUNT',
          vaBankCode: '088',
        },
        onSuccess: () => {
          AppNavigator.navigate(Paths.PaymentConfirmContributeFinish, {
            amount,
            paymentMethod:
              selectedMethod === 'BANK_TRANSFER'
                ? '생협페이계좌 (계좌이체)'
                : selectedMethod,
            paymentTime: dayjs().format('YYYY-MM-DD HH:mm A'),
          });
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({
            message: message || '',
            type: 'failed',
          });
        },
      }),
    );
  };

  return {
    onSubmit,
    selectedMethod,
    setSelectedMethod,
  };
};
