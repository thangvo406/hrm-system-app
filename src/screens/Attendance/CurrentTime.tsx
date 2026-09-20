import type { TAttendanceShift } from '@type/attendance';

import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CLOCK_TICK_MS = 1000;
const DATE_FORMAT = 'DD/MM/YYYY';
const SECONDS_FORMAT = 'ss';
const TIME_FORMAT = 'HH:mm';

const WEEKDAY_SEPARATOR = ', ';
// dayjs().day() đánh số Chủ Nhật = 0, còn `date_range.day_long_display` liệt kê
// từ Thứ Hai. Dịch chỉ số một nhịp thay vì thêm bộ khoá thứ hai cho tuần.
const DAYS_PER_WEEK = 7;

type Properties = {
  readonly shift: TAttendanceShift;
};

/**
 * Đồng hồ hiện tại kèm dòng ngày và ca được phân.
 *
 * Nhịp giây nằm ngay trong component này chứ không ở `useAttendance`: để ở hook
 * thì mỗi giây cả màn Chấm công render lại, kéo theo thẻ bản đồ và nhật ký; ở
 * đây chỉ riêng khối chữ này render lại.
 */
function CurrentTime({ shift }: Properties) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), CLOCK_TICK_MS);
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
          endAt: shift.endAt,
          name: shift.name,
          startAt: shift.startAt,
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
