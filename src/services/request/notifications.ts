import type {
  IRequestGetNotifications,
  TNotificationCounts,
  TNotificationItem,
} from '@type/notifications';
import type { ListApiResponse } from '@type/common';

import type { SingleApiResponse } from '@type/common';
import { EndPoints } from '@constants';
import { httpRequest } from '@services/common/httpRequest';
import { objectToQueryParams, removeEmptyFieldObject } from '@utils/common';

type TListPayload = Omit<IRequestGetNotifications, 'onFailure' | 'onSuccess'>;

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì bỏ khối này cùng
// `filterMock` và mở lại phần `httpRequest` đã comment bên dưới; hook không
// phải sửa gì vì nó chỉ nhìn thấy `ListApiResponse`.

// const MOCK_NOTIFICATIONS: readonly TNotificationItem[] = [
//   {
//     action: 'acknowledge',
//     at: '2 giờ trước',
//     body: 'Giờ vào ca linh hoạt 08:00–09:00, bắt buộc chấm công GPS/QR tại văn phòng.',
//     icon: 'ic_megaphone',
//     id: 'notif-policy',
//     isRead: false,
//     title: 'Quy định chấm công & giờ làm linh hoạt từ 01/10',
//     tone: 'red',
//   },
//   {
//     action: 'open',
//     at: 'Hôm qua, 16:40',
//     body: 'Thực nhận 17.857.000 đ · đã chuyển khoản',
//     icon: 'ic_credit_card',
//     id: 'notif-payslip',
//     isRead: false,
//     source: 'Phòng Nhân sự',
//     title: 'Phiếu lương kỳ 08/2026 đã phát hành',
//     tone: 'blue',
//   },
//   {
//     action: 'open',
//     at: 'Hôm qua, 09:12',
//     body: 'Trần Quốc Hưng đã duyệt · quỹ phép còn 6,5 ngày',
//     icon: 'ic_check_circle',
//     id: 'notif-leave',
//     isRead: false,
//     title: 'Đơn nghỉ phép 24–25/09 đã được duyệt',
//     tone: 'green',
//   },
//   {
//     action: 'open',
//     at: '3 ngày trước',
//     body: 'Hình ảnh và chia sẻ từ đội ngũ tại lễ khai trương ngày 12/09.',
//     icon: 'ic_image',
//     id: 'notif-news',
//     isRead: true,
//     source: 'Truyền thông nội bộ',
//     title: 'Specom khai trương văn phòng Đà Nẵng',
//     tone: 'neutral',
//   },
//   {
//     action: 'participate',
//     at: 'Còn 4 ngày · ẩn danh',
//     body: 'Còn 4 ngày · ẩn danh',
//     icon: 'ic_document',
//     id: 'notif-survey',
//     isRead: true,
//     title: 'Khảo sát hài lòng Q3/2026',
//     tone: 'purple',
//   },
// ];

// const filterMock = (filter?: string) =>
//   MOCK_NOTIFICATIONS.filter(item => {
//     switch (filter) {
//       case 'needs_action': {
//         return item.action === 'acknowledge' && !item.isRead;
//       }
//       case 'unread': {
//         return !item.isRead;
//       }
//       default: {
//         return true;
//       }
//     }
//   });

// ──────────────────────────────────────────────────────────────────────────────

// Hai hàm dưới chưa có `await` nên không khai `async`; nối API thật thì thêm
// `async` lại cùng lúc với việc mở phần `httpRequest`.

export const getNotifications = async (
  request: TListPayload,
): Promise<ListApiResponse<TNotificationItem[]>> => {
  const params = objectToQueryParams(removeEmptyFieldObject(request, true));
  const response = await httpRequest.get<
    SingleApiResponse<ListApiResponse<TNotificationItem[]>>
  >(EndPoints.NOTIFICATIONS.list(`?${params}`), { loading: false });
  return response.data;

  // const matched = filterMock(request.filter);
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

export const getNotificationCounts = (): Promise<TNotificationCounts> => {
  // Chưa có endpoint đếm riêng. Khi nối API thật, hoặc backend trả ba con số
  // này trong một lời gọi, hoặc gọi `EndPoints.NOTIFICATIONS.list` ba lần với
  // `size: 1` rồi đọc `totalElements` của từng nhóm.

  // return Promise.resolve({
  //   all: filterMock().length,
  //   needs_action: filterMock('needs_action').length,
  //   unread: filterMock('unread').length,
  // });
  return Promise.resolve({
    // all: matched.length,
    all: 0,
    needs_action: 0,
    unread: 0,
  });
};
