import type { ListApiResponse } from '@type/common';
import type { StoreItem } from '@type/store';
import type { StoreFilterValue } from '@dialogs/FilterStore';

import { Paths } from '@navigation/paths';
import { getStoresRequest } from '@services/slices/stores/storesSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AppNavigator from '@navigation/AppNavigator';
import FilterStore from '@dialogs/FilterStore';
import { StoresSelector } from '@services/selectors';

export type { StoreItem } from '@type/store';

const PAGE_SIZE = 10;
const DEFAULT_FILTER: StoreFilterValue = {
  sortBy: 'sortOrder',
  sortDirection: 'asc',
};

const onBack = () => {
  const canBack = AppNavigator.canGoBack();
  if (canBack) {
    AppNavigator.goBack();
  } else {
    AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
  }
};

export const useStore = () => {
  const dispatch = useAppDispatch();
  const storeOrderRecent = useAppSelector(StoresSelector.getStoreOrderRecent);
  const [data, setData] = useState<readonly StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<StoreFilterValue>(DEFAULT_FILTER);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = useCallback(
    (response: ListApiResponse<StoreItem[]>) => {
      isLast.current = response.last;
      setLoading(false);
      const items = response?.content || [];
      setData(prev => (currentPage === 0 ? items : [...prev, ...items]));
      isLoadingMore.current = false;
    },
    [currentPage],
  );

  const isShowSearchBar = useMemo(() => {
    return !!searchKey;
  }, [searchKey]);

  const handleFailure = useCallback((message: string) => {
    setError(message);
    setLoading(false);
    isLoadingMore.current = false;
  }, []);

  useFocusEffect(
    useCallback(() => {
      isLoadingMore.current = true;
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
      searchKey,
      dispatch,
      handleFailure,
      handleSuccess,
    ]),
  );

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onPressStore = useCallback((store: StoreItem) => {
    AppNavigator.navigate(Paths.Products, { data: store });
  }, []);

  const onPressProduct = useCallback((_store: StoreItem, productId: number) => {
    AppNavigator.navigate(Paths.ProductDetail, {
      id: productId,
      storeId: _store?.id,
    });
  }, []);

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
    isShowSearchBar,
    storeOrderRecent,
    onLoadMore,
    onPressProduct,
    onPressStore,
    onPressFilter,
    onSearchChange,
    onBack,
    stores: data,
  };
};
