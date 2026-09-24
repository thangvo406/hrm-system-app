import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import React, { useCallback, useRef } from 'react';
import { Colors } from '@constants';
import { padTime } from '@utils/date';
import { ScaleSize } from '@kits/core';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';

export const ITEM_HEIGHT = ScaleSize(44);
/** Số dòng thấy được; phải là số lẻ để có đúng một dòng nằm giữa. */
export const VISIBLE_ROWS = 5;
export const EDGE_ROWS = (VISIBLE_ROWS - 1) / 2;

const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

type Properties = {
  readonly onChange: (value: number) => void;
  readonly testID: string;
  readonly value: number;
  readonly values: readonly number[];
};

/**
 * Một cột cuộn có dòng giữa là giá trị đang chọn.
 *
 * Dùng `snapToInterval` của chính `ScrollView` thay vì tự tính quán tính:
 * native lo phần hãm, JS chỉ đọc lại vị trí khi dừng hẳn.
 */
function TimeColumn({ onChange, testID, value, values }: Properties) {
  const scrollReference = useRef<ScrollView>(null);
  const initialIndexRef = useRef(Math.max(values.indexOf(value), 0));
  const hasScrolledRef = useRef(false);

  /**
   * `contentOffset` là prop CHỈ iOS, Android bỏ qua nên cột sẽ mở ở 00 thay vì
   * giá trị đang chọn. Cuộn tay đúng một lần sau khi đã có kích thước nội dung
   * — `onContentSizeChange` chạy trước khung hình đầu nên không thấy nhảy.
   */
  const onContentSizeChange = useCallback(() => {
    if (hasScrolledRef.current) {
      return;
    }
    hasScrolledRef.current = true;
    scrollReference.current?.scrollTo({
      animated: false,
      y: initialIndexRef.current * ITEM_HEIGHT,
    });
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
      const next = values[Math.min(Math.max(index, 0), values.length - 1)];
      if (next !== undefined) {
        onChange(next);
      }
    },
    [onChange, values],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentOffset={{ x: 0, y: initialIndexRef.current * ITEM_HEIGHT }}
      decelerationRate="fast"
      onContentSizeChange={onContentSizeChange}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ref={scrollReference}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      style={styles.container}
      testID={testID}
    >
      {values.map(item => (
        <View key={item} style={styles.item}>
          <Text style={[styles.label, item === value && styles.labelActive]}>
            {padTime(item)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default React.memo(TimeColumn);

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    height: LIST_HEIGHT,
    width: ScaleSize(72),
  },
  // Chừa nửa khung trên/dưới để dòng đầu và dòng cuối cũng lên được giữa.
  content: {
    paddingVertical: ITEM_HEIGHT * EDGE_ROWS,
  },
  item: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(20),
  },
  labelActive: {
    color: Colors.navy04,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
});
