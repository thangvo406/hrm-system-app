import type { AppCallback } from './common';

export interface IRequestUpdatePushId {
  optedIn: boolean;
  pushToken: string;
  subscriptionId: string;
}

export interface IRequestUpdatePushIdCallback
  extends AppCallback,
    IRequestUpdatePushId {}
