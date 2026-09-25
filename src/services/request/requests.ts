import type {
  IRequestGetRequestCounts,
  IRequestGetRequests,
  TRequestCounts,
  TRequestItem,
} from '@type/requests';
import type { ListApiResponse } from '@type/common';

import type { SingleApiResponse } from '@type/common';
import { EndPoints } from '@constants';
import { httpRequest } from '@services/common/httpRequest';
import { objectToQueryParams, removeEmptyFieldObject } from '@utils/common';

type TListPayload = Omit<IRequestGetRequests, 'onFailure' | 'onSuccess'>;
type TCountsPayload = Omit<IRequestGetRequestCounts, 'onFailure' | 'onSuccess'>;

/** Các trường mà `filterMock` quan tâm, chung cho cả hai lời gọi. */
// type TMockFilter = {
//   readonly fromDate?: string;
//   readonly status?: string;
//   readonly toDate?: string;
//   readonly type?: string;
// };

// const MOCK_REQUESTS: readonly TRequestItem[] = [
//   {
//     createdAt: '2026-09-18',
//     dayCount: 2,
//     endDate: '2026-09-23',
//     id: 'req-2026-09-22',
//     reason: 'Giải quyết việc gia đình',
//     startDate: '2026-09-22',
//     status: 'pending',
//     type: 'leave',
//   },
//   {
//     createdAt: '2026-09-10',
//     dayCount: 3,
//     endDate: '2026-09-18',
//     id: 'req-2026-09-16',
//     reason: 'Nghỉ du lịch cùng gia đình',
//     startDate: '2026-09-16',
//     status: 'pending',
//     type: 'leave',
//   },
//   {
//     createdAt: '2026-09-15',
//     id: 'req-2026-09-19',
//     reason: 'Chạy kịp bản phát hành cuối quý',
//     startDate: '2026-09-19',
//     status: 'pending',
//     type: 'overtime',
//   },
//   {
//     createdAt: '2026-09-14',
//     id: 'req-2026-09-13',
//     reason: 'Quên quẹt thẻ lúc ra về',
//     startDate: '2026-09-13',
//     status: 'approved',
//     type: 'attendance_explanation',
//   },
//   {
//     createdAt: '2026-09-12',
//     id: 'req-2026-09-12',
//     reason: 'Xe hỏng giữa đường',
//     startDate: '2026-09-12',
//     status: 'approved',
//     type: 'late_arrival',
//   },
//   {
//     createdAt: '2026-09-09',
//     id: 'req-2026-09-09',
//     reason: 'Đưa con đi khám',
//     startDate: '2026-09-09',
//     status: 'approved',
//     type: 'early_leave',
//   },
//   {
//     createdAt: '2026-09-03',
//     id: 'req-2026-09-03',
//     reason: 'Kẹt xe do mưa lớn',
//     startDate: '2026-09-03',
//     status: 'rejected',
//     type: 'late_arrival',
//   },
//   {
//     createdAt: '2026-08-27',
//     id: 'req-2026-08-28',
//     reason: 'Có việc gia đình',
//     startDate: '2026-08-28',
//     status: 'approved',
//     type: 'early_leave',
//   },
//   {
//     createdAt: '2026-08-15',
//     dayCount: 3,
//     endDate: '2026-08-22',
//     id: 'req-2026-08-20',
//     reason: 'Về quê',
//     startDate: '2026-08-20',
//     status: 'approved',
//     type: 'leave',
//   },
//   {
//     createdAt: '2026-08-12',
//     id: 'req-2026-08-12',
//     reason: 'Đi khám sức khoẻ định kỳ',
//     startDate: '2026-08-12',
//     status: 'approved',
//     type: 'late_arrival',
//   },
//   {
//     createdAt: '2026-08-04',
//     id: 'req-2026-08-05',
//     reason: 'Đón người nhà ở sân bay',
//     startDate: '2026-08-05',
//     status: 'rejected',
//     type: 'early_leave',
//   },
//   {
//     createdAt: '2026-07-30',
//     dayCount: 1,
//     id: 'req-2026-08-03',
//     reason: 'Nghỉ phép năm',
//     startDate: '2026-08-03',
//     status: 'approved',
//     type: 'leave',
//   },
//   {
//     createdAt: '2026-07-21',
//     id: 'req-2026-07-21',
//     reason: 'Tàu điện hỏng giờ cao điểm',
//     startDate: '2026-07-21',
//     status: 'approved',
//     type: 'late_arrival',
//   },
//   {
//     createdAt: '2026-07-08',
//     dayCount: 2,
//     endDate: '2026-07-14',
//     id: 'req-2026-07-13',
//     reason: 'Giỗ gia đình',
//     startDate: '2026-07-13',
//     status: 'pending',
//     type: 'leave',
//   },
// ];

// const filterMock = (payload: TMockFilter) =>
//   MOCK_REQUESTS.filter(item => {
//     if (payload.type && item.type !== payload.type) {
//       return false;
//     }
//     if (payload.fromDate && item.startDate < payload.fromDate) {
//       return false;
//     }
//     if (payload.toDate && item.startDate > payload.toDate) {
//       return false;
//     }
//     if (!payload.status) {
//       return true;
//     }
//     return payload.status === 'processed'
//       ? item.status !== 'pending'
//       : item.status === payload.status;
//   });

// const sortMock = (items: readonly TRequestItem[]) =>
//   // eslint-disable-next-line unicorn/no-array-sort
//   [...items].sort((left, right) => {
//     const byStartDate = right.startDate.localeCompare(left.startDate);
//     return byStartDate === 0
//       ? right.createdAt.localeCompare(left.createdAt)
//       : byStartDate;
//   });

export const getRequests = async (
  request: TListPayload,
): Promise<ListApiResponse<TRequestItem[]>> => {
  const params = objectToQueryParams(removeEmptyFieldObject(request, true));
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<TRequestItem[]>>
  >(EndPoints.REQUESTS.list(`?${params}`), { loading: false });
  return response.data;

  // const matched = sortMock(filterMock(request));
  // const { page, size } = request;
  // const offset = page * size;

  // return Promise.resolve({
  //   content: matched.slice(offset, offset + size),
  //   last: offset + size >= matched.length,
  //   page,
  //   size,
  //   totalElements: matched.length,
  //   totalPages: Math.ceil(matched.length / size),
  // });
};

export const getRequestCounts = (
  request: TCountsPayload,
): Promise<TRequestCounts> => {
  // Chưa có endpoint đếm riêng. Khi nối API thật, hoặc backend trả ba con số
  // này trong một lời gọi, hoặc gọi `EndPoints.REQUESTS.list` ba lần với
  // `size: 1` rồi đọc `totalElements` của từng trạng thái.

  // const matched = filterMock(request);
  // const pending = matched.filter(item => item.status === 'pending').length;

  return Promise.resolve({
    // all: matched.length,
    all: 0,
    pending: 0,
    processed: 0,
  });
};
