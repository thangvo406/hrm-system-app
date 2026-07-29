import { BANK_ACC_TYPES } from '@constants/config';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';
import { useMemo } from 'react';
export const PRIMARY_CARD_INDEX = 1;

export const useBankAccount = () => {
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);

  const accounts = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.ACCOUNT);
  }, [rawData]);

  const cards = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.CARD);
  }, [rawData]);

  return {
    accounts,
    cards,
  };
};
