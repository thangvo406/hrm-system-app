import { AppCallback, ListApiResponse } from './common';

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

export interface GetSurveyDetailPayload extends AppCallback {
  surveyId: number | string;
}
export interface GetSurveyPayload extends AppCallback {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  name?: string;
}

export type SurveyListCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (response: ListApiResponse<Survey[]>) => void;
};

export type GetSurveyListPayload = Omit<
  GetSurveyPayload,
  'onFailure' | 'onSuccess'
> &
  SurveyListCallback;

export type SurveyDetailCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: (detail: IResponseSurveyDetail) => void;
};

export type GetSurveyDetailActionPayload = Omit<
  GetSurveyDetailPayload,
  'onFailure' | 'onSuccess'
> &
  SurveyDetailCallback;

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

export type SubmitSurveyAnswer = {
  answerText: string;
  questionId: number;
};

export interface SubmitSurveyBody {
  answers: SubmitSurveyAnswer[];
}

export type SubmitSurveyCallback = {
  readonly onFailure?: (error: string) => void;
  readonly onSuccess?: () => void;
};

export type SubmitSurveyPayload = {
  readonly surveyId: number | string;
} & SubmitSurveyBody &
  SubmitSurveyCallback;
