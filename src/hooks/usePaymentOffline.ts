import QRVoucher from '@dialogs/QRVoucher';
import RequestAddCard from '@dialogs/RequestAddCard';
import AppNavigator from '@navigation/AppNavigator';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/product';

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
const DEFAULT_POINT_USED = 3000;
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
  const [usePoints, setUsePoints] = useState(true);
  const [pointUsed, setPointUsed] = useState(DEFAULT_POINT_USED);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    PAYMENT_METHODS[0].id,
  );

  const onToggleUsePoints = useCallback(() => {
    setUsePoints(previous => !previous);
  }, []);

  const onSelectMethod = useCallback((id: string) => {
    setSelectedMethodId(id);
  }, []);

  const onChangePointUsed = useCallback((numeric: number) => {
    setPointUsed(numeric);
  }, []);

  const onAddMethod = useCallback((callback: any) => {
    AppNavigator.showDialog({
      screen: RequestAddCard,
      isFullScreen: true,
    });
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
  }, [t]);

  return {
    onAddMethod,
    onChangePointUsed,
    onPay,
    onSelectMethod,
    onToggleUsePoints,
    paymentMethods: PAYMENT_METHODS,
    pointHolding: POINT_HOLDING,
    pointUsed,
    selectedMethodId,
    usePoints,
  };
};
