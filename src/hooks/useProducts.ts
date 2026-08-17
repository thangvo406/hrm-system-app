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
import debounce from 'lodash/debounce';
import { CommonUtils } from '@utils';
import { useFocusEffect } from '@react-navigation/native';
import { useReturnParams } from '@hooks/useReturnParams';

const QUANTITY_UPDATE_DEBOUNCE_MS = 350;

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
  const debouncedUpdatesByCartItemId = useRef<
    Map<number, ReturnType<typeof debounce>>
  >(new Map());
  useReturnParams<{ dataGoBack: any }>(
    props,
    ['dataGoBack'],
    ({ dataGoBack }) => {
      if (dataGoBack) {
        const { productId, cartInfo } = dataGoBack;
        const index = data?.findIndex(it => it.id == productId);
        if (index != -1) {
          const newData = [...data];
          newData[index] = {
            ...newData[index],
            cartItemInfo: cartInfo,
          };
          setData(newData);
        }
      }
    },
  );

  const isOutsideOpenHour = useMemo(
    () => CommonUtils.isStoreOutsideOpenHour(storeInfo),
    [storeInfo],
  );

  const goToCart = () => {
    AppNavigator.navigate(Paths.CartDetail, {
      cartId: storeInfo?.cartId,
    });
  };
  const handleSuccess = (data: ListApiResponse<IProduct[]>) => {
    // setData(items);

    isLast.current = data.last;
    setData(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      setLoading(false);
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

  const onChangeQuantity = useCallback(
    (item: any, index: number) => {
      const cartItemInfo = item?.cartItemInfo;
      if (!cartItemInfo) {
        return;
      }
      setData(prev => {
        const next = [...prev];
        next[index] = { ...next[index], cartItemInfo };
        return next;
      });

      const { quantity, selectedAttributes, cartItemId } = cartItemInfo;
      const flatAttributes = Object.values(selectedAttributes || [])
        .flat()
        .map(attribute => ({
          attributeItemId: attribute?.attributeItemId,
          quantity: attribute?.quantity,
        })) as AttributeCheckout[];

      let scheduleUpdate = debouncedUpdatesByCartItemId.current.get(cartItemId);
      if (!scheduleUpdate) {
        scheduleUpdate = debounce(
          (nextQuantity: number, nextAttributes: AttributeCheckout[]) => {
            dispatch(
              updateCartItemRequest({
                quantity: nextQuantity,
                productId: item?.id,
                selectedAttributes: nextAttributes,
                cartItemId,
                onSuccess: (response: any) => {
                  setStoreInfo(prev =>
                    prev
                      ? { ...prev, totalAmountCart: response?.subTotal }
                      : prev,
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
          },
          QUANTITY_UPDATE_DEBOUNCE_MS,
        );
        debouncedUpdatesByCartItemId.current.set(cartItemId, scheduleUpdate);
      }
      scheduleUpdate(quantity, flatAttributes);
    },
    [dispatch],
  );
  const handleFailure = () => {
    setLoading(false);
  };

  useEffect(() => {
    const debouncedUpdates = debouncedUpdatesByCartItemId.current;
    return () => {
      for (const scheduled of debouncedUpdates.values()) {
        scheduled.cancel();
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!storeInfo) {
        return;
      }
      if(!isLoadingMore.current && currentPage != 0) {
        setCurrentPage(0)
        return;
      }
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
    }, [dispatch, storeInfo?.id, searchKey, currentPage]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getStoreDetailRequest({
          storeId: storeId || store?.id,
          // onFailure: handleFailure,
          onSuccess: (data: IStoreItem) => {
            setStoreInfo(data);
          },
          onFailure: () => {
            setLoading(false);
          },
        }),
      );
    }, [dispatch]),
  );

  return {
    data,
    loading,
    isOutsideOpenHour,
    onSearchChange,
    goToCart,
    onChangeQuantity,
    isShowBtnCart,
    storeInfo,
    onLoadMore,
  };
};
