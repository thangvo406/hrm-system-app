import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

export type TPointHistoryType = 'accrue' | 'expire' | 'use';

export type IPointHistory = {
  readonly amount: number;
  readonly date: string;
  readonly id: string;
  readonly type: TPointHistoryType;
};

const POINT_BALANCE = 1000;
const EXPIRING_AMOUNT = 200;

const POINT_HISTORIES: readonly IPointHistory[] = [
  { amount: 35, date: '2026-07-13', id: 'point-1', type: 'accrue' },
  { amount: -500, date: '2026-07-10', id: 'point-2', type: 'use' },
  { amount: -300, date: '2026-06-30', id: 'point-3', type: 'expire' },
];

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onViewExpireDetail = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onViewAllHistory = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onLegacyLookup = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

export const usePointMain = () => {
  return {
    balance: POINT_BALANCE,
    expiringAmount: EXPIRING_AMOUNT,
    histories: POINT_HISTORIES,
    onLegacyLookup,
    onUsePoint,
    onViewAllHistory,
    onViewExpireDetail,
  };
};
