import type { OptionDef } from '@screens/CapitalWithdrawal/WithdrawalTypeCard';

import { MEMBERSHIP_TYPE } from '@constants/config';
import bankData from '@constants/banks.json';
import Selection from '@dialogs/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector, PaymentSelector } from '@services/selectors';
import { decreaseContributeRequest } from '@services/slices/payment/paymentSlice';
import { TranslationUtils } from '@utils';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IBankOption } from './useWithdrawal';

const CONTRIBUTION_UNIT_PRICE = 100_000;

export const useCapitalWithdrawal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);
  const summary = useAppSelector(PaymentSelector.getContributeSummary);
  const [amount, setAmount] = useState('');
  const [withdrawalSelected, setWithdrawalSelected] = useState<OptionDef>({
    type: 'decrease_refund',
    title: t('capital_withdrawal.option_academic_title'),
  } as OptionDef);
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<IBankOption | undefined>(
    undefined,
  );
  const [errorAmount, setErrorAmount] = useState('');

  const membershipLabel = useMemo(() => {
    const rawType = profile?.membershipType;
    if (!rawType?.trim?.()) {
      return '-';
    }
    const key = `profile.memberships.${rawType.toLowerCase()}`;
    const baseLabel = TranslationUtils.hasTranslationKey(key)
      ? t(key)
      : t('profile.memberships.other');
    if (rawType === MEMBERSHIP_TYPE.STUDENT) {
      return `${baseLabel} ${t('contribution_input.member_status_enrolled')}`;
    }
    return baseLabel;
  }, [profile?.membershipType, t]);

  const unitPrice = summary?.unitPrice ?? CONTRIBUTION_UNIT_PRICE;
  const currentContribution = summary?.currentContribution ?? 0;
  const selfCurrentUnits = Math.floor(currentContribution / unitPrice);
  const currentUnits = summary?.currentUnits || selfCurrentUnits;
  const expectedContribution =
    summary?.expectedContribution ?? currentContribution;
  const expectedUnits =
    summary?.expectedUnits ?? Math.floor(expectedContribution / unitPrice);

  const enabledBtnSubmit = useMemo(() => {
    const hasRefundAccount =
      selectedBank !== undefined &&
      accountNumber.trim().length > 0 &&
      accountHolder.trim().length > 0;
    return Number(amount) >= 1 && hasRefundAccount;
  }, [accountHolder, accountNumber, amount, selectedBank]);

  const onAmountChange = (value: string) => {
    const _value = value.replaceAll(/\D/g, '').replace(/^0+/, '');
    if (Number(_value) > (summary?.currentUnits || 0)) {
      setErrorAmount(t('capital_withdrawal.error_units_exceed_current'));
    } else {
      setErrorAmount('');
      setAmount(_value);
    }
  };

  const onAccountNumberChange = (value: string) => {
    setAccountNumber(value.replaceAll(/[^\d-]/g, ''));
  };

  const onPressBank = () => {
    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      title: t('withdrawal.bank_selection_title'),
      itemSelected: selectedBank,
      items: bankData,
      onSelect: setSelectedBank,
      emptyType: 'selection',
      pathDisplay: 'name',
      pathSelected: 'name',
    });
  };

  const onSubmit = () => {
    const requestedUnits = Number(amount);
    const bankName =
      typeof selectedBank == 'string'
        ? selectedBank
        : (selectedBank?.name ?? '');

    dispatch(
      decreaseContributeRequest({
        units: requestedUnits,
        refundBankAccountNumber: accountNumber,
        refundBankName: bankName,
        refundMethod: 'BANK_TRANSFER',
        refundBankAccountHolder: accountHolder,
        requestReason: withdrawalSelected?.title,
        onSuccess: () => {
          AppNavigator.navigate(Paths.CapitalWithdrawalResult, {
            amount: requestedUnits * unitPrice,
            applicantName: profile?.fullName ?? profile?.name,
            bankInfo: {
              accountHolder,
              accountNumber,
              bank: selectedBank,
            },
            currentUnitCount: currentUnits,
            requestedAt: Date.now(),
            status: 'PENDING',
            totalUnitCountAfter: Math.max(currentUnits - requestedUnits, 0),
            unitCount: requestedUnits,
          });
        },
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error,
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
    currentContribution,
    currentUnits,
    enabledBtnSubmit,
    expectedContribution,
    expectedUnits,
    membershipLabel,
    errorAmount,
    onAccountNumberChange,
    onAmountChange,
    onPressBank,
    onSubmit,
    selectedBank,
    setAccountHolder,
    setWithdrawalSelected,
    unitPrice,
    withdrawalType: withdrawalSelected?.type,
  };
};
