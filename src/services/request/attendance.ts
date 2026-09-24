import type {
  IRequestAttendance,
  IRequestGetAttendanceHistories,
  IResponseAttendance,
  IResponseAttendanceInfo,
} from '@type/attendance';
import type { ListApiResponse, SingleApiResponse } from '@type/common';

import { EndPoints } from '@constants';
import { httpRequest } from '@services/common/httpRequest';
import { objectToQueryParams, removeEmptyFieldObject } from '@utils/common';

export const checkIn = async (
  request: IRequestAttendance,
): Promise<IResponseAttendance> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseAttendance>
  >(EndPoints.ATTENDANCE.checkIn, request);
  return response.data;
};

export const checkOut = async (
  request: IRequestAttendance,
): Promise<IResponseAttendance> => {
  const response = await httpRequest.post<
    SingleApiResponse<IResponseAttendance>
  >(EndPoints.ATTENDANCE.checkOut, request);
  return response.data;
};

export const getAttendanceHistories = async (
  request: IRequestGetAttendanceHistories,
): Promise<ListApiResponse<IResponseAttendanceInfo[]>> => {
  const params = objectToQueryParams(removeEmptyFieldObject(request, true));
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<IResponseAttendanceInfo[]>>
  >(EndPoints.ATTENDANCE.histories(`?${params}`), { loading: false });
  return response.data;
};

export const attendanceInfo = async (): Promise<IResponseAttendanceInfo> => {
  const response = await httpRequest.get<
    SingleApiResponse<IResponseAttendanceInfo>
  >(EndPoints.ATTENDANCE.attendanceInfo, { loading: false });
  return response.data;
};
