import QRVoucher from '@dialogs/QRVoucher';
import AppNavigator from '@navigation/AppNavigator';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/product';
import { useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
} from '@services/selectors';
import { IAccount } from '@type';

export type PaymentMethodKind = 'bank' | 'card' | 'money';

export type IPaymentMethod = {
  readonly id: string;
  readonly kind: PaymentMethodKind;
  readonly label: string;
  readonly subLabel: string;
  readonly tag: string;
};

// TODO(api): replace mock values with the offline-payment summary response.
const POINT_HOLDING = 11_000;
const PRIMARY_CARD_INDEX = 0;
const PAY_MONEY_BALANCE = 87_500;

const PAYMENT_METHODS: readonly IPaymentMethod[] = [
  {
    id: 'money-coop-pay',
    kind: 'money',
    label: '페이머니',
    subLabel: '20,000원',
    tag: 'P MONEY',
  },
  {
    id: 'card-nh',
    kind: 'card',
    label: 'NH농협카드',
    subLabel: '**** 1234',
    tag: 'CARD',
  },
  {
    id: 'bank-shinhan',
    kind: 'bank',
    label: '신한은행',
    subLabel: '**** 5678',
    tag: 'BANK',
  },
];

export const usePaymentOffline = () => {
  const { t } = useTranslation();
  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const [usePoints, setUsePoints] = useState(true);
  const [pointUsed, setPointUsed] = useState(0);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    bankAccounts?.[PRIMARY_CARD_INDEX]?.id,
  );

  const onToggleUsePoints = useCallback(() => {
    setUsePoints(previous => !previous);
  }, []);

  const onSelectMethod = useCallback((card: IAccount) => {
    setSelectedMethodId(card?.id);
  }, []);

  const onChangePointUsed = useCallback((numeric: number) => {
    setPointUsed(numeric);
  }, []);

  const onRefreshQRCode = useCallback(() => {}, []);

  const onPay = useCallback(() => {
    AppNavigator.showDialog({
      screen: QRVoucher,
      isFullScreen: true,
      data: {
        amountText: t('payment_offline.qr_balance_text', {
          amount: formatCurrency(PAY_MONEY_BALANCE),
        }),
        code: 'applicableStore',
        headerBadge: t('payment_offline.qr_header_badge'),
        name: t('payment_offline.qr_customer_name'),
        onRefresh: onRefreshQRCode,
      },
    });
  }, [t, usePoints, pointUsed, selectedMethodId]);

  return {
    onChangePointUsed,
    onPay,
    onSelectMethod,
    onToggleUsePoints,
    paymentMethods: PAYMENT_METHODS,
    pointHolding: POINT_HOLDING,
    pointUsed,
    selectedMethodId,
    usePoints,
    bankAccounts,
    initialIndex: PRIMARY_CARD_INDEX,
  };
};
