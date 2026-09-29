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
  readonly dateType: string;
  readonly value: TRequestDateRange;
};

function DateRangeSheet({
  onConfirm,
  onRequestClose = NOOP,
  title,
  value,
  dateType,
}: Properties) {
  const [picked, setPicked] = useState<TRequestDateRange>(value);
  const { t } = useTranslation();

  const initialRange = useMemo(
    () => ({ from: dayjs(value.from), to: dayjs(value.to) }),
    [value.from, value.to],
  );

  const onDateChange = useCallback((dates: readonly dayjs.ConfigType[]) => {
    const first = dates.at(0);
    const second = dates.at(-1);
    if (!first || !second) {
      return;
    }
    const next = toOrderedDateRange(first, second);
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
      {dateType != 'single' && (
        <Text style={styles.preview}>
          {t('create_request.date_range_preview', {
            end: dayjs(picked.to).format(DISPLAY_DATE_FORMAT),
            start: dayjs(picked.from).format(DISPLAY_DATE_FORMAT),
          })}
        </Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <DatePicker
          type={dateType}
          dataInit={initialRange}
          onDateChange={onDateChange}
        />
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
