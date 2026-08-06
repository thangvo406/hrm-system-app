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
  getCurrentWalletRequest,
  getOrganizationInfoRequest,
} from '@services/slices/account/accountSlice';
import { getAccountCardsRequest } from '@services/slices/accountManagement/accountManagementSlice';
import { IResponseOrganizationInfo } from '@type';
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

export const PRIMARY_CARD_INDEX = 1;

export const useAccountManagement = () => {
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);
  const [organizationInfo, setOrganizationInfo] =
    useState<IResponseOrganizationInfo[]>();
  const accounts = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.ACCOUNT);
  }, [rawData]);

  const cards = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.CARD);
  }, [rawData]);

  const isShowUnRegister = useMemo(() => {
    return rawData?.length == 0;
  }, [rawData]);

  const isEmptyBankAccount = useMemo(() => {
    return rawData?.length == 0;
  }, [rawData]);

  const toggleUnRegister = () => {
    // setShowUnRegister(prev => !prev);
    AppNavigator.navigate(Paths.PointMain);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentWalletRequest());
      dispatch(
        getOrganizationInfoRequest({
          onSuccess: (data) => {
            setOrganizationInfo(data);
          },
        }),
      );
    }, []),
  );

  useEffect(() => {
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
    if (!isEnablePaymentCard || rawData?.length > 0) {
      AppNavigator.navigate(Paths.TopUp, {
        goFrom: 'accountManagement',
      });
    } else {
      onShowDialogConfirm();
    }
  }, [isEnablePaymentCard, rawData]);

  const onChargeHistory = useCallback(() => {
    if (!isEnablePaymentCard || accounts?.length > 0 || cards.length > 0) {
      AppNavigator.navigate(Paths.PayPointHistories);
    } else {
      onShowDialogConfirm();
    }
  }, [isEnablePaymentCard]);

  const onManagePaymentMethods = useCallback(() => {
    AppNavigator.navigate(Paths.BankAccountManage);
  }, []);

  const onUseOrganize = useCallback((info: IResponseOrganizationInfo) => {
    AppNavigator.showDialog({
      screen: QRCodeViewerView,
      isFullScreen: true,
      showBtnVoucher: true,
      showIconVoucher: true,
      titleKey: 'qr_code_member.title',
      titleVoucher: info?.name,
      onPressVoucher: () => {
        AppNavigator.navigate(Paths.Vouchers)
      },
      data: {
        expiresIn: 3000,
        code: info.name,
      },
      // onRefresh: onRefreshQR(voucher),
    })
  }, []);

  // const onRegisterCard = useCallback(() => {
  //   AppNavigator.showDialog({
  //     screen: RequestAddCard,
  //     isFullScreen: true,
  //   });
  // }, [accounts, cards]);

  const onUse = useCallback(() => {
    AppNavigator.navigate(Paths.QRCodeViewer);
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
  };
};
