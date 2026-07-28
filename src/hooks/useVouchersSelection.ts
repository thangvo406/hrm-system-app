import { VOUCHERS_STATUSES } from '@constants/config';
import { useAppDispatch } from '@services/common/storeHooks';
import { getVouchersRequest } from '@services/slices/account/accountSlice';
import { IVoucher, ListApiResponse } from '@type';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseVouchersSelectionParams = {
  readonly storeId?: number;
  readonly orderAmount?: number;
  readonly onSubmit?: (voucher: any) => void;
};

export function useVouchersSelection(params: UseVouchersSelectionParams) {
  const { onSubmit, storeId, orderAmount } = params;
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherSelected, setVoucherSelected] = useState<any>();
  const [data, setData] = useState([]);
  const dispatch = useAppDispatch();
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSuccess = useCallback(
    (response: ListApiResponse<IVoucher[]>) => {
      isLast.current = response.last;
      setLoading(false);
      const items = response?.content || [];
      setData(prev => (currentPage === 0 ? items : [...prev, ...items]));
      isLoadingMore.current = false;
    },
    [currentPage],
  );

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    dispatch(
      getVouchersRequest({
        storeId,
        status: VOUCHERS_STATUSES.AVAILABLE,
        orderAmount,
        code: voucherCode,
        page: currentPage,
        size: 10,
        onSuccess: handleSuccess,
        onFailure: () => {
          setLoading(false);
        },
      }),
    );
  }, [currentPage, voucherCode]);

  const onCheckVoucher = (code: string) => {
    setLoading(true);
    setVoucherCode(code);
    setCurrentPage(0);
  };

  const onApply = useCallback(() => {
    onSubmit?.(voucherSelected);
  }, [onSubmit, voucherSelected]);

  return {
    data,
    onApply,
    onLoadMore,
    loading,
    onCheckVoucher,
    setVoucherSelected,
    voucherCode,
    voucherSelected,
  };
}
