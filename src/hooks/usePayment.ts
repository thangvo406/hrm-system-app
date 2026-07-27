import type { SourceAccount } from '@screens/Payment/Cards';
import type { SourceCard } from '@screens/Payment/MembershipCards';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useCallback, useState } from 'react';
import RequestAddCard from '@dialogs/RequestAddCard';
import VouchersSelection from '@dialogs/VouchersSelection';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';

export type IPaymentCoupon = {
  readonly id: string;
  readonly name: string;
};

export type PaymentMethodType = 'account' | 'card';

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

// Ordered pale → branded → coral so the branded card centers on open.
const CARDS: readonly SourceCard[] = [
  {
    brand: '카카오뱅크',
    id: 'card-kakao',
    maskedNumber: '**** **** **** 8888',
    network: 'VISA',
  },
  {
    brand: 'NH농협카드',
    id: 'card-nh',
    maskedNumber: '**** **** **** 1234',
    network: 'BC',
  },
  {
    brand: '삼성카드',
    id: 'card-samsung',
    maskedNumber: '**** **** **** 5678',
    network: 'MC',
  },
];

export const PRIMARY_CARD_INDEX = 1;

const ACCOUNTS: readonly SourceAccount[] = [
  {
    accountMasked: '****-**-****5678',
    bankName: '신한은행',
    id: 'acc-shinhan',
  },
  {
    accountMasked: '****-**-****9012',
    bankName: 'IBK기업은행',
    id: 'acc-ibk',
  },
];

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PointMain);
};

export const usePayment = () => {
  // Default to the primary card so a method is highlighted on open.
  const [selectedMethod, setSelectedMethod] = useState<SelectedPaymentMethod>({
    id: CARDS[PRIMARY_CARD_INDEX].id,
    type: 'card',
  });
  const bankAccounts = useAppSelector(AccountManagementSelector.getAccountCards);

  const selectedCardId =
    selectedMethod.type === 'card' ? selectedMethod.id : undefined;
  const selectedAccountId =
    selectedMethod.type === 'account' ? selectedMethod.id : undefined;

  const onSelectCard = useCallback((id: string) => {
    setSelectedMethod({ id, type: 'card' });
  }, []);

  const onSelectAccount = useCallback((id: string) => {
    setSelectedMethod({ id, type: 'account' });
  }, []);

  const onSelectCoupon = () => {
    AppNavigator.showDialog({
      screen: VouchersSelection,
      isFullScreen: true,
      // popupType: 'bottomSheet',
    });
  };

  const onSelectGeneralMethod = useCallback(() => {
    AppNavigator.showDialog({
      screen: RequestAddCard,
      isFullScreen: true,
    });
  }, []);

  const onPay = useCallback(() => {
    // TODO(api): submit the payment with the selected method.
  }, []);

  return {
    accounts: ACCOUNTS,
    cards: CARDS,
    initialIndex: PRIMARY_CARD_INDEX,
    onPay,
    onSelectAccount,
    onSelectCard,
    onSelectCoupon,
    onSelectGeneralMethod,
    onUsePoint,
    bankAccounts,
    payMoneyBalance: PAY_MONEY_BALANCE,
    pointHolding: POINT_HOLDING,
    pointUsed: POINT_USED,
    selectedAccountId,
    selectedCardId,
    selectedCoupon: SELECTED_COUPON,
  };
};
