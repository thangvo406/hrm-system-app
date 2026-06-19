import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  GetSurveyDetailActionPayload,
  GetSurveyListPayload,
  IResponseSurveyDetail,
  Survey,
} from '@type/survey';

import { call, takeLatest } from 'redux-saga/effects';

import { getSurveyDetail, getSurveyList } from '@services/request/survey';
import {
  getSurveyDetailRequest,
  getSurveyListRequest,
} from './surveySlice';

function* getSurveyListWorker(
  action: PayloadAction<GetSurveyListPayload>,
): Generator<unknown, void, ListApiResponse<Survey[]>> {
  const { onFailure, onSuccess, ...request } = action.payload || {};
  try {
    const response: ListApiResponse<Survey[]> = yield call(
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
  action: PayloadAction<GetSurveyDetailActionPayload>,
): Generator<unknown, void, IResponseSurveyDetail> {
  const { onFailure, onSuccess, surveyId } = action.payload;
  try {
    const response: IResponseSurveyDetail = yield call(
      getSurveyDetail,
      surveyId,
    );
    onSuccess?.(response);
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* surveySaga() {
  yield takeLatest(getSurveyListRequest.type, getSurveyListWorker);
  yield takeLatest(getSurveyDetailRequest.type, getSurveyDetailWorker);
}
