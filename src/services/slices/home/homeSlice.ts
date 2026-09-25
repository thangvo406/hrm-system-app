import type { IRequestGetHomeInfo } from '@type/home';

import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice chỉ mang action trigger, không giữ state: dữ liệu Trang chủ chỉ màn đó
 * dùng nên nằm ở local state của `useHome` qua callback của saga
 * (xem "State flow" trong `.cursorrules`).
 */
const homeSlice = createSlice({
  initialState: {},
  name: 'home',
  reducers: {
    getHomeInfoRequest: {
      prepare: (payload: IRequestGetHomeInfo) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const { getHomeInfoRequest } = homeSlice.actions;

export const homeReducer = homeSlice.reducer;
