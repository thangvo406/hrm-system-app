import type { SelectionItem } from '@dialogs/Selection';
import type {
  TApprovalStep,
  TLeaveBalance,
  TLeaveBalanceKind,
  TLeaveDuration,
  TLeaveKind,
  TRequestDateRange,
} from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import DateRangeSheet from '@dialogs/DateRangeSheet';
import dayjs from 'dayjs';
import Selection from '@dialogs/Selection';
import { countLeaveDays } from '@utils/requests';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';

/** Nguồn phép mà từng loại đơn sẽ trừ vào. */
const KIND_SOURCES: Record<TLeaveKind, TLeaveBalanceKind> = {
  annual: 'annual',
  compensatory: 'annual',
  performance: 'performance',
  unpaid: 'unpaid',
  wedding: 'annual',
};

const KIND_LABEL_KEYS: Record<TLeaveKind, string> = {
  annual: 'create_request.kind_annual',
  compensatory: 'create_request.kind_compensatory',
  performance: 'create_request.kind_performance',
  unpaid: 'create_request.kind_unpaid',
  wedding: 'create_request.kind_wedding',
};

const SOURCE_LABEL_KEYS: Record<TLeaveBalanceKind, string> = {
  annual: 'create_request.balance_annual',
  performance: 'create_request.balance_performance',
  unpaid: 'create_request.balance_unpaid',
};

const KIND_ORDER: readonly TLeaveKind[] = [
  'annual',
  'performance',
  'compensatory',
  'wedding',
  'unpaid',
];

// ─── Mock data ────────────────────────────────────────────────────────────────
// Dữ liệu dựng UI, chưa nối API. Khi có endpoint thật thì thay khối này bằng
// saga callback (xem flow ở .cursorrules §5).

const MOCK_BALANCES: readonly TLeaveBalance[] = [
  { days: 6.5, kind: 'annual' },
  { days: 3, kind: 'performance' },
  { kind: 'unpaid' },
];

const MOCK_APPROVERS: readonly TApprovalStep[] = [
  {
    id: 'manager',
    initials: 'QH',
    name: 'Trần Quốc Hưng',
    roleKey: 'create_request.approver_manager',
  },
  {
    id: 'hr',
    initials: 'HR',
    name: 'Phòng Nhân sự',
    roleKey: 'create_request.approver_hr',
  },
];

const MOCK_START_DATE = '2026-10-08';
const MOCK_END_DATE = '2026-10-09';
const MOCK_REASON = 'Về quê cùng gia đình, bàn giao công việc cho Dũng.';

// ──────────────────────────────────────────────────────────────────────────────

/**
 * Toàn bộ logic màn Tạo đơn nghỉ phép: nội dung đơn đang soạn, số ngày quy đổi
 * và số dư còn lại sau khi trừ.
 */
export function useCreateRequest() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<TLeaveKind>('annual');
  const [startDate, setStartDate] = useState(MOCK_START_DATE);
  const [endDate, setEndDate] = useState(MOCK_END_DATE);
  const [duration, setDuration] = useState<TLeaveDuration>('full_day');
  const [reason, setReason] = useState(MOCK_REASON);

  const source = KIND_SOURCES[kind];

  const totalDays = useMemo(
    () => countLeaveDays(startDate, endDate, duration),
    [duration, endDate, startDate],
  );

  const remainingDays = useMemo(() => {
    const balance = MOCK_BALANCES.find(item => item.kind === source);
    // Nghỉ không lương không có hạn mức nên không có gì để trừ.
    return balance?.days === undefined ? 0 : balance.days - totalDays;
  }, [source, totalDays]);

  const onPickKind = useCallback(() => {
    const items: readonly SelectionItem[] = KIND_ORDER.map(option => ({
      id: option,
      label: t(KIND_LABEL_KEYS[option]),
    }));

    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      items,
      // Truyền nguyên item chứ không phải id: bấm "Xác nhận" mà không chọn lại
      // thì `Selection` trả về đúng giá trị khởi tạo này.
      itemSelected: items.find(item => item.id === kind),
      onSelect: (item: SelectionItem) => {
        setKind(item.id as TLeaveKind);
      },
      pathDisplay: 'label',
      pathSelected: 'id',
      showSearchBar: false,
      title: t('create_request.kind_label'),
    });
  }, [kind, t]);

  /**
   * Một lịch duy nhất cho cả hai ô ngày: bấm ô nào cũng mở đúng sheet này, và
   * "Xác nhận" ghi lại cả ngày bắt đầu lẫn ngày kết thúc.
   *
   * Chọn theo khoảng thì không còn dựng được trạng thái ngày kết thúc nằm
   * trước ngày bắt đầu, nên cũng không cần đoạn kéo ngày cho khớp như trước.
   */
  const onPickDates = useCallback(() => {
    AppNavigator.showDialog({
      screen: DateRangeSheet,
      popupType: 'bottomSheet',
      onConfirm: (range: TRequestDateRange) => {
        setStartDate(range.from);
        setEndDate(range.to);
      },
      title: t('create_request.date_range_label'),
      value: { from: startDate, to: endDate },
    });
  }, [endDate, startDate, t]);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Chưa có API tạo đơn: ba hành động dưới đây mới chỉ là chỗ nối sẵn.
  const onSaveDraft = useCallback(() => {}, []);
  const onPickAttachment = useCallback(() => {}, []);
  const onSubmit = useCallback(() => {}, []);

  return {
    approvers: MOCK_APPROVERS,
    balances: MOCK_BALANCES,
    canSubmit: reason.trim().length > 0 && totalDays > 0,
    duration,
    endDateLabel: dayjs(endDate).format(DISPLAY_DATE_FORMAT),
    kindLabel: t(KIND_LABEL_KEYS[kind]),
    onGoBack,
    onPickAttachment,
    onPickKind,
    onPickDates,
    onSaveDraft,
    onSubmit,
    reason,
    remainingDays,
    setDuration,
    setReason,
    source,
    sourceLabelKey: SOURCE_LABEL_KEYS[source],
    startDateLabel: dayjs(startDate).format(DISPLAY_DATE_FORMAT),
    totalDays,
  };
}
