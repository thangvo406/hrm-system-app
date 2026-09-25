import type { IResponseLeaveSummary } from '@type/home';
// import type { SingleApiResponse } from '@type/common';

// import { EndPoints } from '@constants';
// import { httpRequest } from '@services/common/httpRequest';

export const getLeaveSummary = async (): Promise<IResponseLeaveSummary> => {
  // const response = await httpRequest.get<SingleApiResponse<IResponseHomeInfo>>(
  //   EndPoints.HOME.homeInfo,
  //   { loading: false },
  // );
  // return response.data;

  return new Promise(resolve => {
    resolve({
      totalLeaveDays: 12,
      remainingLeaveDays: 12,
      pendingRequests: 0,
    });
  });
};
