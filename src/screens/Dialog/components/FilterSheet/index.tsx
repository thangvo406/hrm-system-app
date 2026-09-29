import type {
  TRequestFilters,
  TRequestPeriod,
  TRequestStatusFilter,
  TRequestTypeFilter,
} from '@type/requests';

import AppButton from '@components/AppButton';
import DatePicker from '@components/DatePicker';
import dayjs from 'dayjs';
import FilterChipGroup from './FilterChipGroup';
import Image from '@components/Image';
import { useCallback, useMemo, useState } from 'react';
import { Colors } from '@constants';
import {
  countSelectedFilters,
  DEFAULT_REQUEST_FILTERS,
  REQUEST_PERIOD_OPTIONS,
  REQUEST_STATUS_OPTIONS,
  REQUEST_TYPE_FILTER_OPTIONS,
  toOrderedDateRange,
} from '@utils/requests';
import { ScaleSize } from '@kits/core';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const RESET_ICON_SIZE = ScaleSize(16);
const NOOP = (): void => undefined;

const PERIOD_LABELS: Readonly<Record<TRequestPeriod, string>> = {
  all: 'requests.filter_all',
  custom: 'requests.filter_period_custom',
  last_3_months: 'requests.filter_period_last_3_months',
  this_month: 'requests.filter_period_this_month',
  this_week: 'requests.filter_period_this_week',
};

const STATUS_LABELS: Readonly<Record<TRequestStatusFilter, string>> = {
  all: 'requests.filter_all',
  approved: 'requests.status_approved',
  pending: 'requests.status_pending',
  // Hàng tab ghi được `processed` vào cùng trường này, nhưng bộ lọc không bày
  // chip nào cho nó — vẫn cần nhãn để `Record` đủ khoá.
  processed: 'requests.tab_processed_short',
  rejected: 'requests.status_rejected',
};

const TYPE_LABELS: Readonly<Record<TRequestTypeFilter, string>> = {
  draft: 'requests.type_draft',
  all: 'requests.filter_all',
  attendance_explanation: 'requests.type_attendance_explanation',
  early_leave: 'requests.type_early_leave',
  late_arrival: 'requests.type_late_arrival',
  leave: 'requests.type_leave',
  overtime: 'requests.type_overtime',
};

type Properties = {
  readonly onApply: (filters: TRequestFilters) => void;
  /** Bottom sheet tự tiêm hàm này vào khi mở. */
  readonly onRequestClose?: () => void;
  readonly value: TRequestFilters;
};

/**
 * Bộ lọc danh sách đơn từ, mở dạng bottom sheet.
 *
 * Mọi thay đổi chỉ nằm trong bản nháp cục bộ cho tới khi bấm "Áp dụng": người
 * dùng thử vài tổ hợp rồi đóng sheet lại thì danh sách phía sau không đổi.
 */
function FilterSheet({ onApply, onRequestClose = NOOP, value }: Properties) {
  const [draft, setDraft] = useState<TRequestFilters>(value);
  const { t } = useTranslation();

  const selectedCount = useMemo(() => countSelectedFilters(draft), [draft]);

  const onChangeType = useCallback((type: TRequestTypeFilter) => {
    setDraft(current => ({ ...current, type }));
  }, []);

  const onChangeStatus = useCallback((status: TRequestStatusFilter) => {
    setDraft(current => ({ ...current, status }));
  }, []);

  const onChangePeriod = useCallback((period: TRequestPeriod) => {
    setDraft(current => ({ ...current, period }));
  }, []);

  /**
   * `DatePicker` trả về mảng ngày đã chọn — có thể là `Date`, chuỗi hay đối
   * tượng dayjs tuỳ nhánh, nên nhận bằng `ConfigType` rồi để dayjs tự hiểu.
   * Lấy hai đầu mảng làm khoảng lọc, đã sắp đúng thứ tự: chạm ngày muộn trước
   * mà để khoảng ngược thì bộ lọc không khớp đơn nào.
   */
  const onChangeRange = useCallback((dates: readonly dayjs.ConfigType[]) => {
    const first = dates.at(0);
    const second = dates.at(-1);
    if (!first || !second) {
      return;
    }
    setDraft(current => ({
      ...current,
      range: toOrderedDateRange(first, second),
    }));
  }, []);

  const onReset = useCallback(() => {
    setDraft(DEFAULT_REQUEST_FILTERS);
  }, []);

  const onSubmit = useCallback(() => {
    onApply(draft);
    onRequestClose();
  }, [draft, onApply, onRequestClose]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t('requests.filter_title')}</Text>

        <AppButton
          onPress={onReset}
          style={styles.resetButton}
          testID="RequestsFilterReset"
        >
          <Image
            color={Colors.blue02}
            height={RESET_ICON_SIZE}
            name="ic_reset"
            type="svg"
            width={RESET_ICON_SIZE}
          />
          <Text style={styles.resetLabel}>{t('requests.filter_reset')}</Text>
        </AppButton>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <FilterChipGroup
          labelKey="requests.filter_type_label"
          labels={TYPE_LABELS}
          onChange={onChangeType}
          options={REQUEST_TYPE_FILTER_OPTIONS}
          testIDPrefix="RequestsFilterType"
          value={draft.type}
        />

        <FilterChipGroup
          labelKey="requests.filter_status_label"
          labels={STATUS_LABELS}
          onChange={onChangeStatus}
          options={REQUEST_STATUS_OPTIONS}
          testIDPrefix="RequestsFilterStatus"
          value={draft.status}
        />

        <FilterChipGroup
          labelKey="requests.filter_period_label"
          labels={PERIOD_LABELS}
          onChange={onChangePeriod}
          options={REQUEST_PERIOD_OPTIONS}
          testIDPrefix="RequestsFilterPeriod"
          value={draft.period}
        />

        {draft.period === 'custom' ? (
          <View style={styles.calendar} testID="RequestsFilterCalendar">
            <DatePicker onDateChange={onChangeRange} />
          </View>
        ) : undefined}
      </ScrollView>

      <AppButton
        onPress={onSubmit}
        style={styles.applyButton}
        testID="RequestsFilterApply"
      >
        <Text style={styles.applyLabel}>
          {t('requests.filter_apply', { total: selectedCount })}
        </Text>
      </AppButton>
    </View>
  );
}

export default FilterSheet;

const styles = StyleSheet.create({
  applyButton: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingVertical: ScaleSize(16),
  },
  applyLabel: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  calendar: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    marginTop: ScaleSize(16),
    overflow: 'hidden',
    paddingBottom: ScaleSize(12),
  },
  // `flexShrink` trong Yoga mặc định là 0 (khác web): thiếu dòng này thì khi
  // lịch hiện ra, khối nội dung giữ nguyên chiều cao thật và tràn xuống dưới
  // mép card đã bị chặn ở 90% màn hình, đẩy nút "Áp dụng" ra khỏi tầm nhìn.
  container: {
    flexShrink: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  content: {
    paddingBottom: ScaleSize(8),
  },
  resetButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  resetLabel: {
    color: Colors.blue02,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  // Sheet bị chặn ở 90% màn hình: phần cuộn phải co lại được, nếu không thì
  // lịch đẩy nút "Áp dụng" ra khỏi tầm nhìn.
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(22),
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
