import type {
  GetSurveyPayload,
  IResponseSurveyDetail,
  SubmitSurveyBody,
  Survey,
} from '@type/survey';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

type GetSurveyListRequest = Omit<GetSurveyPayload, 'onFailure' | 'onSuccess'>;

export const getSurveyList = async (
  request: GetSurveyListRequest,
): Promise<ListApiResponse<Survey[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<Survey[]>>
  >(EndPoints.SURVEY.list(params), { loading: false });
  return response.data;
};

export const getSurveyDetail = async (
  surveyId: number | string,
): Promise<IResponseSurveyDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<IResponseSurveyDetail>
  >(EndPoints.SURVEY.detail(surveyId), { loading: false });
  return response.data;
};

export const submitSurvey = async (
  surveyId: number | string,
  body: SubmitSurveyBody,
): Promise<void> => {
  await httpRequest.post(EndPoints.SURVEY.submitSurvey(surveyId), body);
};
