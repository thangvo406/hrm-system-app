import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useCallback } from 'react';

export type SourceCard = {
  readonly brand: string;
  readonly id: string;
  readonly maskedNumber: string;
  readonly network: string;
};

export type SourceAccount = {
  readonly accountMasked: string;
  readonly bankName: string;
  readonly id: string;
};

export type WalletTransactionType = 'charge' | 'point' | 'spend';

export type WalletTransaction = {
  readonly amount: number;
  readonly date: string;
  readonly id: string;
  readonly method: string;
  readonly title: string;
  readonly type: WalletTransactionType;
};

// Mock data — replace with the wallet/payment endpoints once available.
const WALLET_BALANCE = 87_500;
const WALLET_POINT = 1000;

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

const TRANSACTIONS: readonly WalletTransaction[] = [
  {
    amount: -3500,
    date: '2026-07-13',
    id: 'tx-1',
    method: '카드 결제',
    title: '학생회관 1호점',
    type: 'spend',
  },
  {
    amount: 35,
    date: '2026-07-13',
    id: 'tx-2',
    method: '생협페이 결제',
    title: '포인트 적립',
    type: 'point',
  },
  {
    amount: -8200,
    date: '2026-07-12',
    id: 'tx-3',
    method: '카드 결제',
    title: '도서관 2호점',
    type: 'spend',
  },
  {
    amount: 30_000,
    date: '2026-07-11',
    id: 'tx-4',
    method: '생협페이머니',
    title: '충전',
    type: 'charge',
  },
];

export const useSourceOfFund = () => {
  const onCharge = useCallback(() => {
    AppNavigator.navigate(Paths.TopUp);
  }, []);

  const onChargeHistory = useCallback(() => {
    // TODO: navigate to charge history when the screen is available.
  }, []);

  const onManagePaymentMethods = useCallback(() => {
    // TODO: navigate to payment-method management when available.
  }, []);

  const onUse = useCallback(() => {
    AppNavigator.navigate(Paths.QRCodePayment);
  }, []);

  const onViewAllTransactions = useCallback(() => {
    // TODO: navigate to full transaction history when available.
  }, []);

  return {
    accounts: ACCOUNTS,
    balance: WALLET_BALANCE,
    cards: CARDS,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onUse,
    onViewAllTransactions,
    point: WALLET_POINT,
    transactions: TRANSACTIONS,
  };
};
