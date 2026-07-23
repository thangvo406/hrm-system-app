import AppNavigator from '@navigation/AppNavigator';
import type { ITransactionDetail } from '@type/payment';
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';

const MOCK_TRANSACTION_DETAIL: ITransactionDetail = {
  couponDiscount: 3000,
  couponName: '음료무료쿠폰',
  finalPaymentAmount: 25_900,
  id: 'txn-mock-001',
  paidAt: '2026-04-12T10:00:00',
  paymentAmount: 29_900,
  payMoneyAmount: 25_900,
  pointEarned: 0,
  pointUsed: 1000,
  productName: '스마트 오더',
};

export function useTransactionDetail(props: any) {
  const params = AppNavigator.getParams(props);
  const data: ITransactionDetail = params?.data ?? MOCK_TRANSACTION_DETAIL;
  const formattedDate = dayjs(data.paidAt).format(DATE_FORMAT);

  return { data, formattedDate };
}
