import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
// import { topUpWalletRequest } from '@services/slices/account/accountSlice';
import { initChargeRequest } from '@services/slices/payment/paymentSlice';
// import uniqueId from 'lodash/uniqueId';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type PaymentMethod = 'credit_card' | 'virtual_account';

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card' as PaymentMethod,
  VIRTUAL_ACCOUNT: 'virtual_account' as PaymentMethod,
} as const;

export const useTopUp = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [amountTopUp, setAmountTopUp] = useState('');
  const [methodPayment, setMethodPayment] = useState<PaymentMethod>(
    PAYMENT_METHODS.CREDIT_CARD,
  );

  const enabledBtnSubmit = useMemo(() => {
    return Number(amountTopUp) >= 1;
  }, [amountTopUp]);

  const onSubmit = () => {
    dispatch(
      initChargeRequest({
        amount: Number(amountTopUp),
        paymentType: 'CARD_DIRECT',
        onSuccess: data => {
          AppNavigator.showDialog({
            screen: WebViewScreen,
            url: 'http://192.168.1.67:3000/kcptest.html',
            isFullScreen: true,
            title: t('common.payment'),
            data: {
              ...data,
              amount: Number(amountTopUp),
            },
          });
        },
      }),
    );
    // dispatch(
    //   topUpWalletRequest({
    //     amount: Number(amountTopUp),
    //     paymentProvider: methodPayment,
    //     paymentTransactionId: uniqueId(),
    //     description: 'Recharge from top-up feature of app',
    //     onSuccess: () => {
    //       AppNavigator.showSnackBar({
    //         message: 'Topup successfully.',
    //         type: 'success',
    //       });
    //     },
    //     onFailure: (message: string) => {
    //       AppNavigator.showSnackBar({
    //         message: message || '',
    //         type: 'failed',
    //       });
    //     },
    //   }),
    // );
  };
  const onAmountChange = (value: string) => {
    setAmountTopUp(value.replaceAll(/\D/g, ''));
  };

  return {
    amountTopUp,
    enabledBtnSubmit,
    methodPayment,
    onAmountChange,
    setMethodPayment,
    onSubmit,
  };
};
