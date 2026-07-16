import type { AppCallback, ListApiResponse } from './common';

export type SurveyStatus = 'CLOSED' | 'OPEN';

export interface Survey {
  id: number;
  name: string;
  startDate: SurveyStatus;
  expireDate: number;
  allowToViewResponse: boolean;
  allowToStartSurvey: boolean;
  createdDate: string;
}

export interface SurveyAnswerOption {
  id: number;
  questionId: number;
  content: string;
  sortOrder: number;
}

export interface SurveyQuestion {
  id: number;
  surveyId: number;
  content: string;
  sortOrder: number;
  options: SurveyAnswerOption[];
}

export interface SurveyDetail {
  id: number;
  name: string;
  startDate: string;
  expireDate: string;
  createdDate: string;
  questions: SurveyQuestion[];
}

export interface IRequestGetSurveyDetail
  extends AppCallback<IResponseSurveyDetail> {
  surveyId: number | string;
}

export interface IRequestGetSurveyList
  extends AppCallback<ListApiResponse<Survey[]>> {
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

export interface SubmitSurveyAnswer {
  answerText: string;
  questionId: number;
}

export interface SubmitSurveyBody {
  answers: SubmitSurveyAnswer[];
}

export interface IRequestSubmitSurvey extends AppCallback, SubmitSurveyBody {
  readonly surveyId: number | string;
}

