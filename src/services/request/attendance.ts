import type { IRequestAttendance, IResponseAttendance } from '@type/attendance';
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
