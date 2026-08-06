import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import bankData from '@constants/banks.json';
import Selection from '@dialogs/Selection';
import {
  getCurrentWalletRequest,
  withdrawalBalanceRequest,
} from '@services/slices/account/accountSlice';
import WithdrawalResult from '@dialogs/WithdrawalResult';
export type IBankOption = {
  readonly code: string;
  readonly name: string;
};

export const useWithdrawal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const [amount, setAmount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<IBankOption | undefined>(
    undefined,
  );
  const [errorAmount, setErrorAmount] = useState('');

  const enabledBtnSubmit = useMemo(() => {
    const numericAmount = Number(amount);
    return (
      numericAmount > 0 &&
      numericAmount <= (currentWallet?.withdrawableBalance || 0) &&
      selectedBank !== undefined &&
      accountNumber.trim().length > 0 &&
      accountHolder.trim().length > 0
    );
  }, [accountHolder, accountNumber, amount, selectedBank, currentWallet]);

  const onAmountChange = (value: string) => {
    const digits = value.replaceAll(/\D/g, '');
    setAmount(digits);
    setErrorAmount(
      Number(digits) > (currentWallet?.withdrawableBalance ?? 0)
        ? t('withdrawal.error_amount_exceed')
        : '',
    );
  };

  const onAccountNumberChange = (value: string) => {
    setAccountNumber(value.replaceAll(/[^\d-]/g, ''));
  };

  const onPressBank = () => {
    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      itemSelected: selectedBank,
      items: bankData,
      onSelect: setSelectedBank,
      emptyType: 'selection',
      pathDisplay: 'name',
      pathSelected: 'name',
    });
  };
  const onSubmit = () => {
    const bankName =
      typeof selectedBank == 'string'
        ? selectedBank
        : (selectedBank?.name ?? '');
    dispatch(
      withdrawalBalanceRequest({
        requestedAmount: Number(amount),
        bankName,
        accountNumber: accountNumber,
        accountHolder: accountHolder,
        onSuccess: () => {
          dispatch(getCurrentWalletRequest());
          AppNavigator.goBack();
          AppNavigator.showDialog({
            screen: WithdrawalResult,
            amount,
            bankName,
            accountNumber,
            isFullScreen: true,
          });
        },
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({
            message: error || '',
            type: 'failed',
          });
        },
      }),
    );
  };

  return {
    accountHolder,
    accountNumber,
    amount,
    enabledBtnSubmit,
    errorAmount,
    onAccountNumberChange,
    onPressBank,
    onAmountChange,
    onSubmit,
    selectedBank,
    setAccountHolder,
    setSelectedBank,
    currentWallet,
  };
};
