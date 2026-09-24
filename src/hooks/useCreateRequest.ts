import type { TSelectionItem } from '@type/dialog';
import type {
  TApprovalStep,
  TAttendanceEventKind,
  TCreateRequestSection,
  TLeaveBalance,
  TLeaveDuration,
  TLeaveKind,
  TOvertimeKind,
  TRequestDateRange,
  TRequestType,
  TWorkPlace,
} from '@type/requests';

import AppNavigator from '@navigation/AppNavigator';
import DateRangeSheet from '@dialogs/DateRangeSheet';
import dayjs from 'dayjs';
import Selection from '@dialogs/Selection';
import { getCurrentTime } from '@utils/date';
import { REQUEST_TYPE_STYLES } from '@screens/Requests/requestTypes';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BALANCE_LABEL_KEYS,
  countHours,
  countLeaveDays,
  CREATE_REQUEST_REASON_LABEL_KEYS,
  CREATE_REQUEST_REASON_PLACEHOLDER_KEYS,
  CREATE_REQUEST_SECTIONS,
  CREATE_REQUEST_TITLE_KEYS,
  CREATE_REQUEST_TYPE_ORDER,
  EVENT_KIND_LABEL_KEYS,
  EVENT_KIND_ORDER,
  findMissingSections,
  LEAVE_KIND_LABEL_KEYS,
  LEAVE_KIND_ORDER,
  LEAVE_KIND_SOURCES,
  OVERTIME_KIND_LABEL_KEYS,
  OVERTIME_KIND_ORDER,
  SINGLE_DATE_LABEL_KEYS,
  WORK_PLACE_LABEL_KEYS,
  WORK_PLACE_ORDER,
} from '@utils/requests';

const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Số dư phép và luồng phê duyệt là dữ liệu của server, mà chưa có endpoint tạo
 * đơn nên chưa lấy được. Để rỗng chứ KHÔNG dựng số giả: số dư phép giả dẫn tới
 * câu tổng kết "còn lại N ngày" sai, mà đó đúng là thứ người dùng đọc để quyết
 * định có gửi đơn hay không.
 *
 * Khi có endpoint: thay hai hằng này bằng state nạp qua saga callback (xem flow
 * ở .cursorrules §5), phần còn lại của hook không phải đổi — `sections` đã tự
 * ẩn các khối chưa có dữ liệu.
 */
const BALANCES: readonly TLeaveBalance[] = [];
const APPROVERS: readonly TApprovalStep[] = [];

// Giờ mặc định của ô thời gian: một ca OT buổi tối điển hình. Người dùng nào
// cũng sẽ đổi, nhưng mở sẵn ở đây thì cuộn ngắn hơn là mở từ 00:00.
const DEFAULT_START_TIME = '18:00';
const DEFAULT_END_TIME = '21:00';

/** Khối chỉ dựng được khi đã có số dư phép từ server. */
const BALANCE_DEPENDENT_SECTIONS: readonly TCreateRequestSection[] = [
  'balances',
  'summary',
];

/**
 * Toàn bộ logic màn Tạo đơn.
 *
 * LOẠI ĐƠN là trạng thái gốc: nó quyết định form hỏi những gì
 * (`CREATE_REQUEST_SECTIONS`), điều kiện gửi được, và câu tổng kết. Đổi loại
 * không xoá những gì đã nhập — mọi trường của mọi loại cùng sống trong hook
 * này, nên bấm nhầm loại rồi quay lại thì lý do vừa gõ vẫn còn.
 */
export function useCreateRequest() {
  const { t } = useTranslation();

  // Form mở ra ở NGÀY HÔM NAY, không phải một ngày dựng sẵn. Lấy giờ đã đồng
  // bộ với server (`getCurrentTime`) chứ không phải giờ máy, giống các màn khác.
  const today = useMemo(() => getCurrentTime().format(ISO_DATE_FORMAT), []);

  const [type, setType] = useState<TRequestType>('leave');
  const [leaveKind, setLeaveKind] = useState<TLeaveKind>('annual');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [duration, setDuration] = useState<TLeaveDuration>('full_day');
  const [overtimeKind, setOvertimeKind] = useState<TOvertimeKind>('weekday');
  const [place, setPlace] = useState<TWorkPlace>('office');
  const [eventKind, setEventKind] =
    useState<TAttendanceEventKind>('late_arrival');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  /**
   * Khối form của loại đơn đang chọn, đã trừ đi những khối chưa có dữ liệu.
   *
   * Lọc ở đây chứ không ở JSX: màn hình chỉ cần biết "khối này có bật không",
   * còn lý do tắt (loại đơn không cần, hay server chưa trả số dư) là việc của
   * hook. Khi nối API xong thì chỉ bỏ điều kiện này, JSX không phải sửa.
   */
  const sections = useMemo(() => {
    const enabled = new Set<TCreateRequestSection>(
      CREATE_REQUEST_SECTIONS[type],
    );
    if (BALANCES.length === 0) {
      for (const section of BALANCE_DEPENDENT_SECTIONS) {
        enabled.delete(section);
      }
    }
    return enabled;
  }, [type]);

  const source = LEAVE_KIND_SOURCES[leaveKind];

  const totalDays = useMemo(
    () => countLeaveDays(startDate, endDate, duration),
    [duration, endDate, startDate],
  );

  const totalHours = useMemo(
    () => countHours(startTime, endTime),
    [endTime, startTime],
  );

  const remainingDays = useMemo(() => {
    const balance = BALANCES.find(item => item.kind === source);
    // Nghỉ không lương không có hạn mức nên không có gì để trừ.
    return balance?.days === undefined ? 0 : balance.days - totalDays;
  }, [source, totalDays]);

  /**
   * Mở một bottom sheet chọn-một-giá-trị. Gói lại vì form này có tới năm ô
   * cùng kiểu (loại đơn, loại nghỉ, loại OT, địa điểm, loại sự kiện) — viết
   * tay từng cái thì năm lần lặp lại đúng một khối tham số.
   */
  const openPicker = useCallback(
    <T extends string>(
      options: readonly T[],
      labelKeys: Readonly<Record<T, string>>,
      selected: T,
      onSelect: (option: T) => void,
      title: string,
      icons?: Readonly<Partial<Record<T, TSelectionItem['icon']>>>,
    ) => {
      const items: readonly TSelectionItem[] = options.map(option => ({
        icon: icons?.[option],
        id: option,
        label: t(labelKeys[option]),
      }));

      AppNavigator.showDialog({
        screen: Selection,
        popupType: 'bottomSheet',
        items,
        // Truyền nguyên item chứ không phải id: bấm "Xác nhận" mà không chọn
        // lại thì `Selection` trả về đúng giá trị khởi tạo này.
        itemSelected: items.find(item => item.id === selected),
        onSelect: (item: TSelectionItem) => {
          const picked = options.find(option => option === item.id);
          if (picked) {
            onSelect(picked);
          }
        },
        pathDisplay: 'label',
        pathSelected: 'id',
        showSearchBar: false,
        title,
      });
    },
    [t],
  );

  const onPickType = useCallback(() => {
    const labelKeys = Object.fromEntries(
      CREATE_REQUEST_TYPE_ORDER.map(option => [
        option,
        REQUEST_TYPE_STYLES[option].labelKey,
      ]),
    ) as Record<TRequestType, string>;
    const icons = Object.fromEntries(
      CREATE_REQUEST_TYPE_ORDER.map(option => [
        option,
        REQUEST_TYPE_STYLES[option].icon,
      ]),
    ) as Record<TRequestType, TSelectionItem['icon']>;

    openPicker(
      CREATE_REQUEST_TYPE_ORDER,
      labelKeys,
      type,
      setType,
      t('create_request.type_label'),
      icons,
    );
  }, [openPicker, t, type]);

  const onPickLeaveKind = useCallback(() => {
    openPicker(
      LEAVE_KIND_ORDER,
      LEAVE_KIND_LABEL_KEYS,
      leaveKind,
      setLeaveKind,
      t('create_request.kind_label'),
    );
  }, [leaveKind, openPicker, t]);

  const onPickOvertimeKind = useCallback(() => {
    openPicker(
      OVERTIME_KIND_ORDER,
      OVERTIME_KIND_LABEL_KEYS,
      overtimeKind,
      setOvertimeKind,
      t('create_request.overtime_kind_label'),
    );
  }, [openPicker, overtimeKind, t]);

  const onPickPlace = useCallback(() => {
    openPicker(
      WORK_PLACE_ORDER,
      WORK_PLACE_LABEL_KEYS,
      place,
      setPlace,
      t('create_request.place_label'),
    );
  }, [openPicker, place, t]);

  const onPickEventKind = useCallback(() => {
    openPicker(
      EVENT_KIND_ORDER,
      EVENT_KIND_LABEL_KEYS,
      eventKind,
      setEventKind,
      t('create_request.event_label'),
    );
  }, [eventKind, openPicker, t]);

  /**
   * Một lịch duy nhất cho cả hai ô ngày của đơn nghỉ phép: bấm ô nào cũng mở
   * đúng sheet này, và "Xác nhận" ghi lại cả ngày bắt đầu lẫn ngày kết thúc.
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

  /** Đơn theo giờ chỉ nhắm một ngày, nên dùng lại lịch với hai đầu trùng nhau. */
  const onPickDate = useCallback(() => {
    AppNavigator.showDialog({
      screen: DateRangeSheet,
      popupType: 'bottomSheet',
      onConfirm: (range: TRequestDateRange) => {
        setDate(range.from);
      },
      title: t(SINGLE_DATE_LABEL_KEYS[type]),
      value: { from: date, to: date },
    });
  }, [date, t, type]);

  /** Cùng `Selection` với các ô chọn khác, chỉ khác nhánh `timeSheet`. */
  const openTimeSheet = useCallback(
    (value: string, onConfirm: (time: string) => void, title: string) => {
      AppNavigator.showDialog({
        screen: Selection,
        popupType: 'bottomSheet',
        onConfirm,
        title,
        type: 'timeSheet',
        value,
      });
    },
    [],
  );

  const onPickStartTime = useCallback(() => {
    openTimeSheet(
      startTime,
      setStartTime,
      t('create_request.start_time_label'),
    );
  }, [openTimeSheet, startTime, t]);

  const onPickEndTime = useCallback(() => {
    openTimeSheet(endTime, setEndTime, t('create_request.end_time_label'));
  }, [endTime, openTimeSheet, t]);

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Chưa có API tạo đơn: ba hành động dưới đây mới chỉ là chỗ nối sẵn.
  const onSaveDraft = useCallback(() => {}, []);
  const onPickAttachment = useCallback(() => {}, []);
  const onSubmit = useCallback(() => {}, []);

  /**
   * Trường bắt buộc còn thiếu, chấm theo đúng bộ khối của loại đơn đang chọn
   * chứ không phải một chuỗi `if` viết tay cho từng loại.
   *
   * Trả về danh sách thay vì một cờ boolean vì đây là thứ cần để chỉ cho người
   * dùng biết còn thiếu gì — hiện màn mới chỉ dùng nó để khoá nút gửi.
   */
  const missingSections = useMemo(
    () => findMissingSections(type, { date, reason, totalDays, totalHours }),
    [date, reason, totalDays, totalHours, type],
  );

  return {
    approvers: APPROVERS,
    balances: BALANCES,
    canSubmit: missingSections.length === 0,
    dateLabel: dayjs(date).format(DISPLAY_DATE_FORMAT),
    duration,
    endDateLabel: dayjs(endDate).format(DISPLAY_DATE_FORMAT),
    endTime,
    eventKindLabel: t(EVENT_KIND_LABEL_KEYS[eventKind]),
    leaveKindLabel: t(LEAVE_KIND_LABEL_KEYS[leaveKind]),
    note,
    onGoBack,
    onPickAttachment,
    onPickDate,
    onPickDates,
    onPickEndTime,
    onPickEventKind,
    onPickLeaveKind,
    onPickOvertimeKind,
    onPickPlace,
    onPickStartTime,
    onPickType,
    onSaveDraft,
    onSubmit,
    overtimeKindLabel: t(OVERTIME_KIND_LABEL_KEYS[overtimeKind]),
    placeLabel: t(WORK_PLACE_LABEL_KEYS[place]),
    reason,
    reasonLabelKey: CREATE_REQUEST_REASON_LABEL_KEYS[type],
    reasonPlaceholderKey: CREATE_REQUEST_REASON_PLACEHOLDER_KEYS[type],
    remainingDays,
    sections,
    setDuration,
    setNote,
    setReason,
    singleDateLabelKey: SINGLE_DATE_LABEL_KEYS[type],
    source,
    sourceLabelKey: BALANCE_LABEL_KEYS[source],
    startDateLabel: dayjs(startDate).format(DISPLAY_DATE_FORMAT),
    startTime,
    titleKey: CREATE_REQUEST_TITLE_KEYS[type],
    totalDays,
    totalHours,
    typeLabel: t(REQUEST_TYPE_STYLES[type].labelKey),
  };
}
