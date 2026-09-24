import type {
  IRequestAttendance,
  IResponseAttendance,
  IResponseAttendanceInfo,
} from '@type/attendance';
import type { SingleApiResponse } from '@type/common';

import { EndPoints } from '@constants';
import { httpRequest } from '@services/common/httpRequest';

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

export const attendanceInfo = async (): Promise<IResponseAttendanceInfo> => {
  const response = await httpRequest.get<
    SingleApiResponse<IResponseAttendanceInfo>
  >(EndPoints.ATTENDANCE.attendanceInfo);
  return response.data;
};
