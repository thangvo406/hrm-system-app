import type {
  IRequestConfirmMemberShipVerify,
  IRequestLogin,
  IRequestSendOtpVerifyMembership,
  IRequestRegisterUser,
  IRequestSendOTP,
  IRequestSubmitForgotPass,
  IRequestVerifyOTP,
  IRequestLoginSocial,
  IRequestVerifyOtpForgotPass,
  IResponseRegisterVerifyOtp,
  IResponseRegisterSendOtp,
  IResponseUniversity,
  IRequestCreateLinkVerifyForgotPass,
  IResponseCreateLinkVerifyForgotPass,
  IResponseSubmitForgotPass,
  IResponseVerifyOtpForgotPass,
  IResponseLoginSocial,
  LogoutRequest,
  IResponseRefreshToken,
  IResponseRegisterUser,
  ISelectSchoolRequest,
  IResponseSendOtpVerifyMembership,
  IResponseConfirmMemberShipVerify,
  IResponseLogin,
  IRequestCreateLinkVerifyInfoUser,
  IResponseCreateLinkVerifyInfoUser,
} from '@type/auth';
import omit from 'lodash/omit';
import { httpRequest } from '@services/common/httpRequest';
import { EndPoints } from '@constants';
import { ListApiResponse, SingleApiResponse } from '@type/common';
import { CommonUtils } from '@utils';

export const login = async (
  payload: IRequestLogin,
): Promise<IResponseLogin> => {
  const response = await httpRequest.post<SingleApiResponse<IResponseLogin>>(
    EndPoints.AUTH.login,
    payload,
  );
  return response.data;
};

export const registerUser = async (
  request: IRequestRegisterUser,
): Promise<IResponseRegisterUser> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterUser>
  >(EndPoints.AUTH.register, request);
  return response.data;
};

export const sendOTP = async (
  request: IRequestSendOTP,
): Promise<IResponseRegisterSendOtp> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterSendOtp>
  >(EndPoints.AUTH.sendOTP, request);
  return response.data;
};

export const verifyOTP = async (
  request: IRequestVerifyOTP,
): Promise<IResponseRegisterVerifyOtp> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRegisterVerifyOtp>
  >(EndPoints.AUTH.verifyOTP, request);
  return response.data;
};

export const getUniversities = async (
  request: any,
): Promise<ListApiResponse<IResponseUniversity[]>> => {
  const _request = CommonUtils.removeEmptyFieldObject(request, true);
  const params = CommonUtils.objectToQueryParams(_request);
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IResponseUniversity[]>>
  >(EndPoints.AUTH.getUniversities(params), { loading: false });
  return response.data;
};

export const loginSocial = async (
  request: IRequestLoginSocial,
): Promise<IResponseLoginSocial> => {
  const _request = omit(request, ['provider']);
  const response = await httpRequest.post<
    SingleApiResponse<IResponseLoginSocial>
  >(EndPoints.AUTH.loginSocial(request.provider), _request);
  return response.data;
};

export const createLinkVerifyForgotPass = async (
  request: IRequestCreateLinkVerifyForgotPass,
): Promise<IResponseCreateLinkVerifyForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseCreateLinkVerifyForgotPass>
  >(EndPoints.AUTH.createLinkVerifyForgotPass, request);
  return response.data;
};

export const refreshToken = async (
  refreshTokenString: string,
): Promise<IResponseRefreshToken> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseRefreshToken>
  >(
    EndPoints.AUTH.refreshToken,
    {
      refreshToken: refreshTokenString,
    },
    {
      loading: false,
    },
  );
  return response.data;
};

export const verifyOtpForgotPass = async (
  request: IRequestVerifyOtpForgotPass,
): Promise<IResponseVerifyOtpForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseVerifyOtpForgotPass>
  >(EndPoints.AUTH.verifyOtpForgotPass, request);
  return response.data;
};

export const submitForgotPass = async (
  request: IRequestSubmitForgotPass,
): Promise<IResponseSubmitForgotPass> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseSubmitForgotPass>
  >(EndPoints.AUTH.submitForgotPass, request);
  return response.data;
};

export const logout = async (request: LogoutRequest): Promise<void> => {
  await httpRequest.post(EndPoints.AUTH.logout, request, { loading: false });
};

export const sendOtpVerifyMembership = async (
  request: IRequestSendOtpVerifyMembership,
): Promise<IResponseSendOtpVerifyMembership> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseSendOtpVerifyMembership>
  >(EndPoints.AUTH.sendOtpVerifyMembership, request);
  return response.data;
};

export const createLinkVerifyInfoUser = async (
  request: IRequestCreateLinkVerifyInfoUser,
): Promise<IResponseCreateLinkVerifyInfoUser> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseCreateLinkVerifyInfoUser>
  >(EndPoints.AUTH.createLinkVerifyInfoUser, request);
  return response.data;
};

export const confirmMemberShipVerify = async (
  request: IRequestConfirmMemberShipVerify,
): Promise<IResponseConfirmMemberShipVerify> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseConfirmMemberShipVerify>
  >(EndPoints.AUTH.confirmMemberShipVerify, request);
  return response.data;
};

export const selectSchool = async (
  request: ISelectSchoolRequest,
): Promise<IResponseLogin> => {
  const response = await httpRequest.put<SingleApiResponse<IResponseLogin>>(
    EndPoints.AUTH.selectSchool,
    request,
  );
  return response.data;
};
