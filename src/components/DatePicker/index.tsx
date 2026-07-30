import type { RefObject } from 'react';
import Button from '@components/Button';
import { ScaleSize } from '@kits/core';
import { Globals } from '@utils';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import React, {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { DeviceUtils } from '@kits/core/utils';
import {
  getRangeDateByRange,
  getRangeDateByWeek,
  getSingleDate,
  resetTime,
  getMonday,
  isSameDay,
} from '@utils/date';
import { AppConstants, Colors } from '@constants';
import AppButton from '../AppButton';
import { ScrollView } from 'react-native-gesture-handler';
import Image from '../Image';
const { ifIPadOrTablet, ifIphoneX } = DeviceUtils;

export interface DatePickerRef {
  reset: () => void;
  getValue: () => { from: any; to: any };
  getRanges: () => any;
  getDateSelected: () => any;
}

const FUNCTION_RANGE_DATE = {
  choose_week: getRangeDateByWeek,
  default: getRangeDateByRange,
  single: getSingleDate,
};
const currentYear = 2070;
const startYear = 1970;
const YearList = memo(
  ({
    selectedYear,
    onSelect,
  }: {
    readonly selectedYear: number;
    readonly onSelect: (year: number) => void;
  }) => {
    const years = useMemo(
      () =>
        Array.from(
          { length: currentYear - startYear + 1 },
          (_, i) => startYear + i,
        ),
      [currentYear],
    );
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
      const itemHeight = ScaleSize(40);
      const marginVertical = ScaleSize(10);
      const totalItemHeight = itemHeight + marginVertical * 2;

      if (scrollRef.current) {
        const index = years.indexOf(selectedYear);
        if (index !== -1) {
          // Scroll center? Or top? Previous code was top
          setTimeout(() => {
            scrollRef.current?.scrollTo({
              y: index * totalItemHeight,
              animated: false,
            });
          }, 100);
        }
      }
    }, []); // Run once on mount of this component to scroll to initial

    return (
      <View style={styles.columnWrapper}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.columnContent}
          showsVerticalScrollIndicator={false}
        >
          {years.map(item => {
            const isSelected = item === selectedYear;
            return (
              <AppButton
                key={item}
                style={[
                  styles.pickerItem,
                  isSelected && styles.selectedPickerItem,
                ]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.selectedPickerItemText,
                  ]}
                >
                  {item}
                </Text>
              </AppButton>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const MonthList = memo(
  ({
    selectedMonth,
    onSelect,
  }: {
    readonly selectedMonth: number;
    readonly onSelect: (month: number) => void;
  }) => {
    const { i18n } = useTranslation();
    const months = useMemo(
      () => Array.from({ length: 12 }, (_, i) => dayjs().month(i)),
      [],
    );
    const scrollRef = useRef<ScrollView>(null);

    const isVi = useMemo(() => {
      return i18n.language.includes('vi');
    }, [i18n.language]);

    useEffect(() => {
      const itemHeight = ScaleSize(40);
      const marginVertical = ScaleSize(10);
      const totalItemHeight = itemHeight + marginVertical * 2;

      if (scrollRef.current) {
        // const index = months.indexOf(selectedMonth);
        const index = selectedMonth - 1;
        if (index >= 0) {
          setTimeout(() => {
            scrollRef.current?.scrollTo({
              y: index * totalItemHeight,
              animated: false,
            });
          }, 100);
        }
      }
    }, []);

    return (
      <View style={styles.columnWrapper}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.columnContent}
          showsVerticalScrollIndicator={false}
        >
          {months.map(item => {
            const isSelected = item.month() + 1 === selectedMonth;
            return (
              <AppButton
                key={item.month()}
                style={[
                  styles.pickerItem,
                  isSelected && styles.selectedPickerItem,
                ]}
                onPress={() => onSelect(item.month() + 1)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.selectedPickerItemText,
                  ]}
                >
                  {item.locale(isVi ? 'vi' : 'en').format('MMMM')}
                </Text>
              </AppButton>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const MonthYearSelection = memo(
  ({
    currentDate,
    onChange,
    onClose,
  }: {
    readonly currentDate: any;
    readonly onChange: (date: string) => void;
    readonly onClose: () => void;
  }) => {
    const { t, i18n } = useTranslation();
    const [internalDate, setInternalDate] = useState(currentDate);

    useEffect(() => {
      setInternalDate(currentDate);
    }, [currentDate]);

    const dateRef = useRef(internalDate);
    dateRef.current = internalDate;

    const isVi = useMemo(() => {
      return i18n.language.includes('vi');
    }, [i18n.language]);

    const handleSelectYear = useMemo(
      () => (item: number) => {
        const current = dateRef.current;
        const newDate = dayjs(current).set('year', item).format('YYYY-MM-DD');
        setInternalDate(newDate);
        // onChange(newDate); // Defer update
      },
      [],
    );

    const handleSelectMonth = useMemo(
      () => (item: number) => {
        const current = dateRef.current;
        const newDate = dayjs(current)
          .set('month', item - 1)
          .format('YYYY-MM-DD');
        setInternalDate(newDate);
        // onChange(newDate); // Defer update
      },
      [],
    );

    const onConfirm = () => {
      onChange(internalDate);
      onClose();
    };

    const currentYearVal = new Date(internalDate).getFullYear();
    const currentMonthVal = new Date(internalDate).getMonth() + 1;

    return (
      <View style={styles.yearPickerOverlay}>
        <View style={styles.yearPickerHeader}>
          <Text style={styles.yearPickerTitle}>
            {dayjs(internalDate)
              .locale(isVi ? 'vi' : 'en')
              .format('MMMM,  YYYY')}
          </Text>
          <AppButton onPress={onClose} hitSlop={AppConstants.HIS_SLOP_BUTTON}>
            {/* Hidden close icon since we have buttons now, or keep it as alternative */}
            <Text
              style={{ fontSize: ScaleSize(14), color: 'black', opacity: 0 }}
            >
              ▲
            </Text>
          </AppButton>
        </View>
        <View
          style={[
            styles.pickerBody,
            {
              marginBottom: ScaleSize(90),
            },
          ]}
        >
          <MonthList
            selectedMonth={currentMonthVal}
            onSelect={handleSelectMonth}
          />
          <YearList selectedYear={currentYearVal} onSelect={handleSelectYear} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: ScaleSize(10, 20),
            marginTop: ScaleSize(40, 20),
            marginBottom: ScaleSize(20),
            position: 'absolute',
            // bottom: !insets.bottom ? ScaleSize(30) : 0,
            bottom: 0,
            width: '100%',
            backgroundColor: Colors.white,
          }}
        >
          <Button
            type="rounded"
            title={t('common.popup.btn_close')}
            outlet
            onPress={onClose}
            style={{
              width: ifIPadOrTablet('20%', '47%'),
            }}
          />
          <Button
            type="rounded"
            title={t('common.popup.btn_done')}
            onPress={onConfirm}
            style={{
              width: ifIPadOrTablet('78%', '47%'),
            }}
          />
        </View>
      </View>
    );
  },
);

type DatePickerHeaderContextValue = {
  readonly setShowYearPicker: (value: boolean) => void;
  readonly showYearPicker: boolean;
  readonly title?: string;
  readonly updateMonthFunc: RefObject<
    ((value: number) => void) | null | undefined
  >;
};

const DatePickerHeaderContext = createContext<DatePickerHeaderContextValue>({
  setShowYearPicker: () => undefined,
  showYearPicker: false,
  title: undefined,
  updateMonthFunc: { current: undefined },
});

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function DateDisplay({
  addMonth,
  month,
}: {
  readonly addMonth?: (value: number) => void;
  readonly month: any;
}) {
  const { i18n } = useTranslation();
  const { setShowYearPicker, showYearPicker } = useContext(
    DatePickerHeaderContext,
  );
  const opacityMonth = useRef(new Animated.Value(1)).current;
  const displayMonth = useMemo(() => {
    const isEnglish = !i18n.language?.includes('vi');
    return dayjs(month)
      .locale(isEnglish ? 'en' : 'vi')
      .format('MMMM,  YYYY');
  }, [month, i18n.language]);

  useEffect(() => {
    return () => {
      opacityMonth.stopAnimation();
      opacityMonth.setValue(1);
    };
  }, [opacityMonth]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!showYearPicker && (
        <AppButton
          onPress={() => addMonth?.(-1)}
          hitSlop={AppConstants.HIS_SLOP_BUTTON}
        >
          <Image
            type="svg"
            name="ic_arrow_left_gray"
            color={Colors.gray1}
            width={ScaleSize(18)}
            height={ScaleSize(18)}
          />
        </AppButton>
      )}
      <AppButton
        onPress={() => setShowYearPicker(!showYearPicker)}
        style={{
          flexDirection: 'row',
          paddingHorizontal: ScaleSize(15),
          alignItems: 'center',
        }}
      >
        <Animated.Text style={[styles.monthDisplay, { opacity: opacityMonth }]}>
          {displayMonth}
        </Animated.Text>
        <Image
          name="ic_chevron_down"
          type="svg"
          width={ScaleSize(18)}
          height={ScaleSize(18)}
          color={Colors.gray1}
        />
      </AppButton>
      {!showYearPicker && (
        <AppButton onPress={() => addMonth?.(1)}>
          <Image
            type="svg"
            name="ic_chevron_right"
            width={ScaleSize(18)}
            height={ScaleSize(18)}
            color={Colors.gray1}
          />
        </AppButton>
      )}
    </View>
  );
}

function Header({
  addMonth,
  month,
}: {
  readonly addMonth?: (value: number) => void;
  readonly month: any;
}) {
  const { t } = useTranslation();
  const { showYearPicker, title, updateMonthFunc } = useContext(
    DatePickerHeaderContext,
  );
  updateMonthFunc.current = addMonth;

  const dayNames = useMemo(
    () =>
      DAY_KEYS.map(day => ({
        key: day,
        label: t(`date.date_range.${day}`),
      })),
    [t],
  );

  return (
    <View>
      {title ? <Text style={styles.title}>{title}</Text> : undefined}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: ScaleSize(15, 20),
          paddingRight: ScaleSize(10, 15),
        }}
      >
        <DateDisplay addMonth={addMonth} month={month} />
      </View>
      {!showYearPicker && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            paddingHorizontal: ScaleSize(19, 30),
            marginVertical: ScaleSize(15),
          }}
        >
          {dayNames.map(({ key, label }) => (
            <Text key={key} style={styles.day}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const DatePicker = React.forwardRef<DatePickerRef, any>((props, ref) => {
  const { onDateChange, maxDate, onRangeChange, dataInit, type, title } =
    props || {};
  const [currentDate, setCurrentDate] = useState(
    maxDate ||
      dataInit?.from?.format?.('YYYY-MM-DD') ||
      dayjs().format('YYYY-MM-DD'),
  );
  const [calendarKey, setCalendarKey] = useState(0); // key to force re-render
  const defaultValue = useMemo(() => {
    if (type == 'single') {
      return [dayjs(dataInit?.from).format('YYYY-MM-DD')];
    }
    if (maxDate) {
      const today = dayjs(maxDate);
      const lastWeek = today.subtract(1, 'week');
      return [lastWeek, today];
    }
    const monday = getMonday(new Date(Globals.currentTime).getTime());
    const result = [monday];
    const lastWeek = new Date(monday);
    lastWeek.setDate(lastWeek.getDate() + 6);
    result.push(lastWeek);
    return result;
  }, []);
  const [selectedDates, setSelectedDates] = useState(defaultValue);
  const updateMonthFunc = useRef<(value: number) => void>(null);
  const dateShowing = useRef(new Date(Globals.currentTime));
  const dateSelected = useRef(Globals.currentTime);

  useEffect(() => {
    onDateChange?.(selectedDates);
  }, [selectedDates]);

  useEffect(() => {
    if (!dataInit?.from) {
      return;
    }

    // const currentMonth = new Date(Globals.currentTime).getMonth() + 1;
    // const _selectedDates = new Date(dataInit?.from);
    // const selectedMonth = _selectedDates.getMonth() + 1;
    // const currentYear = new Date(Globals.currentTime).getFullYear();
    // const selectedYear = _selectedDates.getFullYear();
    // let value = selectedMonth - currentMonth;
    // if (currentYear != selectedYear) {
    //    value = currentYear - selectedYear < 0 ? (
    //          12 -
    //          currentMonth +
    //          selectedMonth +
    //          (_selectedDates.getFullYear() - new Date(Globals.currentTime).getFullYear() - 1) * 12
    //       ) : -(
    //          currentMonth -
    //          selectedMonth +
    //          (new Date(Globals.currentTime).getFullYear() - _selectedDates.getFullYear()) * 12
    //       );
    // }
    // updateMonthFunc.current?.(value);
    // setCurrentDate(dataInit?.from);
    // setCalendarKey()
  }, [dataInit]);

  const rangeDate = useMemo(() => {
    const func =
      FUNCTION_RANGE_DATE[type as keyof typeof FUNCTION_RANGE_DATE] ||
      FUNCTION_RANGE_DATE.default;
    return func(selectedDates, dateSelected.current);
  }, [type, selectedDates]);

  useEffect(() => {
    onRangeChange?.(rangeDate);
  }, [rangeDate]);

  const markedDates = useMemo(() => {
    const today = dayjs(Globals.currentTime).format('YYYY-MM-DD');
    return {
      ...rangeDate,
      [today]: {
        ...rangeDate?.[today],
        marked: true,
      },
    };
  }, [rangeDate]);

  useEffect(() => {
    if (!dataInit?.from) {
      return;
    }
    dateSelected.current = dataInit?.from;
    let to = dataInit?.to;
    if (isSameDay(dataInit?.from, dataInit?.to)) {
      to = dataInit.from;
    }
    const _to = to && typeof to === 'string' ? dayjs(to) : to;
    const finalTo = !_to
      ? dayjs(Globals.currentTime)
      : resetTime(_to?.format('YYYY-MM-DD'));
    setSelectedDates([dataInit?.from, finalTo]);
    let initDate = dayjs(dataInit?.from).format('YYYY-MM-DD');
    if (type != 'single' && maxDate) {
      initDate = maxDate;
    }
    setCurrentDate(initDate);
    setCalendarKey(prev => prev + 1);
  }, [dataInit]);

  const getValue = (isParseDate = true) => {
    const temp = [...selectedDates];
    const min = Math.min(...temp);
    let max = Math.max(...temp);
    const maxDate = dayjs(max)
      .set('hour', 23)
      .set('minute', 59)
      .set('second', 59)
      .set('millisecond', 999);
    max = maxDate.toISOString();
    return {
      from: isParseDate ? dayjs(min) : min,
      to: isParseDate ? dayjs(max) : max,
    };
  };

  useImperativeHandle(ref, () => ({
    getValue,
    getRanges: () => rangeDate,
    getDateSelected: () => dateSelected.current,
  }));

  const [showYearPicker, setShowYearPicker] = useState(false);

  const onDayChange = (day: any) => {
    let temp = [...selectedDates];

    const selectedDate = new Date(day.dateString);
    if (temp?.length == 2) {
      temp = [selectedDate];
    } else {
      temp.push(selectedDate);
    }
    dateSelected.current = day.dateString;
    setSelectedDates(temp as any);
  };

  const handleDateChangeFromPicker = useMemo(
    () => (newDate: string) => {
      setCurrentDate(newDate);
      dateShowing.current = new Date(newDate);
      setCalendarKey(prev => prev + 1);
    },
    [],
  );

  const headerContextValue = useMemo(
    () => ({ setShowYearPicker, showYearPicker, title, updateMonthFunc }),
    [showYearPicker, title],
  );

  return (
    <DatePickerHeaderContext.Provider value={headerContextValue}>
      <View
        pointerEvents="box-none"
        style={{
          flex: 1,
        }}
      >
        <Calendar
          scrollEnabled={!showYearPicker}
          markingType="period"
          key={calendarKey} // force re-render
          showScrollIndicator
          current={currentDate}
          horizontal
          enableSwipeMonths={!showYearPicker}
          maxDate={maxDate}
          firstDay={1}
          onMonthChange={(month: any) => {
            dateShowing.current = month;
          }}
          theme={{
            textDayFontSize: ScaleSize(14),
            textMonthFontSize: ScaleSize(14),
            dayTextColor: 'black',
            textDayFontWeight: '400',
            //   todayBackgroundColor: Colors.green03,
            todayTextColor: Colors.primary,
            dotColor: Colors.primary,
          }}
          customHeader={Header}
          markedDates={markedDates}
          onDayPress={onDayChange}
        />
        {showYearPicker ? (
          <MonthYearSelection
            currentDate={currentDate}
            onChange={handleDateChangeFromPicker}
            onClose={() => setShowYearPicker(false)}
          />
        ) : undefined}
      </View>
    </DatePickerHeaderContext.Provider>
  );
});

const styles = StyleSheet.create({
  monthDisplay: {
    fontSize: ScaleSize(18),
    color: 'black',
    fontWeight: 'bold',
    paddingRight: ScaleSize(8),
    textTransform: 'capitalize',
  },
  title: {
    fontSize: ScaleSize(14, 16),
    color: 'black',
    fontWeight: 'bold',
    paddingHorizontal: ScaleSize(15),
    marginVertical: ScaleSize(15),
  },
  day: {
    fontSize: ScaleSize(14),
    color: 'black',
    // fontWeight: ifAndroid('bold',undefined),
  },
  containerWeek: {
    //   width: ScaleSize(50),
    height: ScaleSize(30),
    paddingHorizontal: ScaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: ScaleSize(8),
    borderColor: Colors.gray12,
  },
  textWeek: {
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
    color: Colors.gray10,
  },
  yearPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: ScaleSize(ifIphoneX(-35, 0), -20),
    backgroundColor: Colors.white, // Or a semi-transparent background
    zIndex: 10, // Ensure it's above the calendar
    borderColor: Colors.gray12,
  },
  yearPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScaleSize(30),
    paddingVertical: ScaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray12,
  },
  yearPickerTitle: {
    fontSize: ScaleSize(18),
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  pickerBody: {
    flexDirection: 'row',
    flex: 1,
  },
  columnWrapper: {
    flex: 1,
    height: '100%',
  },
  columnContent: {
    paddingVertical: ScaleSize(10),
    paddingHorizontal: ScaleSize(10),
    alignItems: 'center',
  },
  pickerItem: {
    width: '100%',
    height: ScaleSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: ScaleSize(10),
    borderRadius: ScaleSize(8),
    // borderWidth: 1,
    // borderColor: Colors.gray2,
  },
  selectedPickerItem: {
    backgroundColor: Colors.primary,
    // borderColor: Colors.primary,
  },
  pickerItemText: {
    fontSize: ScaleSize(16),
    color: Colors.black,
    textTransform: 'capitalize',
  },
  selectedPickerItemText: {
    color: Colors.white,
  },
});
export default React.memo(DatePicker);
