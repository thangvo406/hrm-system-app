import type { TAttendanceStatus, TAttendanceWeekDay } from '@type/attendance';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ARROW_SIZE = ScaleSize(20);
const DAY_CIRCLE_SIZE = ScaleSize(38);
const DOT_SIZE = ScaleSize(7);
const CARD_SHADOW_OFFSET = ScaleSize(6);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

/** Màu chấm dưới mỗi ngày, theo kết luận chấm công của ngày đó. */
const DOT_COLORS: Record<TAttendanceStatus, string> = {
  early_leave: Colors.yellow03,
  late: Colors.yellow03,
  missing: Colors.gray24,
  on_time: Colors.green02,
};

type Properties = {
  readonly month: number;
  readonly onPressNextWeek: () => void;
  readonly onPressPreviousWeek: () => void;
  readonly onSelectDate: (date: string) => void;
  readonly selectedDate: string;
  readonly weekDays: readonly TAttendanceWeekDay[];
  readonly year: number;
};

/** Dải tuần ở đầu danh sách: điều hướng tuần và chọn ngày đang xem. */
function WeekStrip({
  month,
  onPressNextWeek,
  onPressPreviousWeek,
  onSelectDate,
  selectedDate,
  weekDays,
  year,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppButton
          onPress={onPressPreviousWeek}
          style={styles.arrow}
          testID="AttendanceHistoriesPreviousWeek"
        >
          <Image
            color={Colors.gray17}
            height={ARROW_SIZE}
            name="ic_arrow_left_gray"
            type="svg"
            width={ARROW_SIZE}
          />
        </AppButton>

        <Text style={styles.monthLabel}>
          {t('attendance_histories.month_label', { month, year })}
        </Text>

        <AppButton
          onPress={onPressNextWeek}
          style={styles.arrow}
          testID="AttendanceHistoriesNextWeek"
        >
          <Image
            color={Colors.gray17}
            height={ARROW_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={ARROW_SIZE}
          />
        </AppButton>
      </View>

      <View style={styles.week}>
        {weekDays.map(day => {
          const isSelected = day.date === selectedDate;
          return (
            <AppButton
              key={day.id}
              onPress={() => onSelectDate(day.date)}
              style={styles.day}
              testID={`AttendanceHistoriesDay_${day.date}`}
            >
              <Text style={styles.weekdayLabel}>{t(day.weekdayKey)}</Text>

              <View
                style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberActive,
                  ]}
                >
                  {day.dayNumber}
                </Text>
              </View>

              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isSelected
                      ? Colors.blue02
                      : (day.status && DOT_COLORS[day.status]) || Colors.gray12,
                  },
                ]}
              />
            </AppButton>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(WeekStrip);

const styles = StyleSheet.create({
  arrow: {
    padding: ScaleSize(6),
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(18),
    elevation: CARD_ELEVATION,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(14),
    paddingBottom: ScaleSize(14),
    paddingTop: ScaleSize(12),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: ScaleSize(12),
  },
  day: {
    alignItems: 'center',
    flex: 1,
    gap: ScaleSize(6),
  },
  dayCircle: {
    alignItems: 'center',
    borderRadius: DAY_CIRCLE_SIZE / 2,
    height: DAY_CIRCLE_SIZE,
    justifyContent: 'center',
    width: DAY_CIRCLE_SIZE,
  },
  dayCircleActive: {
    backgroundColor: Colors.blue02,
  },
  dayNumber: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  dayNumberActive: {
    color: Colors.white,
  },
  dot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    width: DOT_SIZE,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(12),
  },
  monthLabel: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(6),
  },
  weekdayLabel: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
  },
});
