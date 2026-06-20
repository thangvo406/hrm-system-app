import type { Product } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import { getProductsRequest } from '@services/slices/products/productsSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListApiResponse } from '@type/common';
import type { RootScreenProps } from '@navigation/types';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import { getStoreDetailRequest } from '@services/slices/stores/storesSlice';
import { StoreItem } from '@type/store';

export type { Product } from '@type/products';

export const useProducts = (props: RootScreenProps<Paths.Products>) => {
  const dispatch = useAppDispatch();
  const { data: store } = AppNavigator.getParams(props);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [storeInfo, setStoreInfo] = useState<StoreItem | undefined>(store);

  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = (data: ListApiResponse<Product[]>) => {
    // setData(items);
    setLoading(false);
    isLast.current = data.last;
    setData(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      return results;
    });
  };

  const onLoadMore = useCallback(() => {
    // Remove alert for production
    // alert('onLoadMore');
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleFailure = (message: string) => {
    setError(message);
    // setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getStoreDetailRequest({
        storeId: store?.id || 1,
        // onFailure: handleFailure,
        onSuccess: (data: StoreItem) => {
          setStoreInfo(data);
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getProductsRequest({
        storeId: store?.id || 1,
        page: currentPage,
        size: 10,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, currentPage]);

  return {
    data,
    error,
    loading,
    storeInfo,
    onLoadMore,
  };
};
