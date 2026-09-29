import type {
  IRequestGetRequestCounts,
  IRequestGetRequests,
  TCreateRequestDraft,
  TRequestType,
} from '@type/requests';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

type TRequestsState = {
  drafts: Partial<Record<TRequestType, TCreateRequestDraft>>;
};

const initialState: TRequestsState = {
  drafts: {},
};

const requestsSlice = createSlice({
  initialState,
  name: 'requests',
  reducers: {
    clearDraftRequest: (state, action: PayloadAction<TRequestType>) => {
      state.drafts = { ...state.drafts, [action.payload]: undefined };
    },
    getRequestCountsRequest: {
      prepare: (payload: IRequestGetRequestCounts) => ({ payload }),
      reducer: () => {},
    },
    getRequestsRequest: {
      prepare: (payload: IRequestGetRequests) => ({ payload }),
      reducer: () => {},
    },

    saveDraftRequest: (state, action: PayloadAction<TCreateRequestDraft>) => {
      state.drafts = { ...state.drafts, [action.payload.type]: action.payload };
    },
  },
});

export const {
  clearDraftRequest,
  getRequestCountsRequest,
  getRequestsRequest,
  saveDraftRequest,
} = requestsSlice.actions;

export const requestsReducer = requestsSlice.reducer;
