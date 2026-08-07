import { useMemo, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import { DatePicker as DateComponent, Button } from '@components';
import { Colors } from '@constants';
import DateRangeFilter from './RangeFilter';
import dayjs from 'dayjs';
import { isNumber } from 'lodash';

const { ifAndroid, isIPadOrTablet, ifTablet } = DeviceUtils;
interface DatePickerProps {
  readonly onSubmit?: (data: any) => void;
  readonly buttonSubmitTitle?: string;
  readonly buttonCancelTitle?: string;
  readonly title?: string;
  readonly dateRange?: { from: any; to: any };
  readonly type?: string;
  readonly onCancel?: () => void;
  readonly onRequestClose?: () => void;
  readonly maxDate?: any;
}

function DatePicker({
  onSubmit,
  buttonSubmitTitle,
  buttonCancelTitle,
  title,
  onCancel,
  dateRange,
  type = '',
  onRequestClose,
  maxDate,
}: DatePickerProps) {
  const datePickerRef = useRef<any>(null);
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState();
  const [isShowBtnBottom, setShowBtnBottom] = useState(true);

  const onFilterChanged = (value: number) => {
    setFilterValue(value);
  };

  const dateRangeInit = useMemo(() => {
    return {
      // from: dateRange?.from || dayjs(),
      // to: dateRange?.to || dayjs(),
    };
  }, []);

  const getDateValue = () => {
    let dates;
    if (isNumber(filterValue)) {
      const start = dayjs();
      const last = start.add(filterValue, 'month');
      dates = [start.format('YYYY-MM-DD'), last.format('YYYY-MM-DD')];
    } else {
      const rangeDate = datePickerRef.current?.getRanges();
      dates = Object.keys(rangeDate || {});
    }
    return dates;
  };

  const onHideBtnBottom = (isHide: boolean) => {
    setShowBtnBottom(!isHide);
  };
  const _onCancel = () => {
    onRequestClose?.();
    onCancel?.();
  };
  const _onSubmit = () => {
    const dates = getDateValue();
    const lastWeek = dates.at(-1);
    onRequestClose?.();
    onSubmit?.({
      from: dates[0],
      to: lastWeek,
      ranges: dates,
      selected: datePickerRef.current?.getDateSelected(),
    });
  };

  const containerStyle = useMemo<ViewStyle>(() => {
    if (isIPadOrTablet()) {
      return {
        width: '80%',
        height: ScaleSize(ifTablet(600, 500)),
        borderRadius: ScaleSize(20),
      };
    }
    return {
      width: '100%',
    };
  }, []);

  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          {
            backgroundColor: 'white',
            height: ScaleSize(600),
          },
          containerStyle,
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <DateRangeFilter onDataChange={onFilterChanged} />
        <View
          pointerEvents="box-none"
          style={{
            zIndex: 2,
            width: '100%',
            flex: 1, // fill available space above button
          }}
        >
          <DateComponent
            maxDate={maxDate}
            dataInit={dateRangeInit}
            ref={datePickerRef}
            type={type}
            onHideBtnBottom={onHideBtnBottom}
          />
        </View>
        {!!isShowBtnBottom && (
          <View
            style={{
              flexDirection: 'row',
              gap: ScaleSize(10),
              marginTop: ScaleSize(10),
              marginHorizontal: ScaleSize(20),
              paddingBottom: ScaleSize(20),
            }}
          >
            {!!buttonCancelTitle && (
              <Button
                type="outline-bordered"
                title={buttonCancelTitle}
                onPress={_onCancel}
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  // zIndex: 1,
                }}
              />
            )}

            <Button
              type="rounded"
              title={buttonSubmitTitle || t('date.date_picker.button_submit')}
              onPress={_onSubmit}
              style={{
                // position: 'absolute',
                // bottom: 0,
                flex: 1,
                gap: 10,
                alignSelf: 'center',
                // zIndex: 1,
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  lineTop: {
    width: ScaleSize(70),
    height: ScaleSize(ifAndroid(5, 3)),
    position: 'absolute',
    top: ScaleSize(6),
    alignSelf: 'center',
    borderRadius: ScaleSize(10),
    // left: '35%',
    backgroundColor: Colors.gray11,
  },
  titleIpad: {
    fontSize: ScaleSize(28),
    color: 'black',
  },
  title: {
    fontSize: ScaleSize(18),
    color: 'black',
    fontWeight: 'bold',
    marginLeft: ScaleSize(15),
    zIndex: 1,
  },
  monthDisplay: {
    fontSize: ScaleSize(18),
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: ScaleSize(15),
  },
  cancel: {
    fontSize: ScaleSize(16),
    color: 'black',
    fontWeight: 'bold',
  },
  containerWeek: {
    //   width: ScaleSize(50),
    height: ScaleSize(30),
    paddingHorizontal: ScaleSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: ScaleSize(8),
    borderColor: Colors.gray2,
  },
  textWeek: {
    fontSize: ScaleSize(16),
    color: Colors.gray10,
  },
  day: {
    fontSize: ScaleSize(16),
    color: 'black',
    fontWeight: 'bold',
  },
});
export default DatePicker;
