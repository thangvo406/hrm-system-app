import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { useReducer, useRef } from 'react';
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

export type TWithdrawalForm = {
  accountHolder: string;
  accountNumber: string;
  amount: string;
  errorAmount: string;
  reason: string;
  selectedBank: IBankOption | undefined;
};

export type TWithdrawalField = keyof TWithdrawalForm;

const VISIBLE_FIELDS = new Set<TWithdrawalField>(['amount', 'selectedBank']);

export const useWithdrawal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  const formData = useRef<TWithdrawalForm>({
    accountHolder: '',
    accountNumber: '',
    amount: String(currentWallet?.balance ?? ''),
    errorAmount: '',
    reason: '',
    selectedBank: undefined,
  });
  const enabledBtnSubmit = useRef(false);

  const isSubmitEnabled = () => {
    const { accountHolder, accountNumber, selectedBank } = formData.current;
    // const numericAmount = Number(formData.current.amount);
    return (
      // numericAmount > 0 &&
      // numericAmount <= (currentWallet?.withdrawableBalance || 0) &&
      (currentWallet?.balance || 0) > 0 &&
      selectedBank !== undefined &&
      accountNumber.trim().length > 0 &&
      accountHolder.trim().length > 0
    );
  };

  const onChangeForm =
    <T extends TWithdrawalField>(type: T) =>
    (value: TWithdrawalForm[T]) => {
      const form = formData.current;

      switch (type) {
        case 'amount': {
          const digits = (value as string).replaceAll(/\D/g, '');
          form.amount = digits;
          form.errorAmount =
            Number(digits) > (currentWallet?.withdrawableBalance ?? 0)
              ? t('withdrawal.error_amount_exceed')
              : '';
          break;
        }
        case 'accountNumber': {
          form.accountNumber = (value as string).replaceAll(/[^\d-]/g, '');
          break;
        }
        default: {
          form[type] = value;
          break;
        }
      }

      const nextEnabled = isSubmitEnabled();
      const hasEnabledChanged = nextEnabled !== enabledBtnSubmit.current;
      enabledBtnSubmit.current = nextEnabled;

      if (VISIBLE_FIELDS.has(type) || hasEnabledChanged) {
        refresh();
      }
    };

  const onPressBank = () => {
    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      title: t('withdrawal.bank_selection_title'),
      itemSelected: formData.current.selectedBank,
      items: bankData,
      onSelect: onChangeForm('selectedBank'),
      emptyType: 'selection',
      pathDisplay: 'name',
      pathSelected: 'name',
    });
  };

  const onSubmit = () => {
    const { accountHolder, accountNumber, amount, reason, selectedBank } =
      formData.current;
    const requestedAmount = Number(amount);
    const bankName =
      typeof selectedBank == 'string'
        ? selectedBank
        : (selectedBank?.name ?? '');
    dispatch(
      withdrawalBalanceRequest({
        requestedAmount,
        bankName,
        accountNumber: accountNumber,
        accountHolder: accountHolder,
        reason,
        onSuccess: () => {
          dispatch(getCurrentWalletRequest());
          AppNavigator.goBack();
          AppNavigator.showDialog({
            screen: WithdrawalResult,
            amount: requestedAmount,
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
    accountHolder: formData.current.accountHolder,
    accountNumber: formData.current.accountNumber,
    amount: formData.current.amount,
    currentWallet,
    enabledBtnSubmit: enabledBtnSubmit.current,
    errorAmount: formData.current.errorAmount,
    onChangeForm,
    onPressBank,
    onSubmit,
    selectedBank: formData.current.selectedBank,
  };
};
