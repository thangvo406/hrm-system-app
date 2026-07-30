import { AppConstants } from '@constants';
import RequestAddCard from '@dialogs/RequestAddCard';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
  AppSelector,
} from '@services/selectors';
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
import { BANK_ACC_TYPES, PaymentTypes } from '@constants/config';
import { Paths } from '@navigation/paths';

export type PaymentMethod = 'credit_card' | 'virtual_account';

export type IBankAccount = {
  readonly accountMasked: string;
  readonly bankName: string;
  readonly id: string;
};

const BONUS_RATE = 0.005;
export const BONUS_PERCENT = '0.5';
// Sentinel for the "pay from wallet balance" pseudo-account shown in place of
// card/bank accounts when payment cards are disabled.
const BALANCE_ID = '__balance__';

const onAddCard = () => {
  AppNavigator.showDialog({ isFullScreen: true, screen: RequestAddCard });
};

export const useTopUp = (props?: any) => {
  const { isContribute = false, goFrom } = props || {};
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [amountTopUp, setAmountTopUp] = useState('');
  const [methodPayment, setMethodPayment] = useState(
    AppConstants.PaymentTypes.CARD_SAVE,
  );
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);
  const rawDataBankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const bankAccounts = useMemo(() => {
    // Contributing straight from the wallet balance when cards are disabled.
    if (isContribute && !isEnablePaymentCard) {
      return [
        {
          id: BALANCE_ID,
          displayName: t('payment.pay_money_name'),
          type: 'COOP_BALANCE',
          displayNumber: t('payment.balance_amount', {
            amount: currentWallet?.balance,
          }),
        },
      ];
    }
    if (isContribute) {
      return rawDataBankAccounts;
    }
    return rawDataBankAccounts?.filter(it => it.type == BANK_ACC_TYPES.ACCOUNT);
  }, [
    currentWallet?.balance,
    isContribute,
    isEnablePaymentCard,
    rawDataBankAccounts,
    t,
  ]);
  const [selectedAccountId, setSelectedAccountId] = useState<IAccount['id']>();
  const carouselCards = useRef<ICarouselInstance>(null);

  const enabledBtnSubmit = useMemo(() => {
    if (!isEnablePaymentCard) {
      return Number(amountTopUp) >= 1;
    }
    return Number(amountTopUp) >= 1 && bankAccounts?.length > 0;
  }, [amountTopUp, bankAccounts, isEnablePaymentCard]);

  useEffect(() => {
    setSelectedAccountId(bankAccounts?.[0]?.id);
  }, []);

  const bonusAmount = useMemo(
    () => Math.floor(Number(amountTopUp) * BONUS_RATE),
    [amountTopUp],
  );

  const onHandleGoBack = () => {
    if (goFrom == 'accountManagement') {
      AppNavigator.goBack();
    }
  };
  const onSubmit = () => {
    const executorRequest = isContribute
      ? increaseContributionRequest
      : balanceChargeRequest;
    const payment =
      selectedAccountId == BALANCE_ID
        ? { paymentType: PaymentTypes.BALANCE }
        : {
            paymentType: PaymentTypes.SAVED_METHOD,
            paymentMethodId: selectedAccountId,
          };
    dispatch(
      executorRequest({
        amount: Number(amountTopUp),
        payment,
        onSuccess: (data: any) => {
          const _data = data?.kcpSessionData || data;
          AppNavigator.showDialog({
            screen: WebViewScreen,
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
                const cardSelected = bankAccounts?.find(
                  it => it.id == selectedAccountId,
                );
                onRequestClose();
                if (params?.error) {
                  AppNavigator.navigate(Paths.TransactionResult, {
                    ...params,
                    type: isContribute ? 'contribute' : 'topUp',
                    bankName: cardSelected?.displayName,
                    isContribute,
                    status: 'FAILED',
                    onHandleGoBack,
                  });
                } else {
                  // AppNavigator.navigate(Paths.TransactionResult, params);
                  const statuses = {
                    APPROVED: 'SUCCESS',
                    SUCCESS: 'SUCCESS',
                    COMPLETED: 'SUCCESS',
                  };
                  AppNavigator.navigate(Paths.TransactionResult, {
                    ...params,
                    isContribute,
                    type: isContribute ? 'contribute' : 'topUp',
                    bankName: cardSelected?.displayName,
                    onHandleGoBack,
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
    isEnablePaymentCard,
    methodPayment,
    selectedAccountId,
    onAddCard,
    onAmountChange,
    onSelectAccount,
    onSubmit,
    setMethodPayment,
  };
};
