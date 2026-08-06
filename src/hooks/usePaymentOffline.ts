import QRCodeViewerView from '@components/QRCodeViewerView';
import AppNavigator from '@navigation/AppNavigator';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/product';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
  AppSelector,
} from '@services/selectors';
import { IAccount } from '@type';
import { generateQRCodePayRequest } from '@services/slices/payment/paymentSlice';
import { ScaleSize } from '@kits/core';

export type PaymentMethodKind = 'bank' | 'card' | 'money';

export type IPaymentMethod = {
  readonly id: string;
  readonly kind: PaymentMethodKind;
  readonly label: string;
  readonly subLabel: string;
  readonly tag: string;
};

const PRIMARY_CARD_INDEX = 0;
// Sentinel for the "pay from wallet balance" pseudo-account shown in place of
// card/bank accounts when payment cards are disabled.
const BALANCE_ID = '__balance__';

export const usePaymentOffline = () => {
  const { t } = useTranslation();
  const rawBankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);

  const BALANCE_ITEM = useMemo(() => {
    return {
      id: BALANCE_ID,
      displayName: t('payment.pay_money_name'),
      type: 'COOP_BALANCE',
      displayNumber: t('payment.balance_amount', {
        amount: currentWallet?.balance,
      }),
    };
  }, []);

  const bankAccounts = useMemo(() => {
    return [BALANCE_ITEM];
  }, [currentWallet?.balance, rawBankAccounts, t]);
  const [usePoints, setUsePoints] = useState(true);
  const [pointUsed, setPointUsed] = useState(0);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    bankAccounts?.[PRIMARY_CARD_INDEX]?.id,
  );
  const [amount, setAmount] = useState('');

  const disabledBtnSubmit = useMemo(() => {
    return !amount || Number(amount) > (currentWallet?.balance || 0);
  }, [amount, currentWallet?.balance]);

  const onAmountChange = useCallback((value: string) => {
    setAmount(value.replaceAll(/\D/g, ''));
  }, []);
  const onToggleUsePoints = useCallback(() => {
    setUsePoints(previous => !previous);
  }, []);

  const onSelectMethod = useCallback((card: IAccount) => {
    setSelectedMethodId(card?.id);
  }, []);

  const onChangePointUsed = useCallback((numeric: number) => {
    setPointUsed(numeric);
  }, []);

  const onRefreshQRCode = useCallback((callback: any) => {
    dispatch(
      generateQRCodePayRequest({
        useMoney: Number(amount),
        usePoint: pointUsed,
        onSuccess: data => {
          callback?.(data);
        },
      }),
    );
  }, []);

  const onPay = useCallback(() => {
    dispatch(
      generateQRCodePayRequest({
        useMoney: Number(amount),
        usePoint: usePoints ? pointUsed : 0,
        onSuccess: data => {
          AppNavigator.showDialog({
            screen: QRCodeViewerView,
            isFullScreen: true,
            contentStyle: {
              marginTop: ScaleSize(-130),
            },
            data: {
              amountText: t('payment_offline.qr_balance_text', {
                amount: formatCurrency(currentWallet?.balance),
              }),
              qrImageBase64: data?.qrImageBase64,
              headerBadge: t('payment_offline.qr_header_badge'),
              name: t('payment_offline.qr_customer_name'),
            },
            durationSeconds: data?.expiresIn,
            onRefresh: onRefreshQRCode,
          });
        },
      }),
    );
  }, [
    t,
    usePoints,
    amount,
    pointUsed,
    currentWallet?.balance,
    selectedMethodId,
  ]);

  return {
    onChangePointUsed,
    onPay,
    onSelectMethod,
    onToggleUsePoints,
    onAmountChange,
    amount,
    pointHolding: currentWallet?.pointBalance,
    pointUsed,
    selectedMethodId,
    usePoints,
    disabledBtnSubmit,
    bankAccounts,
    isEnablePaymentCard,
    initialIndex: PRIMARY_CARD_INDEX,
  };
};
