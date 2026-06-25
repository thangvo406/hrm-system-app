import type { AppCallback, ListApiResponse } from './common';

export type SurveyStatus = 'CLOSED' | 'OPEN';

export type Survey = {
  id: number;
  name: string;
  startDate: SurveyStatus;
  expireDate: number;
  allowToViewResponse: boolean;
  allowToStartSurvey: boolean;
  createdDate: string;
};

export type SurveyAnswerOption = {
  id: number;
  questionId: number;
  content: string;
  sortOrder: number;
};

export type SurveyQuestion = {
  id: number;
  surveyId: number;
  content: string;
  sortOrder: number;
  options: SurveyAnswerOption[];
};

export type SurveyDetail = {
  id: number;
  name: string;
  startDate: string;
  expireDate: string;
  createdDate: string;
  questions: SurveyQuestion[];
};

export type GetSurveyDetailPayload = {
  surveyId: number | string;
} & AppCallback<IResponseSurveyDetail>;

export type GetSurveyPayload = {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  name?: string;
} & AppCallback<ListApiResponse<Survey[]>>;

export type IResponseSurveyDetail = {
  id: number;
  name: string;
  startDate: string;
  expireDate: string;
  isPublished: boolean;
  createdDate: string;
  questions: IQuestion[];
  allowToViewResponse: boolean;
  allowToStartSurvey: boolean;
};

export type IQuestion = {
  id: number;
  title: string;
  type: string;
  sortOrder: number;
  answers: IAnswer[];
  selectedAnswerId?: number;
  selectedAnswerText?: string;
};

export type IAnswer = {
  id: number;
  title: string;
  sortOrder: number;
};

export type SubmitSurveyAnswer = {
  answerText: string;
  questionId: number;
};

export type SubmitSurveyBody = {
  answers: SubmitSurveyAnswer[];
};

export type SubmitSurveyPayload = {
  readonly surveyId: number | string;
} & AppCallback & SubmitSurveyBody;

