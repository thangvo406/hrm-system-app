import { AppConstants } from '@constants';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
// import { topUpWalletRequest } from '@services/slices/account/accountSlice';
import { balanceChargeRequest } from '@services/slices/payment/paymentSlice';
// import uniqueId from 'lodash/uniqueId';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type PaymentMethod = 'credit_card' | 'virtual_account';

export const useTopUp = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [amountTopUp, setAmountTopUp] = useState('');
  const [methodPayment, setMethodPayment] = useState(
    AppConstants.PaymentTypes.CARD_SAVE,
  );

  const enabledBtnSubmit = useMemo(() => {
    return Number(amountTopUp) >= 1;
  }, [amountTopUp]);

  const onSubmit = () => {
    dispatch(
      balanceChargeRequest({
        amount: Number(amountTopUp),
        payment: {
          paymentType: methodPayment,
          vaBankCode: '088',
        },
        onSuccess: data => {
          AppNavigator.showDialog({
            screen: WebViewScreen,
            title: t('common.payment'),
            data: {
              siteCd: data?.siteCd,
              orderNo: data?.orderNo,
              amount: data?.reqAmt,
              qtid: data?.qtid,
            },
            url: data?.kcpWebViewUrl,
            isFullScreen: true,
          });
        },
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
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
