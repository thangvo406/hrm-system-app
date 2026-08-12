import React, {
  useMemo,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from '@components';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import chunk from 'lodash/chunk';

const { ifAndroid, isIPadOrTablet } = DeviceUtils;
const STATUS_VALUES = {
  ONE: 1,
  THREE: 3,
  CUSTOM: 'custom',
};

export interface StatusFilterRef {
  reset: () => void;
  getValue: () => string;
}
const StatusFilter = React.forwardRef<StatusFilterRef, any>(
  (props: any, ref) => {
    const [statusSelected, setStatusSelected] = useState(STATUS_VALUES.ONE);
    const { onDataChange, dataInit, title, dataStatus, goFrom } = props || {};

    const { t } = useTranslation();

    const dataStatusOnus = useMemo(() => {
      return [
        {
          title: t('date_range_filter.one'),
          value: STATUS_VALUES.ONE,
        },
        {
          title: t('date_range_filter.custom'),
          value: STATUS_VALUES.CUSTOM,
        },
        {
          title: t('date_range_filter.three'),
          value: STATUS_VALUES.THREE,
        },
      ];
    }, [t]);

    const { containerItemStyle, containerStyle } = useMemo<any>(() => {
      if (goFrom == 'notify') {
        return {
          containerItemStyle: {
            width: '50%',
          },
          containerStyle: {
            height: ScaleSize(75),
          },
        };
      }
      return {};
    }, []);

    const reset = () => {
      setStatusSelected(STATUS_VALUES.ONE);
    };

    useEffect(() => {
      if (!dataInit) {
        return;
      }
      setStatusSelected(dataInit);
    }, [dataInit]);

    useEffect(() => {
      onDataChange?.(statusSelected);
    }, [statusSelected]);

    const getValue = () => statusSelected;

    useImperativeHandle(ref, () => ({
      reset,
      getValue,
    }));

    const data = useMemo(() => {
      const _data = dataStatus || dataStatusOnus;
      if (goFrom == 'notify') {
        return _data;
      }
      if (isIPadOrTablet()) {
        return _data;
      }
      return chunk(_data, 2);
    }, [dataStatus]);

    return (
      <View style={[styles.flex1, containerStyle]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.container}>
          {data?.map((item: any, index: number) => {
            if (!Array.isArray(item)) {
              return (
                <RadioButton
                  key={item.title}
                  label={item.title}
                  onPress={() => setStatusSelected(item.value)}
                  selected={item.value == statusSelected}
                  style={containerItemStyle}
                />
              );
            }
            return (
              <View key={`${index}`} style={styles.content}>
                {item.map((it: any, subIndex: number) => {
                  const bottom = subIndex == 0 ? ScaleSize(10) : 0;
                  return (
                    <RadioButton
                      key={it.title}
                      style={{
                        marginBottom: bottom,
                      }}
                      label={it.title}
                      onPress={() => setStatusSelected(it.value)}
                      selected={it.value == statusSelected}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  title: {
    fontSize: ScaleSize(14, 16),
    color: 'black',
    marginTop: ScaleSize(15),
    fontWeight: ifAndroid('bold', undefined),
  },
  content: {
    width: '50%',
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    // marginTop: ScaleSize(15),
    // alignItems: 'center',
    justifyContent: isIPadOrTablet() ? 'space-between' : 'flex-start',
  },
  flex1: {
    paddingHorizontal: ScaleSize(15),
    height: ScaleSize(110, 75),
  },
});
export default StatusFilter;
