import VerificationFailed from '@components/VerificationFailed';
import { REQUEST_ADD_CARD_METHOD_TYPES } from '@constants/config';
import RegisterCartConfirm from '@dialogs/RegisterCartConfirm';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors/accountManagement';
import {
  addAccountRequest,
  getAccountCardsRequest,
} from '@services/slices/accountManagement/accountManagementSlice';
import { IKcpInitParams } from '@type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WebViewNavigation } from 'react-native-webview';

type UseRequestAddCardParams = {
  readonly onRegisterAccount?: () => void;
  readonly onRegisterCard?: () => void;
  readonly onRequestClose?: () => void;
};

export const useRequestAddCard = ({
  onRequestClose,
}: UseRequestAddCardParams) => {
  // Nothing is highlighted until the user taps a tile (matches the design).
  const [selectedMethod, setSelectedMethod] = useState<string>();
  const [refreshKey, setRefreshKey] = useState(0);
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const accounts = useMemo(() => {
    return rawData?.filter(it => it.type == 'CARD');
  }, [rawData]);

  const cards = useMemo(() => {
    return rawData?.filter(it => it.type == 'BANK_ACCOUNT');
  }, [rawData]);

  const onSelectCard = useCallback(() => {
    setSelectedMethod(REQUEST_ADD_CARD_METHOD_TYPES.CARD);
  }, []);

  const onSelectAccount = useCallback(() => {
    setSelectedMethod(REQUEST_ADD_CARD_METHOD_TYPES.ACCOUNT);
  }, []);

  useEffect(() => {
    // The saga stores the response in redux (getAccountCardsSuccess); rawData
    // above reads it via the selector. refreshKey re-triggers the fetch after
    // a card/account is registered.
    if (refreshKey != 0) {
      dispatch(getAccountCardsRequest({}));
    }
  }, [dispatch, refreshKey]);

  const onManage = useCallback(() => {
    onRequestClose?.();
  }, [onRequestClose]);

  const onShowPopupFailed = () => {
    AppNavigator.showDialog({
      screen: VerificationFailed,
      title: t('request_add_card.failed.title'),
      subTitle: t('request_add_card.failed.subtitle'),
      reason: t('request_add_card.failed.reason'),
      isFullScreen: true,
    });
  };

  const onAddCardFinished = (data: IKcpInitParams) => {
    AppNavigator.showDialog({
      screen: WebViewScreen,
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
            onShowPopupFailed();
          } else {
            setRefreshKey(prev => prev + 1);
          }
        }
      },
      url: data?.kcpWebViewUrl,
      isFullScreen: true,
    });
  };
  const onConfirmAddCard = (payType: string) => () => {
    dispatch(
      addAccountRequest({
        payType,
        onSuccess: onAddCardFinished,
      }),
    );
  };
  const onRegisterAccount = () => {
    onConfirmAddCard(REQUEST_ADD_CARD_METHOD_TYPES.CARD)();
  };
  const onRegisterCard = () => {
    AppNavigator.showDialog({
      screen: RegisterCartConfirm,
      // isFullScreen: true,
      popupType: 'bottomSheet',
      onConfirm: onConfirmAddCard(REQUEST_ADD_CARD_METHOD_TYPES.ACCOUNT),
    });
  };

  // "Proceed" routes to the registration flow of the highlighted tile.
  const onSubmit = useCallback(() => {
    if (selectedMethod === REQUEST_ADD_CARD_METHOD_TYPES.CARD) {
      onRegisterCard?.();
    } else if (selectedMethod === REQUEST_ADD_CARD_METHOD_TYPES.ACCOUNT) {
      onRegisterAccount?.();
    }
  }, [onRegisterAccount, onRegisterCard, selectedMethod]);

  return {
    onManage,
    onSelectAccount,
    onSelectCard,
    onSubmit,
    selectedMethod,
    cards,
    accounts,
  };
};
