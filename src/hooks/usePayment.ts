import type { PointUsageCardHandle } from '@components';

import AppNavigator from '@navigation/AppNavigator';
import { AppStacks, Paths } from '@navigation/paths';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RequestAddCard from '@dialogs/RequestAddCard';
import VouchersSelection from '@dialogs/VouchersSelection';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
  AppSelector,
} from '@services/selectors';
import {
  calculatePriceRequest,
  createOrderRequest,
} from '@services/slices/payment/paymentSlice';
import WebViewScreen from '@dialogs/Webview';
import { PaymentTypes } from '@constants/config';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';
import Information from '@dialogs/Information';
import { IPriceDetail } from '@type';
import debounce from 'lodash/debounce';

export type IPaymentCoupon = {
  readonly couponId?: number;
  readonly id: string;
  readonly name: string;
};

export type PaymentMethodType = 'account' | 'card' | 'easy';
const BALANCE_ID = '__balance__';
// A single source of truth for the selected payment method, so only one item
// across the card carousel AND the account carousel can be selected at a time.
export type SelectedPaymentMethod = {
  readonly id: string;
  readonly cardType: string;
  readonly displayName?: string;
  readonly type: PaymentMethodType;
};

export const PRIMARY_CARD_INDEX = 0;
const CALCULATE_PRICE_DEBOUNCE_MS = 350;

type CalculatePriceParams = {
  readonly couponId?: number;
  readonly point: number;
  readonly usePoint: boolean;
};

export const usePayment = (props: any) => {
  const { t } = useTranslation();
  // Default to the primary card so a method is highlighted on open.
  const [selectedMethod, setSelectedMethod] = useState<SelectedPaymentMethod>(
    {} as SelectedPaymentMethod,
  );
  const [usePoints, setUsePoints] = useState(true);
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);
  // Số point server thực sự áp dụng — dùng để hiển thị và để tạo đơn. Không có
  // effect nào theo dõi nó, nên việc server chỉnh lại point không kéo theo một
  // lần tính giá nữa.
  const [pointUsed, setPointUsed] = useState(0);
  const [priceDetail, setPriceDetail] = useState<IPriceDetail>();
  const pointViewRef = useRef<PointUsageCardHandle>(null);
  const [voucherSelected, setVoucherSelected] = useState<IPaymentCoupon>();
  const { cartId, payloadRequest } = AppNavigator.getParams(props);
  const dispatch = useAppDispatch();
  const rawDataBankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );

  const bankAccounts = useMemo(() => {
    const balanceAccount = {
      id: BALANCE_ID,
      displayName: t('payment.pay_money_name'),
      type: 'COOP_BALANCE',
      displayNumber: t('payment.balance_amount', {
        amount: currentWallet?.balance,
      }),
    };
    // With payment cards disabled, the wallet balance is the only method.
    return isEnablePaymentCard
      ? [balanceAccount, ...rawDataBankAccounts]
      : [balanceAccount];
  }, [currentWallet?.balance, isEnablePaymentCard, rawDataBankAccounts, t]);

  const disableBtnSubmit = useMemo(() => {
    return !selectedMethod?.id;
  }, [selectedMethod]);

  const selectedCardId =
    selectedMethod.type === 'card' ? selectedMethod.id : undefined;
  const selectedEasyPayId =
    selectedMethod.type === 'easy' ? selectedMethod.id : undefined;

  const onSelectCard = useCallback((item: any) => {
    setSelectedMethod({
      id: item?.id,
      displayName: item.displayName,
      cardType: item?.type,
      type: 'card',
    });
  }, []);

  const onSelectedEasyPay = useCallback((id: string) => {
    setSelectedMethod({ id, cardType: 'easyPay', type: 'easy' });
  }, []);

  const calculatePrice = useCallback(
    ({ couponId, point, usePoint }: CalculatePriceParams) => {
      dispatch(
        calculatePriceRequest({
          cartId,
          storeId: payloadRequest?.storeId,
          totalMoney: payloadRequest?.totalAmount,
          point: usePoint ? point : 0,
          couponId,
          onSuccess: (response: IPriceDetail) => {
            const pointApplied = response?.pointApplied;
            if (response.pointApplied) {
              delete response.pointApplied;
            }
            setPriceDetail(response);
            if (usePoint && pointApplied < point) {
              setPointUsed(pointApplied);
              pointViewRef.current?.focus();
            }
          },
          onFailure: () => {
            setPriceDetail(prev =>
              prev
                ? prev
                : ({ totalMoney: payloadRequest?.totalAmount } as IPriceDetail),
            );
          },
        }),
      );
    },
    [dispatch, payloadRequest?.storeId, cartId, payloadRequest?.totalAmount],
  );

  const debouncedCalculatePrice = useMemo(
    () => debounce(calculatePrice, CALCULATE_PRICE_DEBOUNCE_MS),
    [calculatePrice],
  );

  useEffect(() => {
    return () => {
      debouncedCalculatePrice.cancel();
    };
  }, [debouncedCalculatePrice]);

  // Việc tính lại giá luôn xuất phát từ hành động của user, nên nó nằm trong
  // handler thay vì trong effect theo dõi state.
  const onToggleUsePoints = () => {
    const nextUsePoints = !usePoints;
    setUsePoints(nextUsePoints);
    debouncedCalculatePrice({
      couponId: voucherSelected?.couponId,
      point: pointUsed,
      usePoint: nextUsePoints,
    });
  };

  const onChangePointUsed = (numeric: number) => {
    const point = Number.isNaN(numeric) ? 0 : numeric;
    setPointUsed(point);
    setUsePoints(true);
    debouncedCalculatePrice({
      couponId: voucherSelected?.couponId,
      point,
      usePoint: true,
    });
  };

  useEffect(() => {
    calculatePrice({ point: 0, usePoint: usePoints });
  }, []);

  useEffect(() => {
    onSelectCard(bankAccounts?.[0]);
  }, []);

  const onSelectCoupon = () => {
    AppNavigator.showDialog({
      screen: VouchersSelection,
      isFullScreen: true,
      // Chọn voucher là hành động rời rạc nên gọi ngay, không debounce.
      onSubmit: (item: any) => {
        setVoucherSelected(item);
        calculatePrice({
          couponId: item?.couponId,
          point: pointUsed,
          usePoint: usePoints,
        });
      },
      itemSelected: voucherSelected,
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

  const getCookiesForPayment = (data: any) => {
    const { kcpInitParams, stdPayInitParams } = data?.responsePayment || {};
    if (selectedEasyPayId) {
      return {
        cookies: {
          site_cd: stdPayInitParams?.siteCd,
          pay_method: stdPayInitParams?.payMethod,
          shop_name: stdPayInitParams?.shopName,
          ordr_idxx: stdPayInitParams?.ordrIdxx,
          good_name: stdPayInitParams?.goodName,
          good_mny: stdPayInitParams?.goodMny,
          buyr_name: stdPayInitParams?.buyrName,
          buyr_tel2: stdPayInitParams?.buyrTel,
          buyr_mail: stdPayInitParams?.buyrMail,
          Ret_URL: stdPayInitParams?.retUrl,
          approval_key: stdPayInitParams?.approvalKey,
          PayUrl: stdPayInitParams?.payUrl,
        },
        url: stdPayInitParams?.stdWebViewUrl,
      };
    } else {
      return {
        cookies: {
          site_cd: kcpInitParams?.siteCd,
          req_type: kcpInitParams?.reqType,
          ordr_idxx: kcpInitParams?.orderNo,
          req_amt: kcpInitParams?.reqAmt,
          qtid: kcpInitParams?.qtid,
          qpay_sdk_url: kcpInitParams?.qpaySdkUrl,
        },
        url: kcpInitParams?.kcpWebViewUrl,
      };
    }
  };
  const handleRedirectPayment = (data: any) => {
    const { responseCreateOrder } = data || {};
    const { cookies, url } = getCookiesForPayment(data);
    AppNavigator.showDialog({
      screen: WebViewScreen,
      cookies,
      url,
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
            AppNavigator.reset(Paths.OrderCompleted, {
              data: {},
              status: 'pending',
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: selectedMethod?.displayName,
              },
            });
          } else {
            AppNavigator.reset(Paths.OrderCompleted, {
              data: responseCreateOrder,
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: selectedMethod?.displayName,
              },
            });
          }
        }
      },
    });
  };

  const onPay = useCallback(() => {
    let paymentMethod = {};
    if (selectedMethod.id == BALANCE_ID) {
      if ((currentWallet?.balance || 0) < payloadRequest?.totalAmount) {
        AppNavigator.showDialog({
          screen: Information,
          title: t('payment.errors.balance_title'),
          desc: t('payment.errors.balance_desc'),
          confirmTitle: t('payment.errors.balance_btn_confirm'),
          cancelTitle: t('common.popup.btn_close'),
          onConfirm: () => {
            AppNavigator.resetToNestedState(AppStacks.App, {
              index: 1,
              routes: [{ name: Paths.AppTabs }, { name: Paths.TopUp }],
            });
          },
        });
        return;
      }
      paymentMethod = {
        paymentType: PaymentTypes.BALANCE,
      };
    } else if (selectedMethod?.type == 'card') {
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
        couponId: voucherSelected?.couponId,
        createLinkRequest: {
          payment: paymentMethod,
          pointAmount: usePoints ? pointUsed : 0,
        },
        onSuccess: (data: any) => {
          const { responsePayment, responseCreateOrder } = data || {};
          if (responsePayment?.requiresRedirect) {
            handleRedirectPayment(data);
          } else {
            AppNavigator.navigate(Paths.OrderCompleted, {
              data: responseCreateOrder,
              dataOrder: {
                deliveryMethod: payloadRequest?.receiveMethod,
                paymentMethod: selectedMethod?.displayName,
                totalAmount: priceDetail?.finalMoney,
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
                paymentMethod: selectedMethod?.displayName,
                totalAmount: priceDetail?.finalMoney,
              },
            });
          }
        },
      }),
    );
  }, [
    selectedMethod,
    payloadRequest,
    usePoints,
    voucherSelected,
    pointUsed,
    currentWallet?.balance,
  ]);

  return {
    initialIndex: PRIMARY_CARD_INDEX,
    payloadRequest,
    priceDetail,
    onPay,
    selectedEasyPayId,
    onSelectCard,
    onSelectCoupon,
    onSelectGeneralMethod,
    onChangePointUsed,
    onToggleUsePoints,
    onSelectedEasyPay,
    pointViewRef,
    bankAccounts,
    isEnablePaymentCard,
    payMoneyBalance: currentWallet?.balance,
    pointHolding: currentWallet?.pointBalance,
    pointUsed,
    disableBtnSubmit,
    usePoints,
    selectedCardId,
    voucherSelected,
  };
};
