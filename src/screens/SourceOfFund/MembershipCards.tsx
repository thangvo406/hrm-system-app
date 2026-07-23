import type { SourceCard } from '@hooks/useSourceOfFund';
import type { CarouselRenderItem } from 'react-native-reanimated-carousel';

import { ScaleSize } from '@kits/core';
import React, { useCallback } from 'react';
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

import AddPlaceholder from './AddPlaceholder';
import PaginationDots from './PaginationDots';

// Sentinel injected at index 0 so the "add card" tile leads the carousel.
const ADD_CARD_ID = '__add_card__';

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
  readonly addLabel: string;
  readonly animationValue: SharedValue<number>;
  readonly card: SourceCard;
  readonly cardIndex: number;
  readonly isAdd: boolean;
  readonly onAddPress: () => void;
};

function CardItem({
  addLabel,
  animationValue,
  card,
  cardIndex,
  isAdd,
  onAddPress,
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

  if (isAdd) {
    return (
      <View style={styles.cardSlot}>
        <Animated.View style={animatedStyle}>
          <AddPlaceholder
            height={CARD_HEIGHT}
            label={addLabel}
            onPress={onAddPress}
            testID="source-of-fund-add-card"
            width={CARD_WIDTH}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.cardSlot}>
      <Animated.View
        style={[styles.card, { backgroundColor: theme.bg }, animatedStyle]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.aliasTag, { backgroundColor: theme.tag }]}>
            <Text style={[styles.aliasText, { color: theme.text }]}>
              {card.brand}
            </Text>
          </View>
          <View style={[styles.networkTag, { backgroundColor: theme.network }]}>
            <Text style={[styles.networkText, { color: theme.text }]}>
              {card.network}
            </Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <Text numberOfLines={1} style={[styles.brand, { color: theme.text }]}>
            {card.brand}
          </Text>
          <Text style={[styles.number, { color: theme.sub }]}>
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
  readonly isShowUnRegister: boolean;
  readonly onRegisterCard: () => void;
};

function MembershipCards({
  cards,
  initialIndex,
  isShowUnRegister,
  onRegisterCard,
}: Properties) {
  const { t } = useTranslation();
  // Add tile leads the carousel, so the branded card keeps its centered slot.
  const focusedIndex = initialIndex + 1;
  const progress = useSharedValue(focusedIndex);

  const data = React.useMemo<SourceCard[]>(
    () => [
      { brand: '', id: ADD_CARD_ID, maskedNumber: '', network: '' },
      ...cards,
    ],
    [cards],
  );

  const renderItem = useCallback<CarouselRenderItem<SourceCard>>(
    ({ animationValue, index, item }) => (
      <CardItem
        addLabel={t('source_of_fund.add_card')}
        animationValue={animationValue}
        card={item}
        cardIndex={index - 1}
        isAdd={item.id === ADD_CARD_ID}
        onAddPress={onRegisterCard}
      />
    ),
    [onRegisterCard, t],
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

  if (isShowUnRegister) {
    return <></>;
  }

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
            defaultIndex={focusedIndex}
            height={CARD_HEIGHT}
            onProgressChange={(_, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            pagingEnabled
            loop={false}
            renderItem={renderItem}
            style={styles.carousel}
            testID="source-of-fund-card-carousel"
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
  wrap: {
    alignSelf: 'center',
    width: SCREEN_WIDTH,
  },
});
