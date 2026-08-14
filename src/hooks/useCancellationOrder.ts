import type { IconName } from '@assets/icons';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import AppNavigator from '@navigation/AppNavigator';
import { useState } from 'react';

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
    useState<CancelReasonId>('CHANGE_MIND');
  const [otherReason, setOtherReason] = useState('');

  // "기타" carries no meaning on its own, so it only counts once the user
  // has typed something.
  const disabledSubmit = selectedReason === 'OTHER' && !otherReason.trim();

  const onPressReason = (id: CancelReasonId) => () => {
    setSelectedReason(id);
  };

  const onChangeOtherReason = (text: string) => {
    setOtherReason(text);
  };

  const onPressBack = () => {
    AppNavigator.goBack();
  };

  const onSubmit = () => {
    AppNavigator.goBack();
  };

  return {
    disabledSubmit,
    onChangeOtherReason,
    onPressBack,
    onPressReason,
    onSubmit,
    otherReason,
    reasons: CANCEL_REASONS,
    selectedReason,
    order,
  };
};
