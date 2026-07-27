import { AppConstants } from '@constants';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';
// import { topUpWalletRequest } from '@services/slices/account/accountSlice';
import { balanceChargeRequest } from '@services/slices/payment/paymentSlice';
// import uniqueId from 'lodash/uniqueId';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IAccount } from '@type';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';

export type PaymentMethod = 'credit_card' | 'virtual_account';

export type IBankAccount = {
  readonly accountMasked: string;
  readonly bankName: string;
  readonly id: string;
};

const BONUS_RATE = 0.005;
export const BONUS_PERCENT = '0.5';

export const useTopUp = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [amountTopUp, setAmountTopUp] = useState('');
  const [methodPayment, setMethodPayment] = useState(
    AppConstants.PaymentTypes.CARD_SAVE,
  );
  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const [selectedAccountId, setSelectedAccountId] = useState<IAccount['id']>();
  const carouselCards = useRef<ICarouselInstance>(null);

  const enabledBtnSubmit = useMemo(() => {
    return Number(amountTopUp) >= 1;
  }, [amountTopUp]);

  useEffect(() => {
    setSelectedAccountId(bankAccounts?.[0]?.id)
  }, [])
  

  const bonusAmount = useMemo(
    () => Math.floor(Number(amountTopUp) * BONUS_RATE),
    [amountTopUp],
  );

  const onSubmit = () => {
    dispatch(
      balanceChargeRequest({
        amount: Number(amountTopUp),
        payment: {
          paymentType: 'SAVED_METHOD',
          paymentMethodId: selectedAccountId,
        },
        onSuccess: data => {
          AppNavigator.showDialog({
            screen: WebViewScreen,
            title: t('common.payment'),
            cookies: {
              site_cd: data?.siteCd,
              req_type: data?.reqType,
              ordr_idxx: data?.orderNo,
              req_amt: data?.reqAmt,
              qtid: data?.qtid,
              qpay_sdk_url: data?.qpaySdkUrl,
            },
            onNavigationStateChange: (
              navState: WebViewNavigation,
              onRequestClose: any,
            ) => {
              const { url } = navState || {};
              // coop://registration/identity/failure?error=cert_failed
              const isDeeplinkApp = url?.startsWith?.('coop://');
              if (isDeeplinkApp) {
                const params = deepLinkGate.getPathFromUrl(navState.url);
                onRequestClose();
                if (params?.error) {
                  // onShowPopupFailed();
                } else {
                  // setRefreshKey(prev => prev + 1);
                }
              }
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

  const onSelectAccount = (itemId: string) => {
    setSelectedAccountId(itemId);
    // carouselCards.current?.scrollTo({ animated: true, index });
  };

  return {
    amountTopUp,
    bankAccounts,
    bonusAmount,
    carouselCards,
    enabledBtnSubmit,
    methodPayment,
    selectedAccountId,
    onAmountChange,
    onSelectAccount,
    onSubmit,
    setMethodPayment,
  };
};
