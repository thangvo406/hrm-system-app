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
const PRIMARY_CARD_INDEX = 0;

export const usePaymentOffline = () => {
  const { t } = useTranslation();
  const bankAccounts = useAppSelector(
    AccountManagementSelector.getAccountCards,
  );
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
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
          amount: formatCurrency(currentWallet?.balance),
        }),
        code: 'applicableStore',
        headerBadge: t('payment_offline.qr_header_badge'),
        name: t('payment_offline.qr_customer_name'),
        onRefresh: onRefreshQRCode,
      },
    });
  }, [t, usePoints, pointUsed, currentWallet, selectedMethodId]);

  return {
    onChangePointUsed,
    onPay,
    onSelectMethod,
    onToggleUsePoints,
    pointHolding: currentWallet?.pointBalance,
    pointUsed,
    selectedMethodId,
    usePoints,
    bankAccounts,
    initialIndex: PRIMARY_CARD_INDEX,
  };
};
