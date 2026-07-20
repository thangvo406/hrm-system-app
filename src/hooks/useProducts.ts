import { useAppDispatch } from '@services/common/storeHooks';
import { getProductsRequest } from '@services/slices/products/productsSlice';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ListApiResponse } from '@type/common';
import type { RootScreenProps } from '@navigation/types';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import { getStoreDetailRequest } from '@services/slices/stores/storesSlice';
import { IStoreItem } from '@type/store';
import type { AttributeCheckout } from '@type/products';
import { IProduct } from '@type';
import { updateCartItemRequest } from '@services/slices/payment/paymentSlice';
import set from 'lodash/set';

export const useProducts = (props: RootScreenProps<Paths.Products>) => {
  const dispatch = useAppDispatch();
  const { data: store, storeId } = AppNavigator.getParams(props);
  const [data, setData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [storeInfo, setStoreInfo] = useState<IStoreItem | undefined>(store);
  const [searchKey, setSearchKey] = useState('');
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const goToCart = () => {
    AppNavigator.navigate(Paths.PaymentCart, {
      cartId: storeInfo?.cartId,
    });
  };
  const handleSuccess = (data: ListApiResponse<IProduct[]>) => {
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
    return (storeInfo?.cartId ?? 0) > 0;
  }, [storeInfo]);

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onChangeQuantity = (item: any, index: number) => {
    if (data[index]?.cartItemInfo?.quantity == item?.cartItemInfo?.quantity) {
      return;
    }
    const { quantity, selectedAttributes, cartItemId } =
      item.cartItemInfo || {};
    const flatAttributes = Object.values(selectedAttributes || [])
      .flat()
      .map(attributeItemId => ({ attributeItemId })) as AttributeCheckout[];
    dispatch(
      updateCartItemRequest({
        quantity,
        productId: item?.id,
        selectedAttributes: flatAttributes,
        cartItemId,
        onSuccess: (response: any) => {
          set(data, `[${index}].cartItemInfo`, item.cartItemInfo);
          setStoreInfo(prev =>
            prev ? { ...prev, totalAmountCart: response?.subTotal } : prev,
          );
        },
        onFailure: (message: string) => {
          AppNavigator.showSnackBar({
            message: message || '',
            type: 'failed',
          });
        },
      }),
    );
  };
  const handleFailure = () => {
    setLoading(false);
    setData([]);
  };

  useEffect(() => {
    dispatch(
      getStoreDetailRequest({
        storeId: storeId || store?.id,
        // onFailure: handleFailure,
        onSuccess: (data: IStoreItem) => {
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
  }, [dispatch, storeInfo?.id, searchKey, currentPage]);

  return {
    data,
    loading,
    onSearchChange,
    goToCart,
    onChangeQuantity,
    isShowBtnCart,
    storeInfo,
    onLoadMore,
  };
};
