import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  IRequestGetSurveyDetail,
  IRequestGetSurveyList,
  IRequestSubmitSurvey,
  IResponseSurveyDetail,
  ISurvey,
} from '@type/survey';

import { call, takeLatest } from 'redux-saga/effects';

import {
  getSurveyDetail,
  getSurveyList,
  submitSurvey,
} from '@services/request/survey';
import {
  getSurveyDetailRequest,
  getSurveyListRequest,
  submitSurveyRequest,
} from './surveySlice';

function* getSurveyListWorker(
  action: PayloadAction<IRequestGetSurveyList>,
): Generator<unknown, void, ListApiResponse<ISurvey[]>> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<ISurvey[]> = yield call(
      getSurveyList,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

function* getSurveyDetailWorker(
  action: PayloadAction<IRequestGetSurveyDetail>,
): Generator<unknown, void, IResponseSurveyDetail> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    const response: IResponseSurveyDetail = yield call(
      getSurveyDetail,
      request,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

function* submitSurveyWorker(
  action: PayloadAction<IRequestSubmitSurvey>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, ...request } = action.payload;
  try {
    yield call(submitSurvey, request);
    onSuccess?.();
  } catch (error_: any) {
    const message =
      error_?.response?.data?.message || error_?.message || 'Unknown error';
    onFailure?.(message);
  }
}

export function* surveySaga() {
  yield takeLatest(getSurveyListRequest.type, getSurveyListWorker);
  yield takeLatest(getSurveyDetailRequest.type, getSurveyDetailWorker);
  yield takeLatest(submitSurveyRequest.type, submitSurveyWorker);
}
