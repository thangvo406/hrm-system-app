import { VOUCHERS_STATUSES } from '@constants/config';
import { useAppDispatch } from '@services/common/storeHooks';
import { getVouchersRequest } from '@services/slices/account/accountSlice';
import { IVoucher, ListApiResponse } from '@type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UseVouchersSelectionParams = {
  readonly storeId?: number;
  readonly orderAmount?: number;
  readonly onSubmit?: (voucher: any) => void;
};

export function useVouchersSelection(params: UseVouchersSelectionParams) {
  const { onSubmit, storeId, orderAmount, onRequestClose, itemSelected } =
    params;
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherSelected, setVoucherSelected] = useState<any>(itemSelected);
  const [data, setData] = useState([]);
  const dispatch = useAppDispatch();
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

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

  const btnConfig = useMemo(() => {
    if (voucherSelected) {
      return {
        title: t('vouchers.btn_apply'),
        type: 'primary',
      };
    }
    return {
      title: t('vouchers.btn_skip'),
      type: 'outline-bordered-rounded',
    };
  }, [voucherSelected]);

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
    onRequestClose?.();
    onSubmit?.(voucherSelected);
  }, [onSubmit, voucherSelected]);

  return {
    data,
    onApply,
    onLoadMore,
    loading,
    btnConfig,
    onCheckVoucher,
    setVoucherSelected,
    voucherCode,
    voucherSelected,
  };
}
