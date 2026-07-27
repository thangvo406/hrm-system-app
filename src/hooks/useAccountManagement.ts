import imageNames from '@assets/images/names';
import Information from '@dialogs/Information';
import RequestAddCard from '@dialogs/RequestAddCard';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors/accountManagement';
import { getAccountCardsRequest } from '@services/slices/accountManagement/accountManagementSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export const PRIMARY_CARD_INDEX = 1;

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

export const useAccountManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const accounts = useMemo(() => {
    return rawData?.filter(it => it.type == 'CARD');
  }, [rawData]);

  const cards = useMemo(() => {
    return rawData?.filter(it => it.type == 'BANK_ACCOUNT');
  }, [rawData]);

  const isShowUnRegister = useMemo(() => {
    return rawData?.length == 0;
  }, [rawData]);

  const toggleUnRegister = () => {
    // setShowUnRegister(prev => !prev);
    AppNavigator.navigate(Paths.PointMain);
  };

  useEffect(() => {
    // The saga stores the response in redux (getAccountCardsSuccess); the
    // selector above keeps rawData in sync, so no local setter is needed.
    dispatch(getAccountCardsRequest({}));
  }, [dispatch]);

  const onRegisterAccount = useCallback(() => {
    AppNavigator.showDialog({
      screen: RequestAddCard,
      isFullScreen: true,
    });
  }, []);

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
        onRegisterAccount();
      },
    });
  };

  const onCharge = useCallback(() => {
    if (rawData?.length > 0) {
      AppNavigator.navigate(Paths.TopUp);
    } else {
      onShowDialogConfirm();
    }
  }, [rawData]);

  const onChargeHistory = useCallback(() => {
    if (!(accounts?.length > 0 || cards.length > 0)) {
      onShowDialogConfirm();
    } else {
      AppNavigator.navigate(Paths.PayPointHistories);
    }
  }, []);

  const onManagePaymentMethods = useCallback(() => {
    // TODO: navigate to payment-method management when available.
    onShowDialogConfirm();
  }, []);

  // const onRegisterCard = useCallback(() => {
  //   AppNavigator.showDialog({
  //     screen: RequestAddCard,
  //     isFullScreen: true,
  //   });
  // }, [accounts, cards]);

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
    // onRegisterCard,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    point: WALLET_POINT,
    transactions,
  };
};
