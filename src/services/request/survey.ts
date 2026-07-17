import type {
  IRequestGetSurveyDetail,
  IRequestGetSurveyList,
  IRequestSubmitSurvey,
  IResponseSurveyDetail,
  ISurvey,
} from '@type/survey';

import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const getSurveyList = async (
  request: IRequestGetSurveyList,
): Promise<ListApiResponse<ISurvey[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<ISurvey[]>>
  >(EndPoints.SURVEY.list(params), { loading: false });
  return response.data;
};

export const getSurveyDetail = async (
  request: IRequestGetSurveyDetail,
): Promise<IResponseSurveyDetail> => {
  const response = await httpRequest.get<
    SingleApiResponse<IResponseSurveyDetail>
  >(EndPoints.SURVEY.detail(request.surveyId), { loading: false });
  return response.data;
};

export const submitSurvey = async (
  request: IRequestSubmitSurvey,
): Promise<void> => {
  await httpRequest.patch(
    EndPoints.SURVEY.submitSurvey(request.surveyId),
    request.answers,
  );
};
