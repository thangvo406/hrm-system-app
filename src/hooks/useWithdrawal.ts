import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useMemo, useState } from 'react';
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

// Bonus money is excluded from the withdrawable balance.
const WALLET_BALANCE = 100_000;
const BONUS_AMOUNT = 500;

export const useWithdrawal = () => {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const [amount, setAmount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<IBankOption | undefined>(
    undefined,
  );

  const withdrawableAmount = useMemo(
    () => Math.max(WALLET_BALANCE - BONUS_AMOUNT, 0),
    [],
  );

  const enabledBtnSubmit = useMemo(() => {
    const numericAmount = Number(amount);
    return (
      numericAmount > 0 &&
      numericAmount <= withdrawableAmount &&
      selectedBank !== undefined &&
      accountNumber.trim().length > 0 &&
      accountHolder.trim().length > 0
    );
  }, [accountHolder, accountNumber, amount, selectedBank, withdrawableAmount]);

  const onAmountChange = (value: string) => {
    setAmount(value.replaceAll(/\D/g, ''));
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
    bonusAmount: BONUS_AMOUNT,
    enabledBtnSubmit,
    onAccountNumberChange,
    onPressBank,
    onAmountChange,
    onSubmit,
    selectedBank,
    setAccountHolder,
    setSelectedBank,
    walletBalance: currentWallet?.balance,
    withdrawableAmount,
  };
};
