import AppNavigator from '@navigation/AppNavigator';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type IBankOption = {
  readonly code: string;
  readonly name: string;
};

// Bonus money is excluded from the withdrawable balance.
const WALLET_BALANCE = 100_000;
const BONUS_AMOUNT = 500;

// Mock data — replace with the bank-list endpoint once available.
const BANK_OPTIONS: readonly IBankOption[] = [
  { code: '088', name: '신한은행' },
  { code: '004', name: '국민은행' },
  { code: '020', name: '우리은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '011', name: '농협은행' },
  { code: '090', name: '카카오뱅크' },
];

export const useWithdrawal = () => {
  const { t } = useTranslation();
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

  const onWithdrawAll = () => {
    setAmount(String(withdrawableAmount));
  };

  const onSubmit = () => {
    AppNavigator.showSnackBar({
      message: t('withdrawal.submit'),
      type: 'success',
    });
  };

  return {
    accountHolder,
    accountNumber,
    amount,
    banks: BANK_OPTIONS,
    bonusAmount: BONUS_AMOUNT,
    enabledBtnSubmit,
    onAccountNumberChange,
    onAmountChange,
    onSubmit,
    onWithdrawAll,
    selectedBank,
    setAccountHolder,
    setSelectedBank,
    walletBalance: WALLET_BALANCE,
    withdrawableAmount,
  };
};
