import { useCallback, useMemo, useState } from 'react';

export type TPayPointTab = 'payMoney' | 'point';

export type TPayPointTagType =
  | 'accrue'
  | 'event'
  | 'expire'
  | 'use'
  | 'welfare';

export type TPayPointUnit = 'point' | 'won';

export type TPayPointAmountTone = 'negative' | 'neutral' | 'positive';

export type IPayPointHistory = {
  readonly amount: number;
  readonly amountTone: TPayPointAmountTone;
  readonly balance: number;
  readonly dateTime: string;
  readonly description: string;
  readonly expiry?: string;
  readonly expiryHighlight?: boolean;
  readonly id: string;
  readonly tag: TPayPointTagType;
  readonly unit: TPayPointUnit;
};

export type IPayPointSummary = {
  readonly balance: number;
  readonly point: number;
  readonly pointExpiring: number;
};

const SUMMARY: IPayPointSummary = {
  balance: 100_000,
  point: 11_000,
  pointExpiring: 1_000,
};

const POINT_HISTORIES: readonly IPayPointHistory[] = [
  {
    amount: -10_000,
    amountTone: 'negative',
    balance: 100_000,
    dateTime: '2026-04-12T10:00:00',
    description: '(재징영)\n스마트오더',
    expiry: '2026-09-30',
    id: 'point-1',
    tag: 'event',
    unit: 'won',
  },
  {
    amount: 10_000,
    amountTone: 'positive',
    balance: 100_000,
    dateTime: '2026-04-12T10:00:00',
    description: '페이머니 충전',
    expiry: '2026-09-30',
    id: 'point-2',
    tag: 'accrue',
    unit: 'won',
  },
  {
    amount: -10_000,
    amountTone: 'negative',
    balance: 100_000,
    dateTime: '2026-04-12T10:00:00',
    description: '현장 결제',
    expiry: 'D-7',
    expiryHighlight: true,
    id: 'point-3',
    tag: 'welfare',
    unit: 'won',
  },
  {
    amount: -500,
    amountTone: 'neutral',
    balance: 9_500,
    dateTime: '2026-04-12T10:00:00',
    description: '포인트 사용',
    id: 'point-4',
    tag: 'use',
    unit: 'point',
  },
  {
    amount: -300,
    amountTone: 'neutral',
    balance: 9_200,
    dateTime: '2026-04-12T10:00:00',
    description: '포인트 소멸',
    expiry: 'D-3',
    expiryHighlight: true,
    id: 'point-5',
    tag: 'expire',
    unit: 'point',
  },
];

const PAY_MONEY_HISTORIES: readonly IPayPointHistory[] = [
  {
    amount: 50_000,
    amountTone: 'positive',
    balance: 100_000,
    dateTime: '2026-04-12T10:00:00',
    description: '페이머니 충전',
    id: 'pay-1',
    tag: 'accrue',
    unit: 'won',
  },
  {
    amount: -12_000,
    amountTone: 'negative',
    balance: 88_000,
    dateTime: '2026-04-11T14:30:00',
    description: '현장 결제',
    id: 'pay-2',
    tag: 'welfare',
    unit: 'won',
  },
  {
    amount: -3_500,
    amountTone: 'negative',
    balance: 84_500,
    dateTime: '2026-04-10T09:15:00',
    description: '스마트오더',
    id: 'pay-3',
    tag: 'event',
    unit: 'won',
  },
];

const EXPIRING_NOTICE = {
  amount: 300,
  days: 3,
} as const;

export const usePayPointHistories = () => {
  const [activeTab, setActiveTab] = useState<TPayPointTab>('point');

  const onChangeTab = useCallback((tab: TPayPointTab) => {
    setActiveTab(tab);
  }, []);

  const onPressRefund = useCallback(() => {}, []);

  const onDismissNotice = useCallback(() => {}, []);

  const histories = useMemo(
    () => (activeTab === 'point' ? POINT_HISTORIES : PAY_MONEY_HISTORIES),
    [activeTab],
  );

  return {
    activeTab,
    expiringNotice: EXPIRING_NOTICE,
    histories,
    onChangeTab,
    onDismissNotice,
    onPressRefund,
    payMoneyHistories: PAY_MONEY_HISTORIES,
    pointHistories: POINT_HISTORIES,
    summary: SUMMARY,
  };
};
