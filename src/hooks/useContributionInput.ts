import type { IAccount } from '@type';
import type { IContributeSummary } from '@type/wallet';
import type { WebViewNavigation } from 'react-native-webview';

import { MEMBERSHIP_TYPE, PaymentTypes } from '@constants/config';
import RequestAddCard from '@dialogs/RequestAddCard';
import WebViewScreen from '@dialogs/Webview';
import AppNavigator from '@navigation/AppNavigator';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
  AppSelector,
} from '@services/selectors';
import {
  getContributeSummaryRequest,
  increaseContributionRequest,
} from '@services/slices/payment/paymentSlice';
import { TranslationUtils } from '@utils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CONTRIBUTION_UNIT_PRICE = 100_000;
const RESULT_STATUSES: Record<string, string> = {
  APPROVED: 'SUCCESS',
  COMPLETED: 'SUCCESS',
  SUCCESS: 'SUCCESS',
};

const onAddCard = () => {
  AppNavigator.showDialog({ isFullScreen: true, screen: RequestAddCard });
};

export const useContributionInput = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);
  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const [selectedAccountId, setSelectedAccountId] = useState<IAccount['id']>();
  const [summary, setSummary] = useState<IContributeSummary | undefined>();
  const [amount, setAmount] = useState('');
  const [touchedAmount, setTouchedAmount] = useState(false);

  useEffect(() => {
    setSelectedAccountId(bankAccounts?.[0]?.id);
    if (isEnablePaymentCard && bankAccounts?.length == 0) {
      onAddCard();
    }
    dispatch(
      getContributeSummaryRequest({
        onFailure: () => setSummary(undefined),
        onSuccess: data => setSummary(data),
      }),
    );
  }, []);

  const membershipLabel = useMemo(() => {
    const rawType = profile?.membershipType;
    if (!rawType?.trim?.()) {
      return '-';
    }
    const key = `profile.memberships.${rawType.toLowerCase()}`;
    const baseLabel = TranslationUtils.hasTranslationKey(key)
      ? t(key)
      : t('profile.memberships.other');
    if (rawType === MEMBERSHIP_TYPE.STUDENT) {
      return `${baseLabel} ${t('contribution_input.member_status_enrolled')}`;
    }
    return baseLabel;
  }, [profile?.membershipType, t]);

  // The summary strip values come straight from the API and stay fixed —
  // they do NOT recompute while the user is typing units.
  const unitPrice = summary?.unitPrice ?? CONTRIBUTION_UNIT_PRICE;
  const currentContribution = summary?.currentContribution ?? 0;
  const currentUnits = Math.floor(currentContribution / unitPrice);
  const expectedContribution =
    summary?.expectedContribution ?? currentContribution;
  const expectedUnits =
    summary?.expectedUnits ?? Math.floor(expectedContribution / unitPrice);

  const enabledBtnSubmit = useMemo(() => {
    if (!isEnablePaymentCard) {
      return Number(amount) >= 1;
    }
    return Number(amount) >= 1 && bankAccounts?.length > 0;
  }, [amount, bankAccounts, isEnablePaymentCard]);

  const errorAmount = useMemo(() => {
    if (!touchedAmount || Number(amount) >= 1) {
      return '';
    }
    return t('contribution_input.error_amount_required');
  }, [amount, t, touchedAmount]);

  const onAmountChange = (value: string) => {
    setTouchedAmount(true);
    setAmount(value.replaceAll(/\D/g, '').replace(/^0+/, ''));
  };

  const onSelectAccount = (itemId: IAccount['id']) => {
    setSelectedAccountId(itemId);
  };

  const onSubmit = () => {
    dispatch(
      increaseContributionRequest({
        amount: Number(amount),
        payment: {
          paymentMethodId:
            selectedAccountId == undefined
              ? undefined
              : Number(selectedAccountId),
          paymentType: PaymentTypes.SAVED_METHOD,
        },
        onSuccess: (data: any) => {
          const _data = data?.kcpSessionData || data;
          AppNavigator.showDialog({
            cookies: {
              ordr_idxx: _data?.orderNo,
              qpay_sdk_url: _data?.qpaySdkUrl,
              qtid: _data?.qtid,
              req_amt: _data?.reqAmt,
              req_type: _data?.reqType,
              site_cd: _data?.siteCd,
            },
            isFullScreen: true,
            onNavigationStateChange: (
              navState: WebViewNavigation,
              onRequestClose: any,
            ) => {
              const { url } = navState || {};
              const isDeeplinkApp = url?.startsWith?.('coop://');
              if (!isDeeplinkApp) {
                return;
              }
              const params = deepLinkGate.getPathFromUrl(navState.url);
              const resultStatus = params?.status as string | undefined;
              const cardSelected = bankAccounts?.find(
                it => it.id == selectedAccountId,
              );
              onRequestClose();
              AppNavigator.navigate(Paths.TransactionResult, {
                ...params,
                bankName: cardSelected?.displayName,
                isContribute: true,
                status: params?.error
                  ? 'FAILED'
                  : RESULT_STATUSES[resultStatus ?? ''] || resultStatus,
                type: 'contribute',
              });
            },
            screen: WebViewScreen,
            url: _data?.kcpWebViewUrl,
          });
        },
        onFailure: error => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
      }),
    );
  };

  return {
    amount,
    bankAccounts,
    currentContribution,
    currentUnits,
    enabledBtnSubmit,
    errorAmount,
    expectedContribution,
    expectedUnits,
    isEnablePaymentCard,
    membershipLabel,
    onAmountChange,
    onSelectAccount,
    onSubmit,
    selectedAccountId,
    unitPrice,
  };
};
