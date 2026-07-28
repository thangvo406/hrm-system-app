import { AppConstants } from '@constants';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';
// import { topUpWalletRequest } from '@services/slices/account/accountSlice';
import {
  balanceChargeRequest,
  increaseContributionRequest,
} from '@services/slices/payment/paymentSlice';
// import uniqueId from 'lodash/uniqueId';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IAccount } from '@type';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { PaymentTypes } from '@constants/config';
import { Paths } from '@navigation/paths';

export type PaymentMethod = 'credit_card' | 'virtual_account';

export type IBankAccount = {
  readonly accountMasked: string;
  readonly bankName: string;
  readonly id: string;
};

const BONUS_RATE = 0.005;
export const BONUS_PERCENT = '0.5';

export const useTopUp = (props?: any) => {
  const { isContribute = false } = props || {};
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
    setSelectedAccountId(bankAccounts?.[0]?.id);
  }, []);

  const bonusAmount = useMemo(
    () => Math.floor(Number(amountTopUp) * BONUS_RATE),
    [amountTopUp],
  );

  const onSubmit = () => {
    const executorRequest = isContribute
      ? increaseContributionRequest
      : balanceChargeRequest;
    dispatch(
      executorRequest({
        amount: Number(amountTopUp),
        payment: {
          paymentType: PaymentTypes.SAVED_METHOD,
          paymentMethodId: selectedAccountId,
        },
        onSuccess: (data: any) => {
          const _data = data?.kcpSessionData || data;
          AppNavigator.showDialog({
            screen: WebViewScreen,
            title: t('common.payment'),
            cookies: {
              site_cd: _data?.siteCd,
              req_type: _data?.reqType,
              ordr_idxx: _data?.orderNo,
              req_amt: _data?.reqAmt,
              qtid: _data?.qtid,
              qpay_sdk_url: _data?.qpaySdkUrl,
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
                  AppNavigator.navigate(Paths.TransactionResult, {
                    ...params,
                    isContribute,
                    status: 'FAILED',
                  });
                } else {
                  // AppNavigator.navigate(Paths.TransactionResult, params);
                  const statuses = {
                    APPROVED: 'SUCCESS',
                  };
                  AppNavigator.navigate(Paths.TransactionResult, {
                    ...params,
                    isContribute,
                    status: statuses[params?.status] || params?.status,
                  });
                }
              }
            },
            url: _data?.kcpWebViewUrl,
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

  const onSelectAccount = (itemId: IAccount['id']) => {
    setSelectedAccountId(itemId);
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
