import type { PunchTone } from './PunchLine';
import type { TAttendanceHistoryEntry } from '@type/attendance';

import dayjs from 'dayjs';
import Image from '@components/Image';
import 'dayjs/locale/ko';
import 'dayjs/locale/vi';
import PunchLine from './PunchLine';
import React from 'react';
import StatusBadge from './StatusBadge';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CARD_SHADOW_OFFSET = ScaleSize(6);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;
const WORKED_ICON_SIZE = ScaleSize(14);
const CHEVRON_SIZE = ScaleSize(18);
const WORKED_PLACEHOLDER = '--';
const DATE_LABEL_FORMAT = 'dddd, DD/MM/YYYY';
const MINUTE_PAD_LENGTH = 2;
const PAD_CHARACTER = '0';
// 'vi-VN' → 'vi', 'ko-KR' → 'ko', 'en-EN' → 'en'; dayjs tự lùi về 'en' nếu
// locale chưa được import.
const LOCALE_CODE_LENGTH = 2;

const getPunchTones = (
  entry: TAttendanceHistoryEntry,
): { readonly checkIn: PunchTone; readonly checkOut: PunchTone } => {
  if (entry.status === 'missing') {
    return { checkIn: 'missing', checkOut: 'missing' };
  }
  return {
    checkIn: entry.status === 'late' ? 'warning' : 'done',
    checkOut: entry.status === 'early_leave' ? 'warning' : 'exit',
  };
};

type Properties = {
  readonly entry: TAttendanceHistoryEntry;
};

/** Một ngày công trong danh sách lịch sử chấm công. */
function HistoryRow({ entry }: Properties) {
  const { i18n, t } = useTranslation();
  const date = dayjs(entry.date);
  const dateLabel = date
    .locale(i18n.language.slice(0, LOCALE_CODE_LENGTH))
    .format(DATE_LABEL_FORMAT);
  const tones = getPunchTones(entry);
  const hasWorkedTime = entry.workedHours !== undefined;

  return (
    <View style={styles.container} testID={`AttendanceHistoryRow_${entry.id}`}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.dateText}>
          {dateLabel}
        </Text>
        <StatusBadge status={entry.status} />
      </View>

      <View style={styles.body}>
        <View style={styles.timeline}>
          <PunchLine
            at={entry.checkInAt}
            device={entry.checkInDevice}
            icon={tones.checkIn === 'warning' ? 'ic_clock' : 'ic_sign_in'}
            label={t('attendance_histories.check_in')}
            method={entry.checkInMethod}
            tone={tones.checkIn}
          />
          <View style={styles.timelineGap}>
            <View style={styles.timelineConnector} />
          </View>
          <PunchLine
            at={entry.checkOutAt}
            device={entry.checkOutDevice}
            icon={tones.checkOut === 'warning' ? 'ic_clock' : 'ic_sign_out'}
            label={t('attendance_histories.check_out')}
            method={entry.checkOutMethod}
            tone={tones.checkOut}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.right}>
          <View style={styles.workedLabelRow}>
            <Image
              color={Colors.gray24}
              height={WORKED_ICON_SIZE}
              name="ic_clock"
              type="svg"
              width={WORKED_ICON_SIZE}
            />
            <Text numberOfLines={1} style={styles.workedLabel}>
              {t('attendance_histories.worked_label')}
            </Text>
          </View>

          <Text style={[styles.worked, !hasWorkedTime && styles.workedMissing]}>
            {hasWorkedTime
              ? t('attendance_histories.worked_value', {
                  hours: entry.workedHours,
                  minutes: String(entry.workedMinutes ?? 0).padStart(
                    MINUTE_PAD_LENGTH,
                    PAD_CHARACTER,
                  ),
                })
              : WORKED_PLACEHOLDER}
          </Text>
        </View>

        <Image
          color={Colors.gray24}
          height={CHEVRON_SIZE}
          name="ic_chevron_right"
          type="svg"
          width={CHEVRON_SIZE}
        />
      </View>
    </View>
  );
}

export default React.memo(HistoryRow);

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(10),
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(18),
    elevation: CARD_ELEVATION,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    padding: ScaleSize(12),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: ScaleSize(12),
  },
  dateText: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: Colors.gray27,
    width: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
  },
  right: {
    alignItems: 'flex-start',
    width: ScaleSize(82),
  },
  timeline: {
    flex: 1,
  },
  // Đường nối dọc giữa hai ô dấu, canh đúng tâm ô tròn 34pt bên trái.
  timelineConnector: {
    backgroundColor: Colors.gray27,
    height: '100%',
    marginLeft: ScaleSize(16),
    width: 2,
  },
  timelineGap: {
    height: ScaleSize(10),
  },
  worked: {
    color: Colors.navy04,
    fontSize: ScaleSize(12),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
  workedLabel: {
    color: Colors.gray24,
    flexShrink: 1,
    fontSize: ScaleSize(8),
  },
  workedLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  workedMissing: {
    color: Colors.gray08,
  },
});
