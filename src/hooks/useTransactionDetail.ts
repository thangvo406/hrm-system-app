import QRCodeViewerView from '@components/QRCodeViewerView';
import { HEADLINE_ACTIONS } from '@constants/config';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTransactionDetailRequest } from '@services/slices/account/accountSlice';
import { generateQRRefundTransactionRequest } from '@services/slices/payment/paymentSlice';
import type {
  ITransactionDetail,
  ITransactionLeg,
  ITransactionOrder,
} from '@type/payment';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TTransactionLegGroup = {
  readonly balanceAccountType: string;
  readonly legs: ITransactionLeg[];
};

const DEBIT_TYPES = new Set<string>([
  HEADLINE_ACTIONS.PAYMENT,
  HEADLINE_ACTIONS.POINT_EXPIRE,
  HEADLINE_ACTIONS.WITHDRAWAL,
]);
// const CREDIT_TYPES = [
//   HEADLINE_ACTIONS.CHARGE,
//   HEADLINE_ACTIONS.REFUND,
//   HEADLINE_ACTIONS.POINT_EARN,
//   HEADLINE_ACTIONS.POINT_GRANT,
//   HEADLINE_ACTIONS.POINT_GRANT,
// ];

const groupLegsByBalanceAccountType = (
  legs: ITransactionLeg[] | undefined,
): TTransactionLegGroup[] => {
  const groups = new Map<string, ITransactionLeg[]>();

  for (const leg of legs ?? []) {
    if (!leg.balanceAccountType?.trim()) {
      continue;
    }
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
  const { t } = useTranslation();

  const isDebit = useMemo(() => {
    return DEBIT_TYPES.has(data?.headlineAction ?? '');
  }, []);

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

  const isShowDashDivider = useMemo(() => {
    return [
      order?.voucherAmount,
      order?.memberDiscountAmount,
      order?.usedPointAmount,
    ].some(it => Number(it) > 0);
  }, [order]);

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

  const onPressQR = () => {
    dispatch(
      generateQRRefundTransactionRequest({
        orderId: order?.orderId || 0,
        onSuccess: response => {
          AppNavigator.showDialog({
            screen: QRCodeViewerView,
            isFullScreen: true,
            showBtnVoucher: true,
            showIconVoucher: false,
            titleKey: 'transaction_detail.payment_cancel_qr_title',
            btnVoucher: t('transaction_detail.back_to_transaction_detail'),
            titleVoucher: t('transaction_detail.payment_cancel_request'),
            data: response,
            // onRefresh: onRefreshQR(voucher),
          });
        },
      }),
    );
  };

  return {
    data,
    groupedLegs,
    loading,
    order,
    onPressQR,
    isDebit,
    isShowDashDivider,
  };
}
