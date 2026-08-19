import imageNames from '@assets/images/names';
import QRCodeViewerView from '@components/QRCodeViewerView';
import { BANK_ACC_TYPES } from '@constants/config';
import Information from '@dialogs/Information';
import RequestAddCard from '@dialogs/RequestAddCard';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector, AppSelector } from '@services/selectors';
import { AccountManagementSelector } from '@services/selectors/accountManagement';
import {
  generateQRCodeMemberRequest,
  getCurrentWalletRequest,
  getOrganizationInfoRequest,
  getTransactionsMovementRequest,
} from '@services/slices/account/accountSlice';
import { getAccountCardsRequest } from '@services/slices/accountManagement/accountManagementSlice';
import {
  IResponseOrganizationInfo,
  ITransactionMovement,
  ListApiResponse,
} from '@type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export const PRIMARY_CARD_INDEX = 1;

const TRANSACTIONS_PAGE_SIZE = 20;

type TTransactionPagination = {
  isLast: boolean;
  isLoadingMore: boolean;
  loaded: boolean;
  page: number;
};

const INITIAL_TRANSACTION_PAGINATION: TTransactionPagination = {
  isLast: false,
  isLoadingMore: false,
  loaded: false,
  page: 0,
};

const onPressTransaction = (item: ITransactionMovement, name: string, desc: string) => {
  let title = desc;
  if(item.orderNumber) {
    title += ` ${item.orderNumber}`
  }else {
    title = name;
  }
  AppNavigator.navigate(Paths.TransactionDetail, {
    transId: item?.transactionKey,
    title,
  });
};

const useTransactions = () => {
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<ITransactionMovement[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);
  const transactionPagination = useRef<TTransactionPagination>({
    ...INITIAL_TRANSACTION_PAGINATION,
  });

  const fetchTransactions = useCallback(
    (page: number) => {
      dispatch(
        getTransactionsMovementRequest({
          page,
          size: TRANSACTIONS_PAGE_SIZE,
          onFailure: () => {
            transactionPagination.current.isLoadingMore = false;
            setLoadingTransactions(false);
            setLoadingMoreTransactions(false);
          },
          onSuccess: (data: ListApiResponse<ITransactionMovement[]>) => {
            transactionPagination.current.isLast = data.last;
            transactionPagination.current.isLoadingMore = false;
            transactionPagination.current.loaded = true;
            transactionPagination.current.page = page;
            setTransactions(prev =>
              page === 0 ? data?.content : [...prev, ...(data?.content || [])],
            );
            setLoadingTransactions(false);
            setLoadingMoreTransactions(false);
          },
        }),
      );
    },
    [dispatch],
  );

  const onLoadMoreTransactions = useCallback(() => {
    const pagination = transactionPagination.current;
    if (!pagination.loaded || pagination.isLast || pagination.isLoadingMore) {
      return;
    }
    pagination.isLoadingMore = true;
    setLoadingMoreTransactions(true);
    fetchTransactions(pagination.page + 1);
  }, [fetchTransactions]);

  useFocusEffect(
    useCallback(() => {
      transactionPagination.current = { ...INITIAL_TRANSACTION_PAGINATION };
      setLoadingTransactions(true);
      fetchTransactions(0);
    }, [fetchTransactions]),
  );

  return {
    loadingMoreTransactions,
    loadingTransactions,
    onLoadMoreTransactions,
    onPressTransaction,
    transactions,
  };
};

export const useAccountManagement = () => {
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);
  const [organizationInfo, setOrganizationInfo] =
    useState<IResponseOrganizationInfo[]>();
  const [loadingAccountCards, setLoadingAccountCards] = useState(true);
  const accounts = useMemo(() => {
    if (loadingAccountCards) {
      return undefined;
    }
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.ACCOUNT);
  }, [loadingAccountCards, rawData]);

  const cards = useMemo(() => {
    if (loadingAccountCards) {
      return undefined;
    }
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.CARD);
  }, [loadingAccountCards, rawData]);

  const isShowBottomButtonWallet = useMemo(() => {
    return (currentWallet?.balance || 0) > 0;
  }, [currentWallet]);
  const isShowUnRegister = useMemo(() => {
    return !loadingAccountCards && rawData?.length == 0;
  }, [loadingAccountCards, rawData]);

  const isEmptyBankAccount = useMemo(() => {
    return !loadingAccountCards && rawData?.length == 0;
  }, [loadingAccountCards, rawData]);

  const toggleUnRegister = () => {
    // setShowUnRegister(prev => !prev);
    AppNavigator.navigate(Paths.PointDashboard);
  };

  const transactions = useTransactions();

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentWalletRequest());
      dispatch(
        getOrganizationInfoRequest({
          onSuccess: data => {
            setOrganizationInfo(data);
          },
        }),
      );
    }, []),
  );

  useEffect(() => {
    dispatch(
      getAccountCardsRequest({
        onFailure: () => setLoadingAccountCards(false),
        onSuccess: () => setLoadingAccountCards(false),
      }),
    );
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
    if (!isEnablePaymentCard || rawData?.length > 0) {
      AppNavigator.navigate(Paths.TopUp, {
        goFrom: 'accountManagement',
      });
    } else {
      onShowDialogConfirm();
    }
  }, [isEnablePaymentCard, rawData]);

  const onChargeHistory = useCallback(() => {
    if (
      !isEnablePaymentCard ||
      (accounts?.length ?? 0) > 0 ||
      (cards?.length ?? 0) > 0
    ) {
      AppNavigator.navigate(Paths.PayPointHistories);
    } else {
      onShowDialogConfirm();
    }
  }, [isEnablePaymentCard]);

  const onManagePaymentMethods = useCallback(() => {
    AppNavigator.navigate(Paths.BankAccountManage);
  }, []);

  const generateQROrganize =
    (info: IResponseOrganizationInfo) => (callback: any) => {
      dispatch(
        generateQRCodeMemberRequest({
          paymentType: 'ORGANIZATION_BALANCE',
          organizationId: info.organizationId,
          onSuccess: response => {
            callback?.(response);
          },
        }),
      );
    };

  const onUseOrganize = useCallback((info: IResponseOrganizationInfo) => {
    generateQROrganize(info)((response: any) => {
      AppNavigator.showDialog({
        screen: QRCodeViewerView,
        isFullScreen: true,
        showBtnVoucher: true,
        showIconVoucher: true,
        titleKey: 'qr_code_member.title',
        onRefresh: generateQROrganize(info),
        titleVoucher: info?.name,
        onPressVoucher: () => {
          AppNavigator.navigate(Paths.Vouchers);
        },
        data: {
          expiresIn: response?.expiresIn,
          token: response?.token,
        },
      });
    });
  }, []);

  // const onRegisterCard = useCallback(() => {
  //   AppNavigator.showDialog({
  //     screen: RequestAddCard,
  //     isFullScreen: true,
  //   });
  // }, [accounts, cards]);

  const onUse = useCallback(() => {
    AppNavigator.navigate(Paths.PaymentOffline);
  }, []);

  const onViewAllTransactions = useCallback(() => {
    AppNavigator.navigate(Paths.PayPointHistories);
  }, []);

  return {
    accounts,
    balance: currentWallet?.balance,
    cards,
    isEmptyBankAccount,
    isEnablePaymentCard,
    organizationInfo,
    isShowUnRegister,
    isShowBottomButtonWallet,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onRegisterAccount,
    // onRegisterCard,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    onUseOrganize,
    point: currentWallet?.pointBalance,
    ...transactions,
  };
};
