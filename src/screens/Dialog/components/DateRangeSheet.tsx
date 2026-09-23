import type { TRequestDateRange } from '@type/requests';

import AppButton from '@components/AppButton';
import DatePicker from '@components/DatePicker';
import dayjs from 'dayjs';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { toOrderedDateRange } from '@utils/requests';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';
const NOOP = (): void => undefined;

type Properties = {
  readonly onConfirm: (range: TRequestDateRange) => void;
  /** Bottom sheet tự tiêm hàm này vào khi mở. */
  readonly onRequestClose?: () => void;
  readonly title: string;
  readonly value: TRequestDateRange;
};

/**
 * Bottom sheet chọn MỘT KHOẢNG ngày, bọc quanh `DatePicker` dùng chung.
 *
 * Khoảng mới chỉ trả về khi bấm "Xác nhận": chạm nhầm một ô trên lịch rồi đóng
 * sheet thì giá trị cũ vẫn giữ nguyên.
 */
function DateRangeSheet({
  onConfirm,
  onRequestClose = NOOP,
  title,
  value,
}: Properties) {
  const [picked, setPicked] = useState<TRequestDateRange>(value);
  const { t } = useTranslation();

  /**
   * Tham chiếu phải ổn định, KHÔNG được dựng object literal ngay trong JSX.
   * `DatePicker` có `useEffect(..., [dataInit])` gọi `setSelectedDates`, mà
   * `selectedDates` đổi lại bắn `onDateChange` → `setPicked` → render lại →
   * object literal mới → đúng một vòng lặp vô hạn ("Maximum update depth
   * exceeded"). Neo vào hai chuỗi ngày thì nó chỉ đổi khi giá trị thật đổi.
   */
  const initialRange = useMemo(
    () => ({ from: dayjs(value.from), to: dayjs(value.to) }),
    [value.from, value.to],
  );

  /**
   * `DatePicker` bắn ra mảng ngày đang chọn. Chạm ô đầu tiên thì mảng mới có
   * một phần tử — lúc đó lấy luôn nó cho cả hai đầu, để bản xem trước bên dưới
   * không hiện khoảng dở dang từ lần chọn trước.
   *
   * `toOrderedDateRange` lo phần thứ tự: lịch cho chạm hai ngày theo thứ tự
   * tuỳ ý nên người dùng có thể chọn ngày kết thúc trước.
   */
  const onDateChange = useCallback((dates: readonly dayjs.ConfigType[]) => {
    const first = dates.at(0);
    const second = dates.at(-1);
    if (!first || !second) {
      return;
    }
    const next = toOrderedDateRange(first, second);
    // Giữ nguyên object cũ khi ngày không đổi: lịch bắn `onDateChange` ngay
    // lúc mount, không cần thêm một lượt render chỉ để ghi lại giá trị cũ.
    setPicked(current =>
      current.from === next.from && current.to === next.to ? current : next,
    );
  }, []);

  const onSubmit = useCallback(() => {
    onConfirm(picked);
    onRequestClose();
  }, [onConfirm, onRequestClose, picked]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.preview}>
        {t('create_request.date_range_preview', {
          end: dayjs(picked.to).format(DISPLAY_DATE_FORMAT),
          start: dayjs(picked.from).format(DISPLAY_DATE_FORMAT),
        })}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <DatePicker dataInit={initialRange} onDateChange={onDateChange} />
      </ScrollView>

      <AppButton
        onPress={onSubmit}
        style={styles.confirmButton}
        testID="DateRangeSheetConfirm"
      >
        <Text style={styles.confirmLabel}>{t('common.confirm')}</Text>
      </AppButton>
    </View>
  );
}

export default DateRangeSheet;

const styles = StyleSheet.create({
  confirmButton: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(14),
    marginTop: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  confirmLabel: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  // Sheet bị chặn ở 90% màn hình nên cả khối lẫn phần cuộn đều phải co được,
  // nếu không thì lịch đẩy nút "Xác nhận" ra khỏi tầm nhìn.
  container: {
    flexShrink: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  preview: {
    color: Colors.blue02,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginBottom: ScaleSize(8),
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
});
