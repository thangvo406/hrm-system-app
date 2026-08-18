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
import { useMemo, useReducer, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import type { IBankOption } from './useWithdrawal';

const CONTRIBUTION_UNIT_PRICE = 100_000;

export type TCapitalWithdrawalForm = {
  accountHolder: string;
  accountNumber: string;
  amount: string;
  errorAmount: string;
  selectedBank: IBankOption | undefined;
  withdrawalSelected: OptionDef;
};

export type TCapitalWithdrawalField = keyof TCapitalWithdrawalForm;

const VISIBLE_FIELDS = new Set<TCapitalWithdrawalField>([
  'amount',
  'selectedBank',
  'withdrawalSelected',
]);

export const useCapitalWithdrawal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);
  const summary = useAppSelector(PaymentSelector.getContributeSummary);
  const [, refresh] = useReducer((version: number) => version + 1, 0);

  const formData = useRef<TCapitalWithdrawalForm>({
    accountHolder: '',
    accountNumber: '',
    amount: '',
    errorAmount: '',
    selectedBank: undefined,
    withdrawalSelected: {
      type: 'decrease_refund',
      title: t('capital_withdrawal.option_academic_title'),
    } as OptionDef,
  });
  const enabledBtnSubmit = useRef(false);

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

  const isSubmitEnabled = () => {
    const { accountHolder, accountNumber, amount, selectedBank } =
      formData.current;
    const hasRefundAccount =
      selectedBank !== undefined &&
      accountNumber.trim().length > 0 &&
      accountHolder.trim().length > 0;
    return Number(amount) >= 1 && hasRefundAccount;
  };

  const onChangeForm =
    <T extends TCapitalWithdrawalField>(type: T) =>
    (value: TCapitalWithdrawalForm[T]) => {
      const form = formData.current;

      switch (type) {
        case 'amount': {
          const digits = (value as string)
            .replaceAll(/\D/g, '')
            .replace(/^0+/, '');
          if (Number(digits) > (summary?.currentUnits || 0)) {
            form.errorAmount = t(
              'capital_withdrawal.error_units_exceed_current',
            );
          } else {
            form.errorAmount = '';
            form.amount = digits;
          }
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
    const {
      accountHolder,
      accountNumber,
      amount,
      selectedBank,
      withdrawalSelected,
    } = formData.current;
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
    amount: formData.current.amount,
    currentContribution,
    currentUnits,
    enabledBtnSubmit: enabledBtnSubmit.current,
    errorAmount: formData.current.errorAmount,
    expectedContribution,
    expectedUnits,
    membershipLabel,
    onChangeForm,
    onPressBank,
    onSubmit,
    selectedBank: formData.current.selectedBank,
    unitPrice,
    withdrawalType: formData.current.withdrawalSelected.type,
  };
};
