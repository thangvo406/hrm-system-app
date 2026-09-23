import type { TWorkspaceInfoCard } from '@type/profile';

import AppNavigator from '@navigation/AppNavigator';
import { useCallback } from 'react';

/** Hợp đồng không xác định thời hạn thì không có ngày kết thúc. */
const NO_END_DATE = '—';

const MOCK_CARDS: readonly TWorkspaceInfoCard[] = [
  {
    fields: [
      {
        icon: 'ic_sitemap',
        id: 'department',
        labelKey: 'workspace_information.field_department',
        value: 'Phòng Công nghệ thông tin',
      },
      {
        icon: 'ic_briefcase',
        id: 'position',
        labelKey: 'workspace_information.field_position',
        value: 'Mobile Developer',
      },
      {
        icon: 'ic_badge',
        id: 'employee_code',
        labelKey: 'workspace_information.field_employee_code',
        value: 'EMP00123',
      },
      {
        icon: 'ic_calendar',
        id: 'joined_at',
        labelKey: 'workspace_information.field_joined_at',
        value: '10/09/2024',
      },
      {
        icon: 'user',
        id: 'employee_type',
        labelKey: 'workspace_information.field_employee_type',
        value: 'Nhân viên chính thức',
      },
      {
        icon: 'user',
        id: 'manager',
        labelKey: 'workspace_information.field_manager',
        value: 'Trần Quốc Hưng',
      },
    ],
    icon: 'ic_building',
    id: 'workspace',
  },
  {
    fields: [
      {
        icon: 'ic_document',
        id: 'contract_type',
        labelKey: 'workspace_information.field_contract_type',
        value: 'Hợp đồng lao động không xác định thời hạn',
      },
      {
        icon: 'ic_calendar',
        id: 'contract_start',
        labelKey: 'workspace_information.field_contract_start',
        value: '10/09/2024',
      },
      {
        icon: 'ic_calendar',
        id: 'contract_end',
        labelKey: 'workspace_information.field_contract_end',
        value: NO_END_DATE,
      },
      {
        icon: 'ic_document',
        id: 'contract_code',
        labelKey: 'workspace_information.field_contract_code',
        value: 'HDLD-2024-0123',
      },
      {
        badge: 'success',
        icon: 'ic_check_circle',
        id: 'contract_status',
        labelKey: 'workspace_information.field_contract_status',
        value: 'Đang hiệu lực',
      },
    ],
    icon: 'ic_document',
    id: 'contract',
    titleKey: 'workspace_information.contract_title',
  },
];

// ──────────────────────────────────────────────────────────────────────────────

/** Toàn bộ logic màn Thông tin công việc. */
export function useWorkspaceInformation() {
  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  return {
    cards: MOCK_CARDS,
    onGoBack,
  };
}
