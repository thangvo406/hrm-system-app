import { useMemo, useState } from 'react';

export type PayCardHistoryTab = 'pay' | 'point';

export type PayCardTransaction = {
  readonly amount: string;
  readonly balanceAfter: string;
  readonly date: string;
  readonly description: string;
  readonly id: string;
  readonly type: PayCardHistoryTab;
};

const MOCK_PAY_BALANCE = '100,000';
const MOCK_POINT_BALANCE = '11,000';

const MOCK_PAY_TRANSACTIONS: readonly PayCardTransaction[] = [
  {
    amount: '-10,000원',
    balanceAfter: '100,000',
    date: '2026-04-12 10:00AM',
    description: '모바일 오더 사용',
    id: 'pay-1',
    type: 'pay',
  },
  {
    amount: '-10,000원',
    balanceAfter: '100,000',
    date: '2026-04-12 10:00AM',
    description: '모바일 오더 사용',
    id: 'pay-2',
    type: 'pay',
  },
  {
    amount: '-10,000원',
    balanceAfter: '100,000',
    date: '2026-04-12 10:00AM',
    description: '모바일 오더 사용',
    id: 'pay-3',
    type: 'pay',
  },
  {
    amount: '-10,000원',
    balanceAfter: '100,000',
    date: '2026-04-12 10:00AM',
    description: '모바일 오더 사용',
    id: 'pay-4',
    type: 'pay',
  },
];

const MOCK_POINT_TRANSACTIONS: readonly PayCardTransaction[] = [
  {
    amount: '-500 point',
    balanceAfter: '11,000',
    date: '2026-04-12 09:30AM',
    description: '포인트 사용',
    id: 'point-1',
    type: 'point',
  },
  {
    amount: '+1,000 point',
    balanceAfter: '11,500',
    date: '2026-04-11 03:15PM',
    description: '포인트 적립',
    id: 'point-2',
    type: 'point',
  },
];

const onRecharge = () => {
  // TODO: navigate to recharge flow when available
};

export const usePayCard = () => {
  const [historyTab, setHistoryTab] = useState<PayCardHistoryTab>('pay');

  const payBalance = MOCK_PAY_BALANCE;
  const pointBalance = MOCK_POINT_BALANCE;

  const transactions = useMemo(() => {
    if (historyTab === 'pay') {
      return MOCK_PAY_TRANSACTIONS;
    }
    return MOCK_POINT_TRANSACTIONS;
  }, [historyTab]);

  return {
    historyTab,
    onRecharge,
    payBalance,
    pointBalance,
    setHistoryTab,
    transactions,
  };
};
