import type { IconName } from '@assets/icons';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';
import type { KeyboardEvent } from 'react-native';

import AppNavigator from '@navigation/AppNavigator';
import { DeviceUtils } from '@kits/core/utils';
import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard } from 'react-native';
import { useAppDispatch } from '@services/common/storeHooks';
import { cancelOrderRequest } from '@services/slices/payment/paymentSlice';

const { isIOS, isIPadOrTablet } = DeviceUtils;

const KEYBOARD_ANIMATION_DURATION_MS = 250;

export type CancelReasonId =
  | 'CHANGE_MIND'
  | 'DELIVERY_DELAY'
  | 'ORDER_MISTAKE'
  | 'OTHER'
  | 'STORE_ISSUE';

export type CancelReasonItem = {
  readonly icon: IconName;
  readonly id: CancelReasonId;
  readonly label: string;
};

const CANCEL_REASONS: readonly CancelReasonItem[] = [
  {
    icon: 'ic_refresh',
    id: 'CHANGE_MIND',
    label: 'cancellation_order.reason_change_mind',
  },
  {
    icon: 'ic_order_receipt',
    id: 'ORDER_MISTAKE',
    label: 'cancellation_order.reason_order_mistake',
  },
  {
    icon: 'ic_scooter',
    id: 'DELIVERY_DELAY',
    label: 'cancellation_order.reason_delivery_delay',
  },
  {
    icon: 'ic_store',
    id: 'STORE_ISSUE',
    label: 'cancellation_order.reason_store_issue',
  },
  {
    icon: 'ic_chat_bubble',
    id: 'OTHER',
    label: 'cancellation_order.reason_other',
  },
];

export const useCancellationOrder = (
  props: RootScreenProps<Paths.CancellationOrder>,
) => {
  const { order } = AppNavigator.getParams(props);
  const [selectedReason, setSelectedReason] =
    useState<CancelReasonItem>(CANCEL_REASONS[0]);
  const [otherReason, setOtherReason] = useState('');
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const dispatch = useAppDispatch()
  // "기타" carries no meaning on its own, so it only counts once the user
  // has typed something.
  const disabledSubmit = selectedReason?.id === 'OTHER' && !otherReason.trim();

  useEffect(() => {
    const showEvent = isIOS() ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS() ? 'keyboardWillHide' : 'keyboardDidHide';

    // Shift the reason list up so the focused "other reason" input stays
    // visible above the keyboard.
    const onShow = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        toValue: -event.endCoordinates.height / 2,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  const onPressReason = (item: CancelReasonItem) => () => {
    setSelectedReason(item);
  };

  const onChangeOtherReason = (text: string) => {
    setOtherReason(text);
  };

  const onPressBack = () => {
    AppNavigator.goBack();
  };

  const onSubmit = () => {
    // AppNavigator.goBack();
    dispatch(
      cancelOrderRequest({
        reason: selectedReason.id === 'OTHER' ? otherReason : selectedReason.label,
        onFailure: message => AppNavigator.showSnackBar({
          message,
          type: 'failed'
        }),
        onSuccess: () => onPressBack()
      }),
    );
  };

  return {
    disabledSubmit,
    keyboardOffset,
    onChangeOtherReason,
    onPressBack,
    onPressReason,
    onSubmit,
    otherReason,
    reasons: CANCEL_REASONS,
    selectedReason: selectedReason?.id,
    order,
  };
};
