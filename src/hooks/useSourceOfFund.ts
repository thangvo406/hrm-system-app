import imageNames from '@assets/images/names';
import Information from '@dialogs/Information';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [isShowUnRegister, setShowUnRegister] = useState(false);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [cards, setCards] = useState(CARDS);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const { t } = useTranslation();
  const toggleUnRegister = () => {
    // setShowUnRegister(prev => !prev);
    AppNavigator.navigate(Paths.PointMain);
  };

  useEffect(() => {
    if (!isShowUnRegister) {
      setAccounts(ACCOUNTS);
      setTransactions(TRANSACTIONS);
      setCards(CARDS);
    } else {
      setAccounts([]);
      setTransactions([]);
      setCards([]);
    }
  }, [isShowUnRegister]);

  const onShowDialogConfirm = () => {
    AppNavigator.showDialog({
      screen: Information,
      iconInfo: {
        name: imageNames.ic_bank_info,
      },
      title: t('home.non_member_dialog.title'),
      desc: t('home.non_member_dialog.desc'),
      cancelTitle: t('home.non_member_dialog.cancel'),
      confirmTitle: t('home.non_member_dialog.confirm'),
      onConfirm: () => {
        AppNavigator.navigate(Paths.RegisterCard);
      },
    });
  };

  const onCharge = useCallback(() => {
    AppNavigator.navigate(Paths.TopUp);
  }, []);

  const onChargeHistory = useCallback(() => {
    if (!(accounts?.length > 0 || cards.length > 0)) {
      onShowDialogConfirm();
    } else {
      AppNavigator.navigate(Paths.TopUp);
    }
  }, []);

  const onManagePaymentMethods = useCallback(() => {
    // TODO: navigate to payment-method management when available.
    onShowDialogConfirm();
  }, []);

  const onRegisterCard = useCallback(() => {
    // TODO: navigate to card registration when the screen is available.
    AppNavigator.navigate(Paths.RegisterCard);
  }, [accounts, cards]);

  const onRegisterAccount = useCallback(() => {
    // TODO: navigate to account registration when the screen is available.
    AppNavigator.navigate(Paths.RegisterCard);
  }, [accounts, cards]);

  const onUse = useCallback(() => {
    AppNavigator.navigate(Paths.QRCodePayment);
  }, []);

  const onViewAllTransactions = useCallback(() => {
    AppNavigator.navigate(Paths.PayPointHistories);
  }, []);

  return {
    accounts,
    balance: WALLET_BALANCE,
    cards,
    isShowUnRegister,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onRegisterAccount,
    onRegisterCard,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    point: WALLET_POINT,
    transactions,
  };
};
