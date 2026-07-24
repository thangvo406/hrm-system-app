import type {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';

import { AppButton, PaginationDots } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Globals } from '@utils';

export type SourceCard = {
  readonly brand: string;
  readonly id: string;
  readonly maskedNumber: string;
  readonly network: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = ScaleSize(180);
const CARD_HEIGHT = ScaleSize(240);
// Slot narrower than the card so neighbouring cards sit tight against the
// focused one (smaller slot = less gap between cards).
const ITEM_WIDTH = ScaleSize(178);
const UNFOCUSED_SCALE = 0.82;
const UNFOCUSED_OPACITY = 0.55;

const CAROUSEL_MARGIN = ScaleSize(30);

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(20);
const DOT_ACTIVE_COLOR = '#256B3A';
const DOT_INACTIVE_COLOR = '#D7D7D7';
const DOT_GAP = ScaleSize(4);
const SELECTED_BORDER_COLOR = '#ff0fb7';

type CardTheme = {
  readonly bg: string;
  readonly network: string;
  readonly sub: string;
  readonly tag: string;
  readonly text: string;
};

// Ordered pale → branded → coral so the branded card centers on open.
const CARD_THEMES: readonly CardTheme[] = [
  {
    bg: '#E4F2E0',
    network: 'rgba(0, 0, 0, 0.08)',
    sub: '#A9C3AE',
    tag: 'rgba(255, 255, 255, 0.6)',
    text: '#8AA890',
  },
  {
    bg: '#256B3A',
    network: 'rgba(255, 255, 255, 0.25)',
    sub: 'rgba(255, 255, 255, 0.85)',
    tag: 'rgba(0, 0, 0, 0.22)',
    text: '#FFFFFF',
  },
  {
    bg: '#E27C74',
    network: 'rgba(0, 0, 0, 0.18)',
    sub: 'rgba(255, 255, 255, 0.9)',
    tag: 'rgba(0, 0, 0, 0.18)',
    text: '#FFFFFF',
  },
];

type CardItemProps = {
  readonly animationValue: SharedValue<number>;
  readonly card: SourceCard;
  readonly cardIndex: number;
  readonly onSelect: (id: string, cardIndex?: number) => void;
  readonly selected: boolean;
};

function CardItem({
  animationValue,
  card,
  cardIndex,
  onSelect,
  selected,
}: CardItemProps) {
  const theme = CARD_THEMES[cardIndex % CARD_THEMES.length];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [UNFOCUSED_SCALE, 1, UNFOCUSED_SCALE],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [UNFOCUSED_OPACITY, 1, UNFOCUSED_OPACITY],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <View style={styles.cardSlot}>
      <AppButton
        onPress={() => {
          onSelect(card.id, cardIndex);
        }}
        testID={`payment-card-${card.id}`}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.bg,
              borderWidth: selected ? 2 : 0,
              borderColor: SELECTED_BORDER_COLOR,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.aliasTag, { backgroundColor: theme.tag }]}>
              <Text style={[styles.aliasText, { color: theme.text }]}>
                {card.brand}
              </Text>
            </View>
            <View
              style={[styles.networkTag, { backgroundColor: theme.network }]}
            >
              <Text style={[styles.networkText, { color: theme.text }]}>
                {card.network}
              </Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text
              numberOfLines={1}
              style={[styles.brand, { color: theme.text }]}
            >
              {card.brand}
            </Text>
            <Text style={[styles.number, { color: theme.sub }]}>
              {card.maskedNumber}
            </Text>
          </View>
        </Animated.View>
      </AppButton>
    </View>
  );
}

type Properties = {
  readonly cards: readonly SourceCard[];
  readonly initialIndex: number;
  readonly onSelect: (id: string) => void;
  readonly selectedId: string | undefined;
};

function MembershipCards({
  cards,
  initialIndex,
  onSelect,
  selectedId,
}: Properties) {
  const { t } = useTranslation();
  const progress = useSharedValue(initialIndex);
  const carouselRef = useRef<ICarouselInstance>(null);
  const data = React.useMemo<SourceCard[]>(() => [...cards], [cards]);

  // Tapping a card both selects it and, if it isn't already focused
  // (e.g. a peeking neighbour), scrolls the carousel to center it.
  const handleSelect = useCallback(
    (id: string, index?: number) => {
      onSelect(id);
      carouselRef.current?.scrollTo({ animated: true, index });
    },
    [onSelect],
  );

  const renderItem = useCallback<CarouselRenderItem<SourceCard>>(
    ({ animationValue, index, item }) => (
      <CardItem
        animationValue={animationValue}
        card={item}
        cardIndex={index}
        onSelect={handleSelect}
        selected={item.id === selectedId}
      />
    ),
    [handleSelect, selectedId],
  );

  const onTouchStart = useCallback(() => {
    if (Globals.isScrollingRef) {
      Globals.isScrollingRef.current = true;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (Globals.isScrollingRef) {
      Globals.isScrollingRef.current = false;
    }
  }, []);

  return (
    <>
      <Text style={styles.label}>{t('source_of_fund.card')}</Text>
      <View style={styles.wrap}>
        <View
          onTouchCancel={onTouchEnd}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          <Carousel
            data={data}
            defaultIndex={initialIndex}
            height={CARD_HEIGHT}
            onProgressChange={(_, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            onSnapToItem={index => onSelect(data[index].id)}
            pagingEnabled
            loop={false}
            ref={carouselRef}
            renderItem={renderItem}
            style={styles.carousel}
            testID="payment-card-carousel"
            width={ITEM_WIDTH}
          />
        </View>
        <PaginationDots
          activeColor={DOT_ACTIVE_COLOR}
          activeWidth={DOT_ACTIVE_WIDTH}
          count={data.length}
          gap={DOT_GAP}
          inactiveColor={DOT_INACTIVE_COLOR}
          progress={progress}
          size={DOT_SIZE}
          style={styles.paginationRow}
        />
      </View>
    </>
  );
}

export default React.memo(MembershipCards);

const styles = StyleSheet.create({
  aliasTag: {
    borderRadius: ScaleSize(6),
    maxWidth: '70%',
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  aliasText: {
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
    width: CARD_WIDTH,
  },
  cardBottom: {
    gap: ScaleSize(6),
  },
  cardSlot: {
    alignItems: 'center',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    width: ITEM_WIDTH,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carousel: {
    justifyContent: 'center',
    marginHorizontal: CAROUSEL_MARGIN,
    width: SCREEN_WIDTH - CAROUSEL_MARGIN * 2,
  },
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
  },
  networkTag: {
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(4),
  },
  networkText: {
    fontSize: ScaleSize(11),
    fontWeight: '700',
  },
  number: {
    fontSize: ScaleSize(13),
    letterSpacing: ScaleSize(1),
  },
  paginationRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(14),
  },
  selectedBorder: {
    borderColor: SELECTED_BORDER_COLOR,
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(2.5),
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  wrap: {
    alignSelf: 'center',
    width: SCREEN_WIDTH,
  },
});
