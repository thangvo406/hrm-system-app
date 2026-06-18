import type { ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { StyleSheet, View } from 'react-native';
import React, { useImperativeHandle, useRef } from 'react';
import type { FlatList } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { ScaleSize } from '@kits/core';

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_INACTIVE = '#E0E0E0';
const DOT_ACTIVE = '#54C158';

type ItemWithId = { readonly id: string };

type Properties<T extends ItemWithId> = {
  readonly data: readonly T[];
  readonly horizontalPadding?: number;
  readonly itemWidth: number;
  readonly keyExtractor: (item: T, index: number) => string;
  readonly renderItem: ListRenderItem<T>;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
};

export type CarouselHandle = {
  readonly scrollToIndex: (index: number) => void;
};

type DotProps = {
  readonly index: number;
  readonly pageSize: number;
  readonly scrollX: SharedValue<number>;
};

function CarouselDot({ index, pageSize, scrollX }: DotProps) {
  const dotStyle = useAnimatedStyle(() => {
    const page = scrollX.value / pageSize;
    const distance = Math.abs(page - index);
    const ratio = Math.min(distance, 1);
    const width = interpolate(ratio, [0, 1], [DOT_ACTIVE_WIDTH, DOT_SIZE]);
    const backgroundColor = interpolateColor(
      ratio,
      [0, 1],
      [DOT_ACTIVE, DOT_INACTIVE],
    );
    return { backgroundColor, width };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
}

function CarouselInner<T extends ItemWithId>(
  {
    data,
    horizontalPadding = 0,
    itemWidth,
    keyExtractor,
    renderItem,
    style = undefined,
    testID = undefined,
  }: Properties<T>,
  ref: React.Ref<CarouselHandle>,
) {
  const scrollX = useSharedValue(0);
  const listReference = useRef<FlatList<T>>(null);

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        listReference.current?.scrollToOffset({
          animated: true,
          offset: index * itemWidth,
        });
      },
    }),
    [itemWidth],
  );

  const onScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View
      style={[styles.wrap, { paddingHorizontal: horizontalPadding }, style]}
      testID={testID}
    >
      <Animated.FlatList
        bounces={false}
        data={data}
        decelerationRate="fast"
        horizontal
        keyExtractor={keyExtractor}
        onScroll={onScroll}
        pagingEnabled
        ref={listReference}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
      />
      {data.length > 1 ? (
        <View style={styles.dots}>
          {data.map((item, index) => (
            <CarouselDot
              index={index}
              key={item.id}
              pageSize={itemWidth}
              scrollX={scrollX}
            />
          ))}
        </View>
      ) : undefined}
    </View>
  );
}

const Carousel = React.forwardRef(CarouselInner) as <T extends ItemWithId>(
  props: { readonly ref?: React.Ref<CarouselHandle> } & Properties<T>,
) => React.ReactElement;

export default Carousel;

const styles = StyleSheet.create({
  dot: {
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    marginHorizontal: ScaleSize(3),
    width: DOT_SIZE,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: ScaleSize(10),
  },
  wrap: {
    alignItems: 'center',
  },
});
