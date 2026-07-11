import type { Product } from '@type/products';

import { useAppDispatch } from '@services/common/storeHooks';
import { getProductsRequest } from '@services/slices/products/productsSlice';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListApiResponse } from '@type/common';
import type { RootScreenProps } from '@navigation/types';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import { getStoreDetailRequest } from '@services/slices/stores/storesSlice';
import { StoreItem } from '@type/store';

export type { Product } from '@type/products';

export const useProducts = (props: RootScreenProps<Paths.Products>) => {
  const dispatch = useAppDispatch();
  const { data: store, storeId } = AppNavigator.getParams(props);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [storeInfo, setStoreInfo] = useState<StoreItem | undefined>(store);
  const [searchKey, setSearchKey] = useState('');
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const goToCart = () => {
    AppNavigator.navigate(Paths.PaymentCart, {
      cartId: storeInfo?.cartId,
    });
  };
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

  const onSearchChange = useCallback((text: string) => {
    setSearchKey(text);
    setCurrentPage(0);
  }, []);

  const isShowBtnCart = useMemo(() => {
    return storeInfo?.cartId > 0;
  }, [storeInfo]);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleFailure = () => {
    setLoading(false);
    setData([]);
  };

  useEffect(() => {
    dispatch(
      getStoreDetailRequest({
        storeId: storeId || store?.id,
        // onFailure: handleFailure,
        onSuccess: (data: StoreItem) => {
          setStoreInfo(data);
        },
        onFailure: () => {
          setLoading(false);
          setData([]);
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getProductsRequest({
        storeId: storeInfo?.id || 1,
        page: currentPage,
        keyword: searchKey,
        size: 10,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, storeInfo, searchKey, currentPage]);

  return {
    data,
    loading,
    onSearchChange,
    goToCart,
    isShowBtnCart,
    storeInfo,
    onLoadMore,
  };
};
