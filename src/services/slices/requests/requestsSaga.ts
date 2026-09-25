import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IRequestGetRequestCounts,
  IRequestGetRequests,
  TRequestCounts,
  TRequestItem,
} from '@type/requests';
import type { ListApiResponse } from '@type/common';

import { call, takeLatest } from 'redux-saga/effects';

import { getRequestCounts, getRequests } from '@services/request/requests';
import { getRequestCountsRequest, getRequestsRequest } from './requestsSlice';
import { getErrorMessageApi } from '@utils/common';

function* getRequestsWorker(action: PayloadAction<IRequestGetRequests>) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: ListApiResponse<TRequestItem[]> = yield call(
      getRequests,
      request,
    );
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

function* getRequestCountsWorker(
  action: PayloadAction<IRequestGetRequestCounts>,
) {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: TRequestCounts = yield call(getRequestCounts, request);
    onSuccess?.(response);
  } catch (error) {
    onFailure?.(getErrorMessageApi(error));
  }
}

export function* requestsSaga() {
  // `takeLatest` bỏ trang đang bay khi có lần gọi mới: đổi bộ lọc giữa lúc tải
  // trang 2 thì chỉ kết quả của bộ lọc mới được nối vào danh sách.
  yield takeLatest(getRequestsRequest.type, getRequestsWorker);
  yield takeLatest(getRequestCountsRequest.type, getRequestCountsWorker);
}
