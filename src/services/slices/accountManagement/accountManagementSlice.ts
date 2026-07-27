import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAccount } from '@type/accountManagement';
import type {
  IRequestAddAccount,
  IRequestGetAccountCards,
} from '@type/accountManagement';

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
  },
});

export const {
  addAccountRequest,
  getAccountCardsRequest,
  getAccountCardsSuccess,
} = accountManagementSlice.actions;
export const accountManagementReducer = accountManagementSlice.reducer;
