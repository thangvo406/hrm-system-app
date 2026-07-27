import type {
  IRequestAddAccount,
  IRequestGetAccountCards,
} from '@type/accountManagement';

import { createSlice } from '@reduxjs/toolkit';

const accountManagementSlice = createSlice({
  initialState: {},
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
  },
});

export const { addAccountRequest, getAccountCardsRequest } =
  accountManagementSlice.actions;
export const accountManagementReducer = accountManagementSlice.reducer;
