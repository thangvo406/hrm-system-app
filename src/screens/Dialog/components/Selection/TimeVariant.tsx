import type { TSelectionProps } from '@type/dialog';

import React, { useCallback, useMemo, useState } from 'react';
import SelectionShell, { CONFIRM_RESERVED_HEIGHT } from './SelectionShell';
import TimeColumn, { EDGE_ROWS, ITEM_HEIGHT } from './TimeColumn';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import {
  buildHourValues,
  buildMinuteValues,
  DEFAULT_MINUTE_STEP,
  formatHourMinute,
  splitTime,
} from '@utils/date';

const HOURS = buildHourValues();

type Properties = Extract<TSelectionProps, { type: 'timeSheet' }>;

/**
 * Nhánh chọn giờ: hai cột giờ và phút cuộn độc lập.
 *
 * Giờ mới chỉ trả về khi bấm "Xác nhận", giống `DateRangeSheet`: cuộn nhầm rồi
 * đóng sheet thì giá trị cũ vẫn giữ nguyên.
 */
function TimeVariant({
  minuteStep = DEFAULT_MINUTE_STEP,
  onConfirm,
  onRequestClose,
  title,
  value,
}: Properties) {
  const minutes = useMemo(() => buildMinuteValues(minuteStep), [minuteStep]);
  const initial = useMemo(
    () => splitTime(value, minuteStep),
    [minuteStep, value],
  );

  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const onSubmit = useCallback(() => {
    onConfirm(formatHourMinute(hour, minute));
    onRequestClose?.();
  }, [hour, minute, onConfirm, onRequestClose]);

  return (
    <SelectionShell onConfirm={onSubmit} title={title}>
      <View style={styles.picker}>
        {/* Dải sáng nằm dưới hai cột, đánh dấu dòng đang chọn. */}
        <View pointerEvents="none" style={styles.highlight} />

        <TimeColumn
          onChange={setHour}
          testID="TimeSheetHours"
          value={hour}
          values={HOURS}
        />
        <Text style={styles.separator}>:</Text>
        <TimeColumn
          onChange={setMinute}
          testID="TimeSheetMinutes"
          value={minute}
          values={minutes}
        />
      </View>
    </SelectionShell>
  );
}

export default React.memo(TimeVariant);

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    height: ITEM_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: ITEM_HEIGHT * EDGE_ROWS,
  },
  picker: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    // Chừa chỗ cho nút Xác nhận ghim đáy, dùng chung con số với nhánh list.
    marginBottom: CONFIRM_RESERVED_HEIGHT,
  },
  separator: {
    color: Colors.navy04,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
});
