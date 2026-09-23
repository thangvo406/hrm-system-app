import type { RootScreenProps } from '@navigation/types';
import type { TRequestDetail, TRequestStatus } from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { REQUEST_STATUS_VIEWS } from '@screens/RequestDetail/requestStatusViews';
import { useCallback, useMemo } from 'react';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).
//
// Mỗi trạng thái một bản ghi riêng: luồng duyệt và nhật ký của đơn chờ duyệt
// khác hẳn đơn đã xử lý, không phải cùng một dữ liệu đổi mỗi cái nhãn.

const MOCK_DETAILS: Readonly<Record<TRequestStatus, TRequestDetail>> = {
  approved: {
    activities: [
      {
        at: '15/09/2026 14:30',
        id: 'act-3',
        note: 'Đơn được duyệt',
        title: 'Phòng Nhân sự đã phê duyệt',
      },
      {
        at: '15/09/2026 11:05',
        id: 'act-2',
        note: 'Đơn được duyệt',
        title: 'Quản lý trực tiếp đã phê duyệt',
      },
      {
        at: '15/09/2026 10:20',
        id: 'act-1',
        note: 'Đơn chờ phê duyệt',
        title: 'Nguyễn Văn A đã tạo đơn',
      },
    ],
    approvals: [
      {
        at: '15/09/2026 10:20',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'done',
      },
      {
        at: '15/09/2026 11:05',
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'done',
      },
      {
        at: '15/09/2026 14:30',
        id: 'step-hr',
        name: 'Lê Thị Mai',
        roleKey: 'request_detail.step_hr',
        status: 'done',
      },
    ],
    attachments: [
      { id: 'file-1', name: 'don-xin-nghi.pdf', sizeLabel: '800 KB' },
    ],
    code: 'LV20260915008',
    createdAt: '15/09/2026',
    createdBy: 'Nguyễn Văn A',
    dayCount: 3,
    duration: 'full_day',
    endDate: '22/09/2026',
    id: 'req-2026-09-20',
    reason: 'Nghỉ ngơi cùng gia đình.',
    remainingDays: 1.5,
    startDate: '20/09/2026',
    status: 'approved',
    type: 'leave',
  },
  pending: {
    activities: [
      {
        at: '10/09/2026 09:15',
        id: 'act-1',
        note: 'Đơn đang chờ phê duyệt',
        title: 'Nguyễn Văn A đã tạo đơn',
      },
    ],
    approvals: [
      {
        at: '10/09/2026 09:15',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'done',
      },
      {
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'current',
      },
      {
        id: 'step-hr',
        name: 'Phòng Nhân sự',
        roleKey: 'request_detail.step_hr',
        status: 'waiting',
      },
    ],
    attachments: [
      { id: 'file-1', name: 've-may-bay.pdf', sizeLabel: '1.2 MB' },
    ],
    code: 'LV20260916001',
    createdAt: '10/09/2026',
    createdBy: 'Nguyễn Văn A',
    dayCount: 2,
    duration: 'full_day',
    endDate: '09/10/2026',
    id: 'req-2026-10-08',
    reason: 'Về quê cùng gia đình, bàn giao công việc cho Dũng.',
    remainingDays: 4.5,
    startDate: '08/10/2026',
    status: 'pending',
    type: 'leave',
  },
  rejected: {
    activities: [
      {
        at: '03/09/2026 16:40',
        id: 'act-2',
        note: 'Lý do: trùng lịch trực của nhóm',
        title: 'Quản lý trực tiếp đã từ chối',
      },
      {
        at: '03/09/2026 08:05',
        id: 'act-1',
        note: 'Đơn chờ phê duyệt',
        title: 'Nguyễn Văn A đã tạo đơn',
      },
    ],
    approvals: [
      {
        at: '03/09/2026 08:05',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'done',
      },
      {
        at: '03/09/2026 16:40',
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'rejected',
      },
      {
        id: 'step-hr',
        name: 'Phòng Nhân sự',
        roleKey: 'request_detail.step_hr',
        status: 'waiting',
      },
    ],
    attachments: [],
    code: 'LA20260903004',
    createdAt: '03/09/2026',
    createdBy: 'Nguyễn Văn A',
    dayCount: 1,
    duration: 'morning',
    id: 'req-2026-09-03',
    reason: 'Kẹt xe do mưa lớn.',
    remainingDays: 6.5,
    startDate: '03/09/2026',
    status: 'rejected',
    type: 'late_arrival',
  },
};

// ──────────────────────────────────────────────────────────────────────────────

type Properties = RootScreenProps<Paths.RequestDetail>;

/**
 * Toàn bộ logic màn Chi tiết đơn từ. Trạng thái đơn quyết định nội dung banner,
 * luồng duyệt, nhật ký và việc có hiện nút huỷ hay không.
 */
export function useRequestDetail(props: Properties) {
  const { status = 'pending' } = AppNavigator.getParams(props);

  const detail = useMemo(
    () => MOCK_DETAILS[status as TRequestStatus],
    [status],
  );
  const statusView = REQUEST_STATUS_VIEWS[detail.status];

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Chưa có API: ba hành động dưới đây mới chỉ là chỗ nối sẵn.
  const onPressMore = useCallback(() => {}, []);
  const onDownload = useCallback(() => {}, []);
  const onCancel = useCallback(() => {}, []);

  return {
    detail,
    onCancel,
    onDownload,
    onGoBack,
    onPressMore,
    showCancel: statusView.showCancel,
  };
}
