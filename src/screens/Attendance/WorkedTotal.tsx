import React, { useEffect, useState } from 'react';
import { getCurrentTime } from '@utils/date';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// Chỉ hiển thị tới phút nên không cần nhịp giây; 30s đủ để con số không lệch
// quá lâu so với đồng hồ.
const TICK_MS = 30_000;
const MINUTES_IN_HOUR = 60;
const MINUTE_PAD_LENGTH = 2;
const PAD_CHARACTER = '0';
const TIME_SEPARATOR = ':';

/** "HH:mm" của hôm nay -> dayjs. Tách tay để khỏi cần plugin customParseFormat. */
const parseTimeToday = (time: string) => {
  const [hours, minutes] = time.split(TIME_SEPARATOR).map(Number);
  return getCurrentTime()
    .hour(hours ?? 0)
    .minute(minutes ?? 0)
    .second(0);
};

type Properties = {
  /** `undefined` khi chưa chấm công vào ca — lúc đó tổng là 0 giờ. */
  readonly checkedInAt?: string;
  /** Đã ra ca thì tổng chốt tại đó, không chạy tiếp. */
  readonly checkedOutAt?: string;
};

/**
 * Tổng thời gian đã làm trong ngày: từ lúc vào ca tới bây giờ, hoặc tới lúc ra
 * ca nếu đã chấm công ra.
 *
 * Tự đếm nhịp trong component này chứ không ở `useAttendance`, giống
 * `CurrentTime`: để ở hook thì mỗi nhịp cả màn Chấm công render lại, kéo theo
 * cả thẻ bản đồ.
 */
function WorkedTotal({ checkedInAt, checkedOutAt }: Properties) {
  const { t } = useTranslation();
  const [now, setNow] = useState(getCurrentTime);

  useEffect(() => {
    // Đã ra ca thì tổng đứng yên, không cần timer nữa.
    if (checkedOutAt) {
      return;
    }
    const timer = setInterval(() => setNow(getCurrentTime()), TICK_MS);
    return () => clearInterval(timer);
  }, [checkedOutAt]);

  if (!checkedInAt) {
    return <Text style={styles.total}>{t('attendance.log.worked.none')}</Text>;
  }

  const startedAt = parseTimeToday(checkedInAt);
  const endedAt = checkedOutAt ? parseTimeToday(checkedOutAt) : now;
  // Chặn số âm: đồng hồ máy có thể bị chỉnh lùi, hoặc ca đêm vắt qua nửa đêm.
  const totalMinutes = Math.max(0, endedAt.diff(startedAt, 'minute'));

  return (
    <Text style={styles.total}>
      {t('attendance.log.worked.total', {
        hours: Math.floor(totalMinutes / MINUTES_IN_HOUR),
        minutes: String(totalMinutes % MINUTES_IN_HOUR).padStart(
          MINUTE_PAD_LENGTH,
          PAD_CHARACTER,
        ),
      })}
    </Text>
  );
}

export default React.memo(WorkedTotal);

const styles = StyleSheet.create({
  total: {
    color: Colors.gray24,
    fontSize: ScaleSize(13),
  },
});
