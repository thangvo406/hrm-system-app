import type {
  GetSurveyDetailActionPayload,
  GetSurveyListPayload,
  SubmitSurveyPayload,
} from '@type/survey';

import { createSlice } from '@reduxjs/toolkit';

const surveySlice = createSlice({
  initialState: {},
  name: 'survey',
  reducers: {
    getSurveyDetailRequest: {
      prepare: (payload: GetSurveyDetailActionPayload) => ({ payload }),
      reducer: () => {},
    },
    getSurveyListRequest: {
      prepare: (payload: GetSurveyListPayload = {}) => ({ payload }),
      reducer: () => {},
    },
    submitSurveyRequest: {
      prepare: (payload: SubmitSurveyPayload) => ({ payload }),
      reducer: () => {},
    },
  },
});

export const {
  getSurveyDetailRequest,
  getSurveyListRequest,
  submitSurveyRequest,
} = surveySlice.actions;
export const surveyReducer = surveySlice.reducer;
