import type {
  IRequestGetSurveyDetail,
  IRequestGetSurveyList,
  IRequestSubmitSurvey,
} from '@type/survey';

import { createSlice } from '@reduxjs/toolkit';

const surveySlice = createSlice({
  initialState: {},
  name: 'survey',
  reducers: {
    getSurveyDetailRequest: {
      prepare: (payload: IRequestGetSurveyDetail) => ({ payload }),
      reducer: () => {},
    },
    getSurveyListRequest: {
      prepare: (payload: IRequestGetSurveyList = {}) => ({ payload }),
      reducer: () => {},
    },
    submitSurveyRequest: {
      prepare: (payload: IRequestSubmitSurvey) => ({ payload }),
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
