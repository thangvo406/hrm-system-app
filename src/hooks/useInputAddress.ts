import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@services/common/storeHooks';
import { autoCompleteAddressRequest } from '@services/slices/account/accountSlice';
import type { SearchAddressItem } from '@type/common';
import { mapKakaoAddress } from '@utils/common';
import { debounce } from 'lodash';
import { DeviceEventEmitter } from 'react-native';
import { AppConstants } from '@constants';
import AppNavigator from '@navigation/AppNavigator';

export type { AddressSuggestion } from '@services/request/account';

export const useInputAddress = () => {
  const dispatch = useAppDispatch();
  const [addressValue, setAddressValue] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [suggestions, setSuggestions] = useState<SearchAddressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    SearchAddressItem | undefined
  >();

  const debounceGetAddressId = useRef(null);

  useEffect(() => {
    if (!(addressValue?.length > 1)) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    debounceGetAddressId.current?.cancel?.();
    debounceGetAddressId.current = debounce(() => {
      dispatch(
        autoCompleteAddressRequest({
          onSuccess: response => {
            const mapping = response.documents?.map(it => {
              return mapKakaoAddress(it);
            });
            setLoading(false);
            setSuggestions(mapping);
          },
          onFailure: () => {
            setLoading(false);
            setSuggestions([]);
          },
          query: addressValue,
        }),
      );
    }, 350);
    debounceGetAddressId.current();
  }, [addressValue]);

  const setAddress = (value: string) => {
    setAddressValue(value);
    setSelectedAddress(undefined);
  };

  const onSelectAddress = (item: SearchAddressItem) => {
    setSelectedAddress(item);
    // setAddressValue(item.roadAddress ?? item.landAddress ?? '');
    // setSuggestions([]);
  };

  const onConfirm = () => {
    DeviceEventEmitter.emit(AppConstants.UPDATE_ADDRESS_CART_KEY, {
      address: selectedAddress,
      detail: detailAddress,
    });
    AppNavigator.goBack();
  };

  return {
    address: addressValue,
    detailAddress,
    onConfirm,
    onSelectAddress,
    loading,
    selectedAddress,
    setAddress,
    setDetailAddress,
    suggestions,
  };
};
