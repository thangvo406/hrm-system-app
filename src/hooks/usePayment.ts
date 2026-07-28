import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useCallback, useEffect, useMemo, useState } from 'react';
import RequestAddCard from '@dialogs/RequestAddCard';
import VouchersSelection from '@dialogs/VouchersSelection';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';
import { createOrderRequest } from '@services/slices/payment/paymentSlice';
import WebViewScreen from '@dialogs/Webview';
import { PaymentTypes } from '@constants/config';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';

export type IPaymentCoupon = {
  readonly id: string;
  readonly name: string;
};

export type PaymentMethodType = 'account' | 'card' | 'easy';

// A single source of truth for the selected payment method, so only one item
// across the card carousel AND the account carousel can be selected at a time.
export type SelectedPaymentMethod = {
  readonly id: string;
  readonly type: PaymentMethodType;
};

// TODO(api): replace mock values with the payment-method summary response.
const PAY_MONEY_BALANCE = 87_500;
const POINT_HOLDING = 11_000;
const POINT_USED = 3000;
const SELECTED_COUPON: IPaymentCoupon = {
  id: 'coupon-free-drink',
  name: '음료무료쿠폰',
};

export const PRIMARY_CARD_INDEX = 0;

export const usePayment = (props: any) => {
  // Default to the primary card so a method is highlighted on open.
  const [selectedMethod, setSelectedMethod] = useState<SelectedPaymentMethod>(
    {},
  );
  const [usePoints, setUsePoints] = useState(true);
  const [pointUsed, setPointUsed] = useState(POINT_USED);

  const onToggleUsePoints = () => {
    setUsePoints(previous => !previous);
  };

  const onChangePointUsed = (text: string) => {
    const numeric = Number(text.replaceAll(/\D/g, ''));
    setPointUsed(Number.isNaN(numeric) ? 0 : numeric);
  };
  const { payloadRequest } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );

  const disableBtnSubmit = useMemo(() => {
    return !selectedMethod?.id;
  }, [selectedMethod]);

  const selectedCardId =
    selectedMethod.type === 'card' ? selectedMethod.id : undefined;
  const selectedEasyPayId =
    selectedMethod.type === 'easy' ? selectedMethod.id : undefined;

  const onSelectCard = useCallback((id: string) => {
    setSelectedMethod({ id, type: 'card' });
  }, []);

  const onSelectedEasyPay = useCallback((id: string) => {
    setSelectedMethod({ id, type: 'easy' });
  }, []);

  useEffect(() => {
    onSelectCard(bankAccounts?.[0]?.id);
  }, []);

  const onSelectCoupon = () => {
    AppNavigator.showDialog({
      screen: VouchersSelection,
      isFullScreen: true,
      storeId: payloadRequest?.storeId,
      orderAmount: payloadRequest?.totalAmount,
      // popupType: 'bottomSheet',
    });
  };

  const onSelectGeneralMethod = useCallback(() => {
    AppNavigator.showDialog({
      screen: RequestAddCard,
      isFullScreen: true,
    });
  }, []);

  const handleRedirectPayment = (data: any, paymentMethod: any) => {
    const { responseCreateOrder, responsePayment } = data || {};
    const { kcpInitParams: _data } = responsePayment || {};
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
      url: _data?.kcpWebViewUrl,
      isFullScreen: true,
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
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: {},
              status: 'pending',
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: paymentMethod?.paymentType,
              },
            });
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: responseCreateOrder,
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: paymentMethod?.paymentType,
              },
            });
          }
        }
      },
    });
  };

  const onPay = useCallback(() => {
    let paymentMethod = {};
    if (selectedMethod?.type == 'card') {
      paymentMethod = {
        paymentType: PaymentTypes.SAVED_METHOD,
        paymentMethodId: selectedMethod.id,
      };
    } else if (selectedMethod.type == 'easy') {
      paymentMethod = {
        paymentType: PaymentTypes.EASY_PAY,
        easyPayMethod: selectedMethod.id,
      };
    }
    dispatch(
      createOrderRequest({
        ...payloadRequest,
        createLinkRequest: {
          payment: paymentMethod,
        },
        onSuccess: (data: any) => {
          const { responsePayment, responseCreateOrder } = data || {};
          if (responsePayment?.requiresRedirect) {
            handleRedirectPayment(data, paymentMethod);
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: responseCreateOrder,
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: paymentMethod?.paymentType,
              },
            });
          }
        },
        onFailure: (_type: string, error: any) => {
          if (typeof error == 'string') {
            AppNavigator.showSnackBar({
              message: error,
              type: 'failed',
            });
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: error,
              status: 'pending',
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: paymentMethod?.paymentType,
              },
            });
          }
        },
      }),
    );
  }, [selectedMethod, payloadRequest]);

  return {
    initialIndex: PRIMARY_CARD_INDEX,
    payloadRequest,
    onPay,
    selectedEasyPayId,
    onSelectCard,
    onSelectCoupon,
    onSelectGeneralMethod,
    onChangePointUsed,
    onToggleUsePoints,
    onSelectedEasyPay,
    bankAccounts,
    payMoneyBalance: PAY_MONEY_BALANCE,
    pointHolding: POINT_HOLDING,
    pointUsed,
    disableBtnSubmit,
    usePoints,
    selectedCardId,
    selectedCoupon: SELECTED_COUPON,
  };
};
