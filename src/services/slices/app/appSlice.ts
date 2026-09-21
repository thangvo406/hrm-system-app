import type { PayloadAction } from '@reduxjs/toolkit';
import type { IAppConfig, IRequestGetAppConfig } from '@type/common';
import type { AppCallback } from '@type/common';

import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice `app` chỉ còn hai action trigger cho saga, không giữ state nào: app
 * config được dùng ngay trong worker (kiểm tra bắt buộc cập nhật) chứ không lưu
 * lại, còn kết quả startup đi ra bằng callback.
 */
export interface AppState {
  config: IAppConfig | undefined;
}

const initialState: AppState = {
  config: undefined,
};

const appSlice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    getAppConfigRequest: {
      prepare: (payload: IRequestGetAppConfig = {}) => ({ payload }),
      reducer: () => {},
    },
    getAppConfigSuccess: (state, action: PayloadAction<IAppConfig>) => {
      state.config = action.payload;
    },
    startupApp: {
      prepare: (payload: AppCallback<boolean> = {}) => ({ payload }),
      reducer: () => {
        // No state mutation — saga handles work, callbacks deliver result.
      },
    },
  },
});

export const { getAppConfigRequest, getAppConfigSuccess, startupApp } =
  appSlice.actions;

export const appReducer = appSlice.reducer;
