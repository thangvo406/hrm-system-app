import type { PayloadAction } from '@reduxjs/toolkit';
import type { ListApiResponse } from '@type/common';
import type {
  GetSurveyDetailActionPayload,
  GetSurveyListPayload,
  IResponseSurveyDetail,
  SubmitSurveyPayload,
  Survey,
} from '@type/survey';

import { call, takeLatest } from 'redux-saga/effects';

import { getSurveyDetail, getSurveyList, submitSurvey } from '@services/request/survey';
import {
  getSurveyDetailRequest,
  getSurveyListRequest,
  submitSurveyRequest,
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

function* submitSurveyWorker(
  action: PayloadAction<SubmitSurveyPayload>,
): Generator<unknown, void, void> {
  const { onFailure, onSuccess, surveyId, answers } = action.payload;
  try {
    yield call(submitSurvey, surveyId, { answers });
    onSuccess?.();
  } catch (error_) {
    const message = error_ instanceof Error ? error_.message : 'Unknown error';
    onFailure?.(message);
  }
}

export function* surveySaga() {
  yield takeLatest(getSurveyListRequest.type, getSurveyListWorker);
  yield takeLatest(getSurveyDetailRequest.type, getSurveyDetailWorker);
  yield takeLatest(submitSurveyRequest.type, submitSurveyWorker);
}
