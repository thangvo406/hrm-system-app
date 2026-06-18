import type { Product } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import { getProductsRequest } from '@services/slices/products/productsSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListApiResponse } from '@type/common';

export type { Product } from '@type/products';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);

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
      getProductsRequest({
        storeId: 1,
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
    onLoadMore,
  };
};
