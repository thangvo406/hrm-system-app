import type { SourceCard } from '@hooks/useSourceOfFund';
import type { SharedValue } from 'react-native-reanimated';

import { ScaleSize } from '@kits/core';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Globals } from '@utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = ScaleSize(170);
const CARD_HEIGHT = ScaleSize(230);
const CARD_SPACING = ScaleSize(2);
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const UNFOCUSED_CARD_WIDTH = CARD_WIDTH * 0.88;

// Ordered pale → branded → coral so the branded card centers on open.
const CARD_COLORS: readonly string[] = ['#E4F2E0', '#256B3A', '#E27C74'];

type CardItemProps = {
  readonly card: SourceCard;
  readonly index: number;
  readonly scrollX: SharedValue<number>;
};

function CardItem({ card, index, scrollX }: CardItemProps) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const isBranded = index === 1;

  const animatedCardStyle = useAnimatedStyle(() => {
    const position = index * SNAP_INTERVAL;
    const distance = Math.abs(scrollX.value - position);
    const width = interpolate(
      distance,
      [0, SNAP_INTERVAL],
      [CARD_WIDTH, UNFOCUSED_CARD_WIDTH],
      'clamp',
    );
    const opacity = interpolate(
      distance,
      [0, SNAP_INTERVAL],
      [1, 0.65],
      'clamp',
    );
    return { opacity, width };
  });

  return (
    <View style={styles.cardSlot}>
      <Animated.View
        style={[styles.card, { backgroundColor: color }, animatedCardStyle]}
      >
        <View style={styles.cardTop}>
          {isBranded ? (
            <View style={styles.aliasTag}>
              <Text style={styles.aliasText}>{card.brand}</Text>
            </View>
          ) : (
            <View style={styles.aliasSpacer} />
          )}
          <View style={styles.networkTag}>
            <Text style={styles.networkText}>{card.network}</Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <Text
            numberOfLines={1}
            style={[
              styles.brand,
              { color: isBranded ? '#FFFFFF' : '#3A3A3A' },
            ]}
          >
            {card.brand}
          </Text>
          <Text
            style={[
              styles.number,
              { color: isBranded ? 'rgba(255,255,255,0.85)' : '#6B6B6B' },
            ]}
          >
            {card.maskedNumber}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

type Properties = {
  readonly cards: readonly SourceCard[];
  readonly initialIndex: number;
};

function CardCarousel({ cards, initialIndex }: Properties) {
  const scrollX = useSharedValue(initialIndex * SNAP_INTERVAL);

  const onScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      index,
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
    }),
    [],
  );

  return (
    <View style={styles.wrap}>
      <Animated.FlatList
        contentContainerStyle={styles.content}
        data={cards}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        horizontal
        initialScrollIndex={initialIndex}
        keyExtractor={item => item.id}
        onScroll={onScroll}
        renderItem={({ index, item }) => (
          <CardItem card={item} index={index} scrollX={scrollX} />
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        testID="source-of-fund-card-carousel"
        onTouchStart={() => {
          if (Globals.isScrollingRef) {
            Globals.isScrollingRef.current = true;
          }
        }}
        onScrollEndDrag={() => {
          if (Globals.isScrollingRef) {
            Globals.isScrollingRef.current = false;
          }
        }}
        onTouchCancel={() => {
          if (Globals.isScrollingRef) {
            Globals.isScrollingRef.current = false;
          }
        }}
        onTouchEnd={() => {
          if (Globals.isScrollingRef) {
            Globals.isScrollingRef.current = false;
          }
        }}
      />
    </View>
  );
}

export default React.memo(CardCarousel);

const styles = StyleSheet.create({
  aliasSpacer: {
    height: ScaleSize(24),
  },
  aliasTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  aliasText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  brand: {
    fontSize: ScaleSize(18),
    fontWeight: '800',
  },
  card: {
    borderRadius: ScaleSize(16),
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    padding: ScaleSize(18),
  },
  cardBottom: {
    gap: ScaleSize(6),
  },
  cardSlot: {
    alignItems: 'center',
    height: CARD_HEIGHT,
    marginRight: CARD_SPACING,
    width: CARD_WIDTH,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: SIDE_PADDING,
  },
  networkTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(4),
  },
  networkText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(11),
    fontWeight: '700',
  },
  number: {
    fontSize: ScaleSize(13),
    letterSpacing: ScaleSize(1),
  },
  wrap: {
    overflow: 'hidden',
    width: SCREEN_WIDTH - 30,
    alignSelf: 'center',
  },
});
