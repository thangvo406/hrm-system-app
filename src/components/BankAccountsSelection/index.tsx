import type {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import type { IAccount } from '@type';
import type { SharedValue } from 'react-native-reanimated';

import { AddPlaceholder, AppButton, Image, PaginationDots } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import RequestAddCard from '@dialogs/RequestAddCard';
import AppNavigator from '@navigation/AppNavigator';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Globals } from '@utils';
import { formatCurrency } from '@utils/product';

// Sentinel appended after the real methods so the "add" tile trails the list.
const ADD_CARD_ID = '__add_card__';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = ScaleSize(180);
const CARD_HEIGHT = ScaleSize(240);
// Slot narrower than the card so neighbouring methods sit tight against the
// focused one (smaller slot = less gap between cards).
const ITEM_WIDTH = ScaleSize(178);
const UNFOCUSED_SCALE = 0.82;
const UNFOCUSED_OPACITY = 0.55;
const CAROUSEL_MARGIN = ScaleSize(30);
const CHECK_SIZE = ScaleSize(13);

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(20);
const DOT_ACTIVE_COLOR = '#256B3A';
const DOT_INACTIVE_COLOR = '#D7D7D7';
const DOT_GAP = ScaleSize(4);

// Each payment-method `type` maps to its own badge label + solid theme so a
// card reads at a glance (deep green wallet, green card, indigo bank).
type MethodStyle = {
  readonly badgeKey: string;
  readonly bg: string;
  readonly sub: string;
  readonly tag: string;
  readonly text: string;
};

const DEFAULT_STYLE: MethodStyle = {
  badgeKey: 'payment.badge_card',
  bg: '#3C8459',
  sub: 'rgba(255, 255, 255, 0.85)',
  tag: 'rgba(255, 255, 255, 0.22)',
  text: '#FFFFFF',
};

const METHOD_STYLES: Record<string, MethodStyle> = {
  BANK_ACCOUNT: {
    badgeKey: 'payment.badge_bank',
    bg: '#5A62B0',
    sub: 'rgba(255, 255, 255, 0.85)',
    tag: 'rgba(255, 255, 255, 0.22)',
    text: '#FFFFFF',
  },
  COOP_BALANCE: {
    badgeKey: 'payment.badge_coop_balance',
    bg: '#5A62B0',
    sub: 'rgba(255, 255, 255, 0.3)',
    tag: 'rgba(255, 255, 255, 0.22)',
    text: '#FFFFFF',
  },
  CARD: {
    badgeKey: 'payment.badge_card',
    bg: '#3C8459',
    sub: 'rgba(255, 255, 255, 0.85)',
    tag: 'rgba(255, 255, 255, 0.22)',
    text: '#FFFFFF',
  },
  PAY_MONEY: {
    badgeKey: 'payment.badge_pay_money',
    bg: '#1F6E38',
    sub: 'rgba(255, 255, 255, 0.85)',
    tag: 'rgba(0, 0, 0, 0.22)',
    text: '#FFFFFF',
  },
};

const getMethodStyle = (type: string): MethodStyle =>
  METHOD_STYLES[type?.toUpperCase()] ?? DEFAULT_STYLE;

type CardItemProps = {
  readonly addLabel: string;
  readonly amount?: string;
  readonly animationValue: SharedValue<number>;
  readonly card: IAccount;
  readonly isAdd: boolean;
  readonly onAddPress: () => void;
  readonly onAmountChange?: (value: string) => void;
  readonly onSelect: (item: any, index: number) => void;
  readonly selected: boolean;
  readonly showAmountInput?: boolean;
  readonly slotIndex: number;
};

function CardItem({
  addLabel,
  amount,
  animationValue,
  card,
  isAdd,
  onAddPress,
  onAmountChange,
  onSelect,
  selected,
  showAmountInput,
  slotIndex,
}: CardItemProps) {
  const { t } = useTranslation();

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
            testID="bank-accounts-add"
            width={CARD_WIDTH}
            containerStyle={{
              backgroundColor: Colors.green03,
            }}
            labelStyle={{
              color: Colors.green04,
            }}
            plusStyle={{
              backgroundColor: Colors.green04,
            }}
          />
        </Animated.View>
      </View>
    );
  }

  const theme = getMethodStyle(card.type);
  return (
    <View style={styles.cardSlot}>
      <Animated.View style={animatedStyle}>
        <AppButton
          onPress={() => onSelect(card, slotIndex)}
          testID={`bank-account-${card.id}`}
        >
          <View
            style={[
              styles.card,
              { backgroundColor: theme.bg },
              selected && styles.cardSelected,
            ]}
          >
            <View style={styles.cardTop}>
              <View style={[styles.badge, { backgroundColor: theme.tag }]}>
                <Text style={[styles.badgeText, { color: theme.text }]}>
                  {t(theme.badgeKey)}
                </Text>
              </View>
              <View style={[styles.circle, selected && styles.circleSelected]}>
                {selected ? (
                  <Image
                    color={Colors.green01}
                    height={CHECK_SIZE}
                    name="ic_check"
                    type="svg"
                    width={CHECK_SIZE}
                  />
                ) : undefined}
              </View>
            </View>

            <View style={styles.cardBottomWrap}>
              {showAmountInput ? (
                <View style={styles.amountRow}>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={onAmountChange}
                    placeholder={t('payment.amount_input_placeholder')}
                    placeholderTextColor={theme.sub}
                    style={[styles.amountInput, { color: theme.text }]}
                    testID={`bank-account-amount-${card.id}`}
                    value={formatCurrency(amount)}
                  />
                  <Text style={[styles.amountUnit, { color: theme.text }]}>
                    {t('payment.won_unit')}
                  </Text>
                </View>
              ) : undefined}

              <View style={styles.cardBottom}>
                <Text
                  numberOfLines={1}
                  style={[styles.brand, { color: theme.text }]}
                >
                  {card.displayName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.number, { color: theme.sub }]}
                >
                  {card.displayNumber}
                </Text>
              </View>
            </View>
          </View>
        </AppButton>
      </Animated.View>
    </View>
  );
}

type Properties = {
  readonly amount?: string;
  readonly cards: readonly IAccount[];
  readonly hideAddCard?: boolean;
  readonly initialIndex: number;
  readonly onAmountChange?: (value: string) => void;
  readonly onSelect: (item: any) => void;
  readonly selectedId: string | undefined;
  readonly showAmountInput?: boolean;
};

function BankAccounts({
  amount,
  cards,
  hideAddCard,
  initialIndex,
  onAmountChange,
  onSelect,
  selectedId,
  showAmountInput,
}: Properties) {
  const { t } = useTranslation();
  const carouselRef = useRef<ICarouselInstance>(null);
  const focusedIndex = cards.length > 0 ? initialIndex : 0;
  const progress = useSharedValue(focusedIndex);

  // The add tile trails the real methods so it never steals a card's slot;
  // dropping it entirely leaves the real methods' indices untouched.
  const data = React.useMemo<IAccount[]>(
    () =>
      hideAddCard ? [...cards] : [...cards, { id: ADD_CARD_ID } as IAccount],
    [cards, hideAddCard],
  );

  const onAdd = useCallback(() => {
    AppNavigator.showDialog({ isFullScreen: true, screen: RequestAddCard });
  }, []);

  // Tapping a method selects it and centres it if it was a peeking neighbour.
  const handleSelect = useCallback(
    (card: any, index: number) => {
      onSelect(card);
      carouselRef.current?.scrollTo({ animated: true, index });
    },
    [onSelect],
  );
  const renderItem = useCallback<CarouselRenderItem<IAccount>>(
    ({ animationValue, index, item }) => (
      <CardItem
        addLabel={t('payment.add_method')}
        amount={amount}
        animationValue={animationValue}
        card={item}
        isAdd={item.id === ADD_CARD_ID}
        onAddPress={onAdd}
        onAmountChange={onAmountChange}
        onSelect={handleSelect}
        selected={String(item.id) == selectedId}
        showAmountInput={showAmountInput}
        slotIndex={index}
      />
    ),
    [
      amount,
      handleSelect,
      onAdd,
      onAmountChange,
      selectedId,
      showAmountInput,
      t,
    ],
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
    <View style={styles.wrap}>
      <Text style={styles.labelBankAccount}>{t('payment.coop_pay_label')}</Text>
      <View
        onTouchCancel={onTouchEnd}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
      >
        <Carousel
          data={data}
          defaultIndex={focusedIndex}
          height={CARD_HEIGHT}
          loop={false}
          onProgressChange={(_, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          onSnapToItem={index => {
            const item = data[index];
            if (item && item.id !== ADD_CARD_ID) {
              onSelect(item);
            }
          }}
          pagingEnabled
          ref={carouselRef}
          renderItem={renderItem}
          style={styles.carousel}
          testID="bank-accounts-carousel"
          width={ITEM_WIDTH}
        />
      </View>
      {data.length > 1 ? (
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
      ) : undefined}
    </View>
  );
}

export default React.memo(BankAccounts);

const styles = StyleSheet.create({
  amountInput: {
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '700',
    padding: 0,
    textAlign: 'right',
  },
  amountRow: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: ScaleSize(1),
    flexDirection: 'row',
    gap: ScaleSize(4),
    paddingBottom: ScaleSize(6),
  },
  amountUnit: {
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  badge: {
    borderRadius: ScaleSize(6),
    maxWidth: '80%',
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  labelBankAccount: {
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
    color: Colors.green04,
    // marginVertical: ScaleSize(18),
    marginBottom: ScaleSize(18),
    marginLeft: ScaleSize(18),
  },
  badgeText: {
    fontSize: ScaleSize(11),
    fontWeight: '700',
    letterSpacing: ScaleSize(0.5),
  },
  brand: {
    fontSize: ScaleSize(18),
    fontWeight: '800',
  },
  card: {
    borderColor: 'transparent',
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(2),
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    padding: ScaleSize(18),
    width: CARD_WIDTH,
  },
  cardBottom: {
    gap: ScaleSize(6),
  },
  cardBottomWrap: {
    gap: ScaleSize(14),
  },
  cardSelected: {
    borderColor: '#FFFFFF',
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
  circle: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: ScaleSize(12),
    borderWidth: ScaleSize(1.5),
    height: ScaleSize(24),
    justifyContent: 'center',
    width: ScaleSize(24),
  },
  circleSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
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
