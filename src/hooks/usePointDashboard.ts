import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { getPayPointHistoriesRequest } from '@services/slices/account/accountSlice';
import { IPointPayHistory, ListApiResponse } from '@type';
import { useEffect, useState } from 'react';

export type TPointHistoryType = 'accrue' | 'expire' | 'use';

const onUsePoint = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onViewExpireDetail = () => {
  AppNavigator.navigate(Paths.PointExpiring);
};

const onPressItemHistory = (item: any) => () => {
  AppNavigator.navigate(Paths.TransactionDetail, { transId: item?.id });
};
const onViewAllHistory = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

const onLegacyLookup = () => {
  AppNavigator.navigate(Paths.PayPointHistories);
};

export const usePointDashboard = () => {
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const dispatch = useAppDispatch();
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    dispatch(
      getPayPointHistoriesRequest({
        balanceAccountType: 'POINT',
        onFailure: () => {
          // pagination.isLoadingMore = false;
          // setRefreshing(false);
          // setLoadingMore(false);
        },
        onSuccess: (data: ListApiResponse<IPointPayHistory[]>) => {
          setHistories(data?.content);
        },
        page: 0,
        size: 10,
      }),
    );
  }, []);

  return {
    balance: currentWallet?.pointBalance,
    expiringAmount: currentWallet?.expiringPointBalance,
    histories,
    onLegacyLookup,
    onPressItemHistory,
    onUsePoint,
    onViewAllHistory,
    onViewExpireDetail,
  };
};
