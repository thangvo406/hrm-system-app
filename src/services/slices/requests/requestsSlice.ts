import type {
  IRequestGetRequestCounts,
  IRequestGetRequests,
} from '@type/requests';

import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice chỉ mang action trigger, không giữ state: danh sách đơn và con trỏ phân
 * trang nằm ở local state của `useRequests` qua callback của saga
 * (xem "State flow" trong `.cursorrules`).
 */
const requestsSlice = createSlice({
  initialState: {},
  name: 'requests',
  reducers: {
    getRequestCountsRequest: {
      prepare: (payload: IRequestGetRequestCounts) => ({ payload }),
      reducer: () => {},
    },
    getRequestsRequest: {
      prepare: (payload: IRequestGetRequests) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getRequestCountsRequest, getRequestsRequest } =
  requestsSlice.actions;

export const requestsReducer = requestsSlice.reducer;
