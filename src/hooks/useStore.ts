import type { ListApiResponse } from '@type/common';
import type { IStoreItem } from '@type/store';
import type { StoreFilterValue } from '@dialogs/FilterStore';

import { Paths } from '@navigation/paths';
import {
  getStoreOrderRecentRequest,
  getStoresRequest,
} from '@services/slices/stores/storesSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AppNavigator from '@navigation/AppNavigator';
import FilterStore from '@dialogs/FilterStore';
import { StoresSelector } from '@services/selectors';

const PAGE_SIZE = 10;
const DEFAULT_FILTER: StoreFilterValue = {
  sortBy: 'sortOrder',
  sortDirection: 'asc',
};

const onBack = () => {
  const canBack = AppNavigator.canGoBack();
  if (!canBack || AppNavigator.getPreviousRoute()?.name == Paths.Products) {
    AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
  } else {
    AppNavigator.goBack();
  }
};

const onPressOrderHistory = () => {
  AppNavigator.navigate(Paths.Orders);
};

export const useStore = () => {
  const dispatch = useAppDispatch();
  const storeOrderRecent = useAppSelector(StoresSelector.getStoreOrderRecent);
  const [data, setData] = useState<readonly IStoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<StoreFilterValue>(DEFAULT_FILTER);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = useCallback(
    (response: ListApiResponse<IStoreItem[]>) => {
      isLast.current = response.last;
      setLoading(false);
      setRefreshing(false);
      const items = response?.content || [];
      setData(prev => (currentPage === 0 ? items : [...prev, ...items]));
      isLoadingMore.current = false;
    },
    [currentPage],
  );

  const handleFailure = useCallback((message: string) => {
    setError(message);
    setLoading(false);
    setRefreshing(false);
    isLoadingMore.current = false;
  }, []);

  useFocusEffect(
    useCallback(() => {
      isLoadingMore.current = true;
      dispatch(getStoreOrderRecentRequest());
      dispatch(
        getStoresRequest({
          onFailure: handleFailure,
          onSuccess: handleSuccess,
          keyword: searchKey,
          page: currentPage,
          size: PAGE_SIZE,
          ...(filter || {}),
        }),
      );
    }, [
      currentPage,
      filter,
      refreshIndex,
      searchKey,
      dispatch,
      handleFailure,
      handleSuccess,
    ]),
  );

  // Pulling resets to the first page and bumps the token. When the page is
  // already 0 the token is the only thing that changes, so the focus effect
  // still refetches — and it fires exactly once either way.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    isLast.current = false;
    isLoadingMore.current = false;
    setCurrentPage(0);
    setRefreshIndex(prev => prev + 1);
  }, []);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onPressStore = useCallback((store: IStoreItem) => {
    AppNavigator.navigate(Paths.Products, { data: store });
  }, []);

  const onPressProduct = useCallback(
    (_store: IStoreItem, productId: number) => {
      AppNavigator.navigate(Paths.ProductDetail, {
        id: productId,
        storeId: _store?.id,
      });
    },
    [],
  );

  const onSearchChange = useCallback((text: string) => {
    setSearchKey(text);
    setCurrentPage(0);
  }, []);

  const handleFilterSubmit = useCallback((value: StoreFilterValue) => {
    setFilter(value);
    setCurrentPage(0);
  }, []);

  const onPressFilter = useCallback(() => {
    AppNavigator.showDialog({
      screen: FilterStore,
      popupType: 'bottomSheet',
      initialValue: filter,
      onSubmit: handleFilterSubmit,
    });
  }, [filter, handleFilterSubmit]);

  return {
    error,
    filter,
    loading,
    refreshing,
    storeOrderRecent,
    onLoadMore,
    onPressProduct,
    onPressOrderHistory,
    onPressStore,
    onPressFilter,
    onRefresh,
    onSearchChange,
    onBack,
    stores: data,
  };
};
