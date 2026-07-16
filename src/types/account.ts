import type { AddressSuggestion } from '@services/request/account';

import type { AppCallback } from './common';

export interface IRequestAutoCompleteAddress
  extends AppCallback<AddressSuggestion[]> {
  readonly query: string;
}

export interface IRequestUpdateMembership extends AppCallback {
  membershipType: string;
}

// Fire-and-forget: action này không có callback.
export interface IRequestUpdatePushId {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
}
