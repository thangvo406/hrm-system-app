import type {
  GetSurveyDetailPayload,
  GetSurveyPayload,
  SubmitSurveyPayload,
} from '@type/survey';

import { createSlice } from '@reduxjs/toolkit';

const surveySlice = createSlice({
  initialState: {},
  name: 'survey',
  reducers: {
    getSurveyDetailRequest: {
      prepare: (payload: GetSurveyDetailPayload) => ({ payload }),
      reducer: () => {},
    },
    getSurveyListRequest: {
      prepare: (payload: GetSurveyPayload = {}) => ({ payload }),
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
