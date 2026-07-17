import type { AppCallback, ListApiResponse } from './common';

export type ISurveyStatus = 'CLOSED' | 'OPEN';

export interface ISurvey {
  id: number;
  name: string;
  startDate: ISurveyStatus;
  expireDate: number;
  allowToViewResponse: boolean;
  allowToStartSurvey: boolean;
  createdDate: string;
}

export interface ISurveyAnswerOption {
  id: number;
  questionId: number;
  content: string;
  sortOrder: number;
}

export interface ISurveyQuestion {
  id: number;
  surveyId: number;
  content: string;
  sortOrder: number;
  options: ISurveyAnswerOption[];
}

export interface ISurveyDetail {
  id: number;
  name: string;
  startDate: string;
  expireDate: string;
  createdDate: string;
  questions: ISurveyQuestion[];
}

export interface IRequestGetSurveyDetail
  extends AppCallback<IResponseSurveyDetail> {
  surveyId: number | string;
}

export interface IRequestGetSurveyList
  extends AppCallback<ListApiResponse<ISurvey[]>> {
  fromDate?: string;
  name?: string;
  page?: number;
  size?: number;
  toDate?: string;
}

export interface IResponseSurveyDetail {
  id: number;
  name: string;
  startDate: string;
  expireDate: string;
  isPublished: boolean;
  createdDate: string;
  questions: IQuestion[];
  allowToViewResponse: boolean;
  allowToStartSurvey: boolean;
}

export interface IQuestion {
  id: number;
  title: string;
  type: string;
  sortOrder: number;
  answers: IAnswer[];
  selectedAnswerId?: number;
  selectedAnswerText?: string;
}

export interface IAnswer {
  id: number;
  title: string;
  sortOrder: number;
}

export interface ISubmitSurveyAnswer {
  answerText: string;
  questionId: number;
}

export interface IRequestSubmitSurvey extends AppCallback {
  readonly surveyId: number | string;
  answers: ISubmitSurveyAnswer[];
}

