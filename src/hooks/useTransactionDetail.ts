import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTransactionDetailRequest } from '@services/slices/account/accountSlice';
import type {
  ITransactionDetail,
  ITransactionLeg,
  ITransactionOrder,
} from '@type/payment';
import { useEffect, useMemo, useState } from 'react';

export type TTransactionLegGroup = {
  readonly balanceAccountType: string;
  readonly legs: ITransactionLeg[];
};

/** Groups legs sharing the same balanceAccountType, keeping first-seen order. */
const groupLegsByBalanceAccountType = (
  legs: ITransactionLeg[] | undefined,
): TTransactionLegGroup[] => {
  const groups = new Map<string, ITransactionLeg[]>();

  for (const leg of legs ?? []) {
    const grouped = groups.get(leg.balanceAccountType);
    if (grouped) {
      grouped.push(leg);
    } else {
      groups.set(leg.balanceAccountType, [leg]);
    }
  }

  return [...groups].map(([balanceAccountType, groupedLegs]) => ({
    balanceAccountType,
    legs: groupedLegs,
  }));
};

export function useTransactionDetail(props: any) {
  const { transId } = AppNavigator.getParams(props);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ITransactionDetail>();
  const dispatch = useAppDispatch();

  const order = useMemo(() => {
    if (data?.order) {
      return data?.order as ITransactionOrder;
    }
    const { legs } = data || {};
    if ((legs?.length || 0) > 0) {
      return {
        totalAmount: legs?.[0].amount,
        settledMoneyAmount: legs?.[0].amount,
      } as ITransactionOrder;
    }
  }, [data]);

  useEffect(() => {
    dispatch(
      getTransactionDetailRequest({
        transactionId: transId,
        onSuccess: _data => {
          setData(_data);
          setLoading(false);
        },
        onFailure: () => {
          setLoading(false);
        },
      }),
    );
  }, []);

  const groupedLegs = useMemo(
    () => groupLegsByBalanceAccountType(data?.legs),
    [data],
  );

  return { data, groupedLegs, loading, order };
}
