import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAccount } from '@type/accountManagement';
import type {
  IRequestAddAccount,
  IRequestGetAccountCards,
} from '@type/accountManagement';
import type { IRequestLockCard, IRequestRemoveCard } from '@type/wallet';

import { createSlice } from '@reduxjs/toolkit';

type AccountManagementState = {
  accountCards: IAccount[];
};

const initialState: AccountManagementState = {
  accountCards: [],
};

const accountManagementSlice = createSlice({
  initialState,
  name: 'accountManagement',
  reducers: {
    addAccountRequest: {
      prepare: (payload: IRequestAddAccount) => ({ payload }),
      reducer: () => {},
    },
    getAccountCardsRequest: {
      prepare: (payload: IRequestGetAccountCards) => ({ payload }),
      reducer: () => {},
    },
    getAccountCardsSuccess: (state, action: PayloadAction<IAccount[]>) => {
      state.accountCards = action.payload;
    },
    lockCardAccountRequest: {
      prepare: (payload: IRequestLockCard) => ({ payload }),
      reducer: () => {},
    },
    makeDefaultCardAccountRequest: {
      prepare: (payload: IRequestLockCard) => ({ payload }),
      reducer: () => {},
    },
    removeCardAccountRequest: {
      prepare: (payload: IRequestRemoveCard) => ({ payload }),
      reducer: () => {},
    },
    unLockCardAccountRequest: {
      prepare: (payload: IRequestLockCard) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  addAccountRequest,
  getAccountCardsRequest,
  getAccountCardsSuccess,
  lockCardAccountRequest,
  makeDefaultCardAccountRequest,
  removeCardAccountRequest,
  unLockCardAccountRequest,
} = accountManagementSlice.actions;
export const accountManagementReducer = accountManagementSlice.reducer;
