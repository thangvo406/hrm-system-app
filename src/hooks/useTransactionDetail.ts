import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTransactionDetailRequest } from '@services/slices/account/accountSlice';
import type { ITransactionDetail } from '@type/payment';
import { useEffect, useState } from 'react';

export function useTransactionDetail(props: any) {
  const { transId } = AppNavigator.getParams(props);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ITransactionDetail>();
  const dispatch = useAppDispatch();
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

  return { data, loading };
}
