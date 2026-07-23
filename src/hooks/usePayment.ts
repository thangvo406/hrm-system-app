import type { SourceAccount } from '@screens/Payment/Cards';
import type { SourceCard } from '@screens/Payment/MembershipCards';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useCallback } from 'react';

export type IPaymentCoupon = {
  readonly id: string;
  readonly name: string;
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

const onSelectCoupon = () => {
  AppNavigator.navigate(Paths.Vouchers);
};

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PointMain);
};

export const usePayment = () => {
  const onRegisterCard = useCallback(() => {
    // TODO: navigate to card registration when the screen is available.
    AppNavigator.navigate(Paths.RegisterCard);
  }, []);

  const onRegisterAccount = useCallback(() => {
    // TODO: navigate to account registration when the screen is available.
    AppNavigator.navigate(Paths.RegisterCard);
  }, []);

  const onSelectGeneralMethod = useCallback(() => {
    // TODO: navigate to the general payment-method picker when available.
    AppNavigator.navigate(Paths.RegisterCard);
  }, []);

  const onPay = useCallback(() => {
    // TODO(api): submit the payment with the selected method.
  }, []);

  return {
    accounts: ACCOUNTS,
    cards: CARDS,
    initialIndex: PRIMARY_CARD_INDEX,
    isShowUnRegister: false,
    onPay,
    onRegisterAccount,
    onRegisterCard,
    onSelectCoupon,
    onSelectGeneralMethod,
    onUsePoint,
    payMoneyBalance: PAY_MONEY_BALANCE,
    pointHolding: POINT_HOLDING,
    pointUsed: POINT_USED,
    selectedCoupon: SELECTED_COUPON,
  };
};
