import type { RootScreenProps } from '@navigation/types';
import type { TRequestDetail, TRequestType } from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { REQUEST_STATUS_VIEWS } from '@screens/RequestDetail/requestStatusViews';
import { useCallback, useMemo } from 'react';

const DEFAULT_TYPE: TRequestType = 'leave';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).
//
// Khoá theo LOẠI ĐƠN chứ không phải theo trạng thái: mỗi loại có bộ trường
// "Thông tin chung" riêng — OT hỏi giờ làm thêm và loại OT, giải trình hỏi
// loại sự kiện, nghỉ phép hỏi số ngày còn lại.

const MOCK_DETAILS: Readonly<Record<TRequestType, TRequestDetail>> = {
  attendance_explanation: {
    activities: [
      {
        at: '15/09/2026 08:40',
        id: 'act-1',
        note: 'Nguyễn Văn A',
        title: 'Tạo đơn',
      },
    ],
    approvals: [
      {
        at: '15/09/2026 08:40',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'created',
      },
      {
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'current',
      },
      {
        id: 'step-hr',
        name: 'Lê Thị Mai',
        roleKey: 'request_detail.step_hr',
        status: 'waiting',
      },
    ],
    attachments: [
      { id: 'file-1', kind: 'image', name: 'photo-1.jpg', sizeLabel: '1.8 MB' },
      {
        id: 'file-2',
        kind: 'pdf',
        name: 'xac-minh-giao-thong.pdf',
        sizeLabel: '1.2 MB',
      },
    ],
    code: 'EX20250915001',
    createdAt: '15/09/2026, 08:40',
    createdBy: 'Nguyễn Văn A',
    fields: [
      {
        icon: 'ic_calendar',
        id: 'date',
        labelKey: 'request_detail.field_explanation_date',
        value: 'Thứ Hai, 15/09/2026',
      },
      {
        icon: 'ic_clock',
        id: 'time',
        labelKey: 'request_detail.field_time',
        value: '08:00 – 10:30',
      },
      {
        icon: 'ic_warning',
        id: 'event',
        labelKey: 'request_detail.field_event_type',
        value: 'Đi muộn',
      },
      {
        icon: 'ic_document',
        id: 'reason',
        labelKey: 'request_detail.field_reason',
        value:
          'Do kẹt xe và mưa lớn trên đường đi làm nên tôi đến muộn. Tôi đã chủ động báo với quản lý qua Slack lúc 07:45.',
      },
      {
        icon: 'ic_document',
        id: 'note',
        labelKey: 'request_detail.field_note',
        value:
          'Xin phép được giải trình và cam kết sẽ chủ động sắp xếp thời gian tốt hơn.',
      },
    ],
    id: 'req-explanation',
    status: 'pending',
    type: 'attendance_explanation',
  },
  early_leave: {
    activities: [
      {
        at: '09/09/2026 15:10',
        id: 'act-2',
        note: 'Trần Quốc Hưng',
        title: 'Quản lý trực tiếp phê duyệt đơn',
      },
      {
        at: '09/09/2026 09:05',
        id: 'act-1',
        note: 'Nguyễn Văn A',
        title: 'Tạo đơn',
      },
    ],
    approvals: [
      {
        at: '09/09/2026 09:05',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'created',
      },
      {
        at: '09/09/2026 15:10',
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'done',
      },
    ],
    attachments: [],
    code: 'EL20250909002',
    createdAt: '09/09/2026, 09:05',
    createdBy: 'Nguyễn Văn A',
    fields: [
      {
        icon: 'ic_calendar',
        id: 'date',
        labelKey: 'request_detail.field_early_leave_date',
        value: 'Thứ Tư, 09/09/2026',
      },
      {
        icon: 'ic_clock',
        id: 'time',
        labelKey: 'request_detail.field_time',
        value: '16:00 – 18:00 (2 giờ)',
      },
      {
        icon: 'ic_document',
        id: 'reason',
        labelKey: 'request_detail.field_reason',
        value: 'Đưa con đi khám theo lịch hẹn của bệnh viện.',
      },
    ],
    id: 'req-early-leave',
    status: 'approved',
    type: 'early_leave',
  },
  late_arrival: {
    activities: [
      {
        at: '03/09/2026 16:40',
        id: 'act-2',
        note: 'Lý do: trùng lịch trực của nhóm',
        title: 'Quản lý trực tiếp từ chối đơn',
      },
      {
        at: '03/09/2026 08:05',
        id: 'act-1',
        note: 'Nguyễn Văn A',
        title: 'Tạo đơn',
      },
    ],
    approvals: [
      {
        at: '03/09/2026 08:05',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'created',
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
        name: 'Lê Thị Mai',
        roleKey: 'request_detail.step_hr',
        status: 'waiting',
      },
    ],
    attachments: [],
    code: 'LA20250903004',
    createdAt: '03/09/2026, 08:05',
    createdBy: 'Nguyễn Văn A',
    fields: [
      {
        icon: 'ic_calendar',
        id: 'date',
        labelKey: 'request_detail.field_late_arrival_date',
        value: 'Thứ Năm, 03/09/2026',
      },
      {
        icon: 'ic_clock',
        id: 'time',
        labelKey: 'request_detail.field_time',
        value: '08:00 – 09:30 (1,5 giờ)',
      },
      {
        icon: 'ic_document',
        id: 'reason',
        labelKey: 'request_detail.field_reason',
        value: 'Kẹt xe do mưa lớn trên đường đi làm.',
      },
    ],
    id: 'req-late-arrival',
    status: 'rejected',
    type: 'late_arrival',
  },
  leave: {
    activities: [
      {
        at: '10/09/2026 09:15',
        id: 'act-1',
        note: 'Nguyễn Văn A',
        title: 'Tạo đơn',
      },
    ],
    approvals: [
      {
        at: '10/09/2026 09:15',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'created',
      },
      {
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'current',
      },
      {
        id: 'step-hr',
        name: 'Lê Thị Mai',
        roleKey: 'request_detail.step_hr',
        status: 'waiting',
      },
    ],
    attachments: [
      {
        id: 'file-1',
        kind: 'pdf',
        name: 've-may-bay.pdf',
        sizeLabel: '1.2 MB',
      },
    ],
    code: 'LV20250916001',
    createdAt: '10/09/2026, 09:15',
    createdBy: 'Nguyễn Văn A',
    fields: [
      {
        icon: 'ic_calendar',
        id: 'period',
        labelKey: 'request_detail.field_period',
        value: '08/10/2026 – 09/10/2026',
      },
      {
        icon: 'ic_clock',
        id: 'days',
        labelKey: 'request_detail.field_days',
        value: '2,0 ngày',
      },
      {
        icon: 'ic_stack',
        id: 'remaining',
        labelKey: 'request_detail.field_remaining',
        value: '4,5 ngày (sau khi trừ)',
      },
      {
        icon: 'ic_sun',
        id: 'duration',
        labelKey: 'request_detail.field_duration',
        value: 'Cả ngày',
      },
      {
        icon: 'ic_document',
        id: 'reason',
        labelKey: 'request_detail.field_reason',
        value: 'Về quê cùng gia đình, bàn giao công việc cho Dũng.',
      },
    ],
    id: 'req-leave',
    status: 'pending',
    type: 'leave',
  },
  overtime: {
    activities: [
      {
        at: '16/09/2026 14:05',
        id: 'act-3',
        note: 'Lê Thị Mai',
        title: 'Phòng Nhân sự phê duyệt đơn',
      },
      {
        at: '16/09/2026 11:20',
        id: 'act-2',
        note: 'Trần Quốc Hưng',
        title: 'Quản lý trực tiếp phê duyệt đơn',
      },
      {
        at: '16/09/2026 09:15',
        id: 'act-1',
        note: 'Nguyễn Văn A',
        title: 'Tạo đơn',
      },
    ],
    approvals: [
      {
        at: '16/09/2026 09:15',
        id: 'step-created',
        name: 'Nguyễn Văn A',
        roleKey: 'request_detail.step_created',
        status: 'created',
      },
      {
        at: '16/09/2026 11:20',
        id: 'step-manager',
        name: 'Trần Quốc Hưng',
        roleKey: 'request_detail.step_manager',
        status: 'done',
      },
      {
        at: '16/09/2026 14:05',
        id: 'step-hr',
        name: 'Lê Thị Mai',
        roleKey: 'request_detail.step_hr',
        status: 'done',
      },
    ],
    attachments: [
      {
        id: 'file-1',
        kind: 'pdf',
        name: 'ke-hoach-release.pdf',
        sizeLabel: '2.4 MB',
      },
    ],
    code: 'OT20250916001',
    createdAt: '16/09/2026, 09:15',
    createdBy: 'Nguyễn Văn A',
    fields: [
      {
        icon: 'ic_calendar',
        id: 'date',
        labelKey: 'request_detail.field_overtime_date',
        value: 'Thứ Ba, 16/09/2026',
      },
      {
        icon: 'ic_clock',
        id: 'time',
        labelKey: 'request_detail.field_time',
        value: '18:00 – 21:00 (3 giờ)',
      },
      {
        icon: 'ic_document',
        id: 'reason',
        labelKey: 'request_detail.field_reason',
        value: 'Hỗ trợ triển khai tính năng phiên bản 1.2.0',
      },
      {
        icon: 'ic_location',
        id: 'place',
        labelKey: 'request_detail.field_place',
        value: 'Văn phòng',
      },
      {
        icon: 'ic_document',
        id: 'note',
        labelKey: 'request_detail.field_note',
        value: 'Hoàn thiện bug và release lên staging.',
      },
    ],
    id: 'req-overtime',
    status: 'approved',
    type: 'overtime',
  },
};

// ──────────────────────────────────────────────────────────────────────────────

type Properties = RootScreenProps<Paths.RequestDetail>;

/**
 * Toàn bộ logic màn Chi tiết đơn từ.
 *
 * LOẠI ĐƠN lấy từ params điều hướng và quyết định lấy bản ghi nào; trạng thái
 * nằm sẵn trong bản ghi đó mới quyết định banner, luồng duyệt và nút huỷ.
 */
export function useRequestDetail(props: Properties) {
  const { type = DEFAULT_TYPE } = AppNavigator.getParams(props);

  const detail = useMemo(
    () => MOCK_DETAILS[type as TRequestType] ?? MOCK_DETAILS[DEFAULT_TYPE],
    [type],
  );
  const statusView = REQUEST_STATUS_VIEWS[detail.status];

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Chưa có API: hai hành động dưới đây mới chỉ là chỗ nối sẵn.
  const onDownload = useCallback(() => {}, []);
  const onCancel = useCallback(() => {}, []);

  return {
    detail,
    onCancel,
    onDownload,
    onGoBack,
    showCancel: statusView.showCancel,
  };
}
