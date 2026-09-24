import type { TAttendanceShift } from '@type/attendance';

import React, { useEffect, useMemo, useState } from 'react';
import { getCurrentTime } from '@utils/date';
import { AppConstants, Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CLOCK_TICK_MS = 1000;
const DATE_FORMAT = 'DD/MM/YYYY';
const SECONDS_FORMAT = 'ss';
const TIME_FORMAT = 'HH:mm';

const WEEKDAY_SEPARATOR = ', ';
const DAYS_PER_WEEK = 7;

type Properties = {
  /** `undefined` khi chưa biết văn phòng nào — rơi về ca chung của công ty. */
  readonly shift?: TAttendanceShift;
};

function CurrentTime({ shift }: Properties) {
  const { t } = useTranslation();
  const [now, setNow] = useState(getCurrentTime);

  const officeShift = shift ?? {
    endWorkingTime: AppConstants.OFFICE_SHIFT.END_AT,
    name: t('attendance.shift_office_name'),
    startWorkingTime: AppConstants.OFFICE_SHIFT.START_AT,
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(getCurrentTime()), CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const weekday = now.day();

  // Tên thứ lấy từ `date.date_range.day_long_display` đang có sẵn cho cả ba
  // ngôn ngữ, khỏi thêm một bộ khoá tên thứ thứ hai. Memo theo số thứ chứ không
  // theo `now`, nếu không thì mỗi giây lại split lại chuỗi.
  const weekdayLabel = useMemo(() => {
    const weekdays = t('date.date_range.day_long_display').split(
      WEEKDAY_SEPARATOR,
    );
    return weekdays[(weekday + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK] ?? '';
  }, [t, weekday]);

  return (
    <>
      <View style={styles.clockRow}>
        <Text style={styles.time}>{now.format(TIME_FORMAT)}</Text>
        <Text style={styles.seconds}>:{now.format(SECONDS_FORMAT)}</Text>
      </View>

      <Text style={styles.meta}>
        {t('attendance.shift_meta', {
          date: now.format(DATE_FORMAT),
          endAt: officeShift.endWorkingTime,
          name: officeShift.name,
          startAt: officeShift.startWorkingTime,
          weekday: weekdayLabel,
        })}
      </Text>
    </>
  );
}

export default React.memo(CurrentTime);

const styles = StyleSheet.create({
  clockRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  meta: {
    color: Colors.gray24,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(6),
    textAlign: 'center',
  },
  seconds: {
    color: Colors.gray24,
    fontSize: ScaleSize(22),
    fontWeight: '700',
  },
  time: {
    color: Colors.navy04,
    fontSize: ScaleSize(40),
    fontWeight: '800',
    letterSpacing: ScaleSize(-1),
  },
});
