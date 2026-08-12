import type { WithdrawalType } from '@screens/CapitalWithdrawal/WithdrawalTypeCard';
import type { IContributeSummary } from '@type/wallet';

import { MEMBERSHIP_TYPE} from '@constants/config';
import bankData from '@constants/banks.json';
import Selection from '@dialogs/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountSelector,
} from '@services/selectors';
import {
  getContributeSummaryRequest,
} from '@services/slices/payment/paymentSlice';
import { TranslationUtils } from '@utils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IBankOption } from './useWithdrawal';

const CONTRIBUTION_UNIT_PRICE = 100_000;

export const useCapitalWithdrawal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);
  const [summary, setSummary] = useState<IContributeSummary | undefined>();
  const [amount, setAmount] = useState('');
  const [withdrawalType, setWithdrawalType] =
    useState<WithdrawalType>('decrease_refund');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<IBankOption | undefined>(
    undefined,
  );

  useEffect(() => {
    dispatch(
      getContributeSummaryRequest({
        onFailure: () => setSummary(undefined),
        onSuccess: data => setSummary(data),
      }),
    );
  }, []);

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

  // The summary strip values come straight from the API and stay fixed —
  // they do NOT recompute while the user is typing units.
  const unitPrice = summary?.unitPrice ?? CONTRIBUTION_UNIT_PRICE;
  const currentContribution = summary?.currentContribution ?? 0;
  const currentUnits = Math.floor(currentContribution / unitPrice);
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
    setAmount(value.replaceAll(/\D/g, '').replace(/^0+/, ''));
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

  // TODO: swap increaseContributionRequest for the decrease/refund API once
  // the backend endpoint is available — this is copied from the increase flow.
  const onSubmit = () => {
    const requestedUnits = Number(amount);
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
    onAccountNumberChange,
    onAmountChange,
    onPressBank,
    onSubmit,
    selectedBank,
    setAccountHolder,
    setWithdrawalType,
    unitPrice,
    withdrawalType,
  };
};
