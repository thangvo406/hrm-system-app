import type { ListApiResponse } from '@type/common';
import type { StoreItem } from '@type/store';

import { Paths } from '@navigation/paths';
import { getStoresRequest } from '@services/slices/stores/storesSlice';
import { useAppDispatch } from '@services/common/storeHooks';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AppNavigator from '@navigation/AppNavigator';

export type { StoreItem } from '@type/store';

const PAGE_SIZE = 10;

export const useStore = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<readonly StoreItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
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
          searchName: searchKey,
          page: currentPage,
          size: PAGE_SIZE,
        }),
      );
    }, [currentPage, searchKey, dispatch, handleFailure, handleSuccess]),
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

  const onPressProduct = useCallback(
    (_store: StoreItem, productId: number) => {
      AppNavigator.navigate(Paths.ProductDetail, { id: productId, storeId: _store?.id });
    },
    [],
  );

  const onSearchChange = useCallback((text: string) => {
    setSearchKey(text);
    setCurrentPage(0);
  }, []);

  return {
    error,
    loading,
    onLoadMore,
    onPressProduct,
    onPressStore,
    onSearchChange,
    stores: data,
  };
};
