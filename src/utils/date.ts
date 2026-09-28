import { EDayOfWeek } from '@constants/config';
import dayjs from 'dayjs';
import Globals from './Globals';
import { Colors } from '@constants';

export const getCurrentTime = (): dayjs.Dayjs => {
  const syncedTime = dayjs(Globals.currentTime);
  if (!Globals.currentTimeSyncedAt || !syncedTime.isValid()) {
    return dayjs();
  }
  return syncedTime.add(
    Date.now() - Globals.currentTimeSyncedAt,
    'millisecond',
  );
};

export const TIME_FORMAT = 'HH:mm';
export const ISO_DATE_FORMAT = 'YYYY-MM-DD';

/** Giờ tường server gửi về: `HH:mm:ss`, và chấp nhận cả `HH:mm`. */
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const getOnlyTime = (
  date: string | undefined,
  format: string = TIME_FORMAT,
): string => {
  const parsed = dayjs(date);
  return date && parsed.isValid() ? parsed.format(format) : '';
};

export const getOnlyDate = (
  date: string | undefined,
  format: string = ISO_DATE_FORMAT,
): string => {
  const parsed = dayjs(date);
  return date && parsed.isValid() ? parsed.format(format) : '';
};

const isLeapYear = (year: number): boolean => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

export function getTimeByTimezone(
  time?: string,
  targetTimezone?: string,
): string {
  if (!time) {
    return '';
  }

  if (!targetTimezone || !TIME_PATTERN.test(time)) {
    return time;
  }

  try {
    const sourceTimezone = dayjs.tz.guess();
    const today = dayjs().tz(sourceTimezone).format(ISO_DATE_FORMAT);
    const atSource = dayjs.tz(`${today} ${time}`, sourceTimezone);

    return atSource.isValid()
      ? atSource.tz(targetTimezone).format(TIME_FORMAT)
      : time;
  } catch {
    return time;
  }
}

export function isDateInCurrentWeek(
  currentWeek: any,
  date = Globals.currentTime,
): boolean {
  if (!currentWeek) {
    return false;
  }
  const today = dayjs(date).startOf('day');
  const start = dayjs(currentWeek.startDate).startOf('day');
  const end = dayjs(currentWeek.endDate).startOf('day');
  return today.isSameOrAfter(start) && today.isSameOrBefore(end);
}

export const calculateThisWeek = ({ dateVisible, currentDate }: any) => {
  const displayDate = new Date(dateVisible);
  const selectedMonth = displayDate.getMonth() + 1;
  const currentMonth = new Date(currentDate).getMonth() + 1;
  let value = currentMonth - selectedMonth;
  const currentYear = new Date(currentDate).getFullYear();
  const selectedYear = displayDate.getFullYear();
  let nextMonth = selectedMonth;
  if (currentYear < selectedYear) {
    nextMonth = (selectedYear - currentYear) * 12 + selectedMonth;
  }
  if (currentYear != selectedYear) {
    if (nextMonth > currentMonth) {
      value =
        0 - currentMonth - (12 * (currentYear - selectedYear) - selectedMonth);
      value = value < 0 ? value * -1 : value;
    } else {
      value =
        0 - currentMonth - (12 * (currentYear - selectedYear) - selectedMonth);
      value = value < 0 ? value * -1 : value;
    }
  }
  return value;
};

export function findNearestDate(items: any[], fieldName: string) {
  const today = getCurrentTime();

  if (items?.length == 1) {
    return items[0];
  }
  let nearest: any = {};
  for (const item of items ?? []) {
    const date = fieldName ? item?.[fieldName] : item;
    const nearestDate = fieldName ? nearest?.[fieldName] : item;
    if (nearest?.[fieldName]) {
      const currentDiff = Math.abs(dayjs(date).diff(today, 'day'));
      const nearestDiff = Math.abs(dayjs(nearestDate).diff(today, 'day'));
      nearest = currentDiff < nearestDiff ? item : nearest;
    } else {
      nearest = item;
    }
  }
  return nearest;
}
export function formatDateTime(d: any) {
  // const date = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  // const hours = String(d.getHours()).padStart(2, '0');
  // const minutes = String(d.getMinutes()).padStart(2, '0');
  // const seconds = String(d.getSeconds()).padStart(2, '0');
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return `${year}-${month}-${day}`;
}

export function calculateDaysBetweenDates(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInTime = end - start;

  // Convert milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  return differenceInDays;
}

export function getDaysUntil(
  date: dayjs.ConfigType,
  from: dayjs.ConfigType = Globals.currentTime,
): number | undefined {
  const target = dayjs(date);
  if (!date || !target.isValid()) {
    return undefined;
  }
  // Globals.currentTime is empty until the server time lands: fall back to now.
  const today = dayjs(from).isValid() ? dayjs(from) : dayjs();
  return target.startOf('day').diff(today.startOf('day'), 'day');
}

export function getWeekDate(date: any) {
  const day = date.getDay(); // Get day of week (0=Sunday, 1=Monday, ...)
  const diffToMonday = day === 0 ? -6 : 1 - day; // Adjust if Sunday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { monday, sunday };
}

export function getRangeDateByRange(selectedDates: any) {
  const dates = selectedDates;
  const results: Record<
    string,
    {
      color: string;
      customTextStyle: any;
      endingDay: boolean;
      startingDay: boolean;
      textColor: string;
    }
  > = {};
  const today = getCurrentTime().format('YYYY-MM-DD');
  if (dates?.length > 0 && dates.length < 2) {
    const startDate = new Date(dates[0]);
    const formatTime = formatDateTime(startDate);
    results[formatTime] = {
      startingDay: true,
      endingDay: true,
      color: Colors.green03,
      textColor: Colors.primary,
      customTextStyle: {
        fontWeight: 'bold',
        color: Colors.primary,
      },
    };
  } else {
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const minDate = new Date(min);
    const duration = Math.round(calculateDaysBetweenDates(min, max));

    for (let index = 0; index <= duration; index++) {
      const startDate = new Date(min);
      startDate.setDate(minDate.getDate() + index);
      const formatTime = formatDateTime(startDate);
      results[formatTime] = {
        startingDay: index == 0,
        endingDay: index == duration,
        color: Colors.green03,
        textColor: Colors.primary,
        customTextStyle: {
          fontWeight: 'bold',
          color: Colors.primary,
        },
      };
    }
  }

  if (results[today]) {
    results[today] = {
      ...results[today],
      marked: true,
    };
  }
  return results;
}
export function getSingleDate(_: any, selectedDates: any) {
  const results = {
    [dayjs(selectedDates).format('YYYY-MM-DD')]: {
      startingDay: true,
      endingDay: true,
      textColor: Colors.primary,
      color: Colors.green03,
    },
  };
  return results;
}
export function getRangeDateByWeek(_, selectedDate: any) {
  const { monday, sunday: lastWeek } = getWeekDate(new Date(selectedDate));
  const results = {};
  const today = getCurrentTime().format('YYYY-MM-DD');
  results[dayjs(monday.getTime()).format('YYYY-MM-DD')] = {
    startingDay: true,
    textColor: Colors.primary,
    color: Colors.green03,
    customTextStyle: {
      fontWeight: 'bold',
      color: Colors.primary,
    },
  };
  if (lastWeek.getDate() - monday.getDate() < 0) {
    const dayOfMonday = getLengthOfMonth(
      monday.getMonth() + 1,
      monday.getFullYear(),
    );

    for (let index = monday.getDate() + 1; index <= dayOfMonday; index++) {
      const date = dayjs(monday.getTime()).set('date', index);
      // console.log('date',index, date);

      results[date.format('YYYY-MM-DD')] = {
        startingDay: false,
        textColor: Colors.primary,
        color: Colors.green03,
        customTextStyle: {
          fontWeight: 'bold',
          color: Colors.primary,
        },
      };
    }

    for (let index = 1; index <= lastWeek.getDate() - 1; index++) {
      const date = dayjs(lastWeek.getTime()).set('date', index);
      // console.log('date',index, date);

      results[date.format('YYYY-MM-DD')] = {
        startingDay: false,
        textColor: Colors.primary,
        color: Colors.green03,
        customTextStyle: {
          fontWeight: 'bold',
          color: Colors.primary,
        },
      };
    }
  } else {
    for (
      let index = monday.getDate() + 1;
      index <= lastWeek.getDate() - 1;
      index++
    ) {
      const date = dayjs(monday.getTime()).set('date', index);
      // console.log('date',index, date);

      results[date.format('YYYY-MM-DD')] = {
        startingDay: false,
        textColor: Colors.primary,
        color: Colors.green03,
        customTextStyle: {
          fontWeight: 'bold',
          color: Colors.primary,
        },
      };
    }
  }
  results[dayjs(lastWeek.getTime()).format('YYYY-MM-DD')] = {
    // startingDay: true,
    endingDay: true,
    textColor: Colors.primary,
    color: Colors.green03,
    customTextStyle: {
      fontWeight: 'bold',
      color: Colors.primary,
    },
  };
  if (results[today]) {
    results[today] = {
      ...results[today],
      marked: true,
    };
  }
  return results;
}

export function getRangeWeekDates(date: any) {
  const { monday, sunday } = getWeekDate(date);
  const dates = [];
  const currentDate = new Date(monday);

  while (currentDate <= new Date(sunday)) {
    dates.push(new Date(currentDate).toISOString()); // Store a copy of the date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Utility functions for time formatting and conversion
 */

/**
 * Convert seconds to HH:MM:SS format
 * @param seconds - Number of seconds
 * @returns Formatted time string in HH:MM:SS format
 */
export const formatSecondsToTime = (seconds: number): string => {
  if (!seconds || seconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format with leading zeros
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const getDateByDay = (day: EDayOfWeek, date: number) => {
  const MAPPING_DAY: Record<EDayOfWeek, number> = {
    [EDayOfWeek.MONDAY]: 0,
    [EDayOfWeek.TUESDAY]: 1,
    [EDayOfWeek.WEDNESDAY]: 2,
    [EDayOfWeek.THURSDAY]: 3,
    [EDayOfWeek.FRIDAY]: 4,
    [EDayOfWeek.SATURDAY]: 5,
    [EDayOfWeek.SUNDAY]: 6,
  };
  const incrementDay = MAPPING_DAY[day];
  // _monday.setDate(mondayDate + incrementDay);
  return date + incrementDay;
};
export const getLengthOfMonth = (month: any, year: any) => {
  if (month == 2) {
    return isLeapYear(year) ? 29 : 28;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return 31;
  } else {
    return 30;
  }
};

/**
 * Countdown clock that starts at the largest non-zero unit: `01:05:00`,
 * `05:00`, `09`. Units below the leading one are always kept, so the string
 * never loses a trailing `:00`.
 */
const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
export const formatTime = (total: number) => {
  const safeTotal = Math.max(total, 0);
  const hours = Math.floor(safeTotal / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (safeTotal % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const seconds = safeTotal % SECONDS_PER_MINUTE;

  const segments = [seconds];
  if (hours > 0 || minutes > 0) {
    segments.unshift(minutes);
  }
  if (hours > 0) {
    segments.unshift(hours);
  }

  return segments.map(segment => String(segment).padStart(2, '0')).join(':');
};

export const isTodayWorkDate = (workDate?: string) => {
  return workDate === getCurrentTime().format(ISO_DATE_FORMAT);
};
export const isToday = (date: any) => {
  const now = getCurrentTime();
  return (
    now.isSame(date, 'day') &&
    now.isSame(date, 'month') &&
    now.isSame(date, 'year')
  );
};

export function isTomorrow(date: string | Date | dayjs.Dayjs): boolean {
  const input = dayjs(date);
  const tomorrow = getCurrentTime().add(1, 'day');
  return (
    input.isSame(tomorrow, 'day') &&
    input.isSame(tomorrow, 'month') &&
    input.isSame(tomorrow, 'year')
  );
}

export function getMonday(d) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function calculateHoursBetweenTimes(
  startDate: string,
  endDate: string,
): number {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // Calculate difference in hours
  const diffHours = end.diff(start, 'hour', true); // true to get decimal points

  return diffHours;
}

export function isSameDay(firstDate: string, secondDate: string): boolean {
  const first = dayjs(firstDate);
  const second = dayjs(secondDate);

  return (
    first.isSame(second, 'day') &&
    first.isSame(second, 'month') &&
    first.isSame(second, 'year')
  );
}

export function createLocalTime(time: string, date?: string): dayjs.Dayjs {
  // If no date provided, use current date
  const baseDate = date ? dayjs(date) : dayjs();
  const [hours, minutes] = time.split(':').map(Number);

  // Create the date string with the desired time
  const dateString = baseDate.format('YYYY-MM-DD');
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

  // Parse the complete date-time string
  return dayjs(`${dateString} ${timeString}`, 'YYYY-MM-DD HH:mm:ss');
}

interface TimeRange {
  endTime: string;
  startTime: string;
}

interface Event {
  // ISO format: "2024-03-20T10:00:00"
  endTime: string;
  startTime: string;
}

/**
 * Converts time string (HH:mm) to Date object using the event's date
 * @param timeStr Time string in format "HH:mm"
 * @param referenceDate Reference date from event
 * @returns Date object
 */
function convertTimeToDate(timeStr: string, referenceDate: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Checks if a lesson overlaps with an event
 * @param lesson Tiết học cần kiểm tra (time only format "HH:mm")
 * @param event Sự kiện để so sánh (ISO format)
 * @returns true nếu tiết học trùng thời gian với sự kiện
 */
export function isLessonOverlapWithEvent(
  lesson: TimeRange,
  event: Event,
): boolean {
  const eventStart = new Date(event.startTime);
  const eventEnd = new Date(event.endTime);

  const lessonStart = convertTimeToDate(lesson.startTime, eventStart);
  const lessonEnd = convertTimeToDate(lesson.endTime, eventStart);

  return lessonStart < eventEnd && eventStart < lessonEnd;
}

/**
 * Finds all lessons that overlap with the given event
 * @param lessons Array of lessons with time only format
 * @param event Single event in ISO format
 * @returns Array of lessons that overlap with the event
 */

// Example usage:
/*
 const lessons = [
   { startTime: "09:00", endTime: "10:30" },  // trùng
   { startTime: "11:00", endTime: "12:30" },  // trùng
   { startTime: "07:00", endTime: "07:45" },  // không trùng
 ];

 const event = {
   startTime: "2024-03-20T10:00:00",
   endTime: "2024-03-20T11:30:00"
 };

 // Kiểm tra từng tiết học
 console.log('Tiết 9:00-10:30 có trùng không:', isLessonOverlapWithEvent(lessons[0], event));  // true
 console.log('Tiết 11:00-12:30 có trùng không:', isLessonOverlapWithEvent(lessons[1], event)); // true
 console.log('Tiết 7:00-7:45 có trùng không:', isLessonOverlapWithEvent(lessons[2], event));   // false

 // Hoặc lấy tất cả các tiết học trùng
 const overlappingLessons = findOverlappingLessons(lessons, event);
 console.log('Các tiết học trùng:', overlappingLessons);
 */

export function isDateBefore(
  dateOne: string | dayjs.Dayjs,
  dateTwo: string | dayjs.Dayjs,
): boolean {
  const firstDate = dayjs(dateOne);
  const secondDate = dayjs(dateTwo);

  return firstDate.isBefore(secondDate);
}

/**
 * Converts time in minutes to an object with hours and minutes
 * If minutes > 60, converts to hours and minutes
 * If minutes <= 60, returns minutes only
 * @param minutes Time in minutes
 * @returns Object with hour and minute properties
 */
export function convertMinutesToTime(minutes: number): {
  hour?: number;
  minute: number;
} {
  if (minutes > 60) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return { hour, minute };
  }
  return { minute: minutes };
}

export const resetTime = (date: dayjs.ConfigType = Globals.currentTime) => {
  return dayjs(date).utc().hour(17).minute(0).second(0).millisecond(0);
};

// ─── Mốc giờ `HH:mm` ──────────────────────────────────────────────────────────
// Toán cho bộ chọn giờ và các đơn tính theo giờ. Khác với nhóm hàm phía trên ở
// chỗ chúng không đi qua `dayjs`: `dayjs('18:00')` là ngày không hợp lệ, nên
// giờ-trong-ngày phải tự tách bằng số phút kể từ nửa đêm.

const HOURS_IN_DAY = 24;
const TIME_PAD_LENGTH = 2;
const PAD_CHARACTER = '0';
const TIME_PARTS = 2;

/** Bước phút mặc định của bộ chọn giờ. 5 phút là mức chấm công còn dùng tới. */
export const DEFAULT_MINUTE_STEP = 5;

/** `8` → `08`. */
export const padTime = (value: number) =>
  String(value).padStart(TIME_PAD_LENGTH, PAD_CHARACTER);

/** `HH:mm` thành số phút kể từ nửa đêm; `undefined` nếu chuỗi không hợp lệ. */
export const parseMinutes = (time: string): number | undefined => {
  const parts = time.split(':');
  if (parts.length !== TIME_PARTS) {
    return undefined;
  }
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  return Number.isFinite(hours) && Number.isFinite(minutes)
    ? hours * MINUTES_PER_HOUR + minutes
    : undefined;
};

/**
 * Ghép giờ và phút thành `HH:mm`.
 *
 * Tên không phải `formatTime` vì hàm đó đã có ở trên và nhận TỔNG SỐ GIÂY —
 * hai thứ khác nhau, đặt trùng tên là mời gọi gọi nhầm.
 */
export const formatHourMinute = (hour: number, minute: number) =>
  `${padTime(hour)}:${padTime(minute)}`;

/** Kéo phút lệch bước về mốc gần nhất: 17 với bước 5 → 15. */
export const toNearestMinuteStep = (minutes: number, step: number) =>
  Math.min(Math.round(minutes / step) * step, MINUTES_PER_HOUR - step);

/** Các giá trị của cột giờ: 0…23. */
export const buildHourValues = (): readonly number[] =>
  Array.from({ length: HOURS_IN_DAY }, (_, index) => index);

/** Các giá trị của cột phút theo bước đã cho, luôn dưới 60. */
export const buildMinuteValues = (step: number): readonly number[] =>
  Array.from(
    { length: Math.ceil(MINUTES_PER_HOUR / step) },
    (_, index) => index * step,
  );

/**
 * Tách `HH:mm` thành giờ và phút, phút đã kéo về đúng bước để luôn trùng một
 * dòng có thật trong cột. Chuỗi không hợp lệ thì coi như 00:00.
 *
 * Khác `convertMinutesToTime` phía trên: hàm đó nhận số phút và chỉ tách khi
 * lớn hơn 60, còn hàm này nhận chuỗi giờ-trong-ngày và luôn trả về cả hai phần.
 */
export const splitTime = (time: string, step: number) => {
  const minutes = parseMinutes(time) ?? 0;

  return {
    hour: Math.floor(minutes / MINUTES_PER_HOUR) % HOURS_IN_DAY,
    minute: toNearestMinuteStep(minutes % MINUTES_PER_HOUR, step),
  };
};
