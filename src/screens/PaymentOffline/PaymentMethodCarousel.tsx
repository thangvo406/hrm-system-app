import type {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import type {
  IPaymentMethod,
  PaymentMethodKind,
} from '@hooks/usePaymentOffline';

import { AppButton, Image, PaginationDots } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Globals } from '@utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = ScaleSize(130);
const CARD_HEIGHT = ScaleSize(172);
const ITEM_WIDTH = ScaleSize(142);
const BADGE_SIZE = ScaleSize(20);
const CHECK_ICON_SIZE = ScaleSize(11);

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_GAP = ScaleSize(3);
const CHECK_COLOR = '#2DB34A';

type MethodTheme = {
  readonly bg: string;
  readonly sub: string;
  readonly tagBg: string;
  readonly tagText: string;
  readonly text: string;
};

const METHOD_THEMES: Record<PaymentMethodKind, MethodTheme> = {
  bank: {
    bg: '#5C6BC0',
    sub: 'rgba(255, 255, 255, 0.85)',
    tagBg: 'rgba(0, 0, 0, 0.18)',
    tagText: '#FFFFFF',
    text: '#FFFFFF',
  },
  card: {
    bg: '#7FA88A',
    sub: 'rgba(255, 255, 255, 0.85)',
    tagBg: 'rgba(0, 0, 0, 0.16)',
    tagText: '#FFFFFF',
    text: '#FFFFFF',
  },
  money: {
    bg: '#2DB34A',
    sub: 'rgba(255, 255, 255, 0.85)',
    tagBg: 'rgba(255, 255, 255, 0.25)',
    tagText: '#FFFFFF',
    text: '#FFFFFF',
  },
};

type AddMethodEntry = { readonly id: 'add-method'; readonly kind: 'add' };
type CarouselEntry = AddMethodEntry | IPaymentMethod;

const ADD_METHOD_ENTRY: AddMethodEntry = { id: 'add-method', kind: 'add' };

type MethodItemProps = {
  readonly method: IPaymentMethod;
  readonly methodIndex: number;
  readonly onSelect: (id: string, index: number) => void;
  readonly selected: boolean;
};

function MethodItem({
  method,
  methodIndex,
  onSelect,
  selected,
}: MethodItemProps) {
  const theme = METHOD_THEMES[method.kind];

  return (
    <View style={styles.slot}>
      <AppButton
        onPress={() => onSelect(method.id, methodIndex)}
        testID={`payment-offline-method-${method.id}`}
      >
        <View style={[styles.card, { backgroundColor: theme.bg }]}>
          <View style={styles.cardTop}>
            <View style={[styles.tag, { backgroundColor: theme.tagBg }]}>
              <Text style={[styles.tagText, { color: theme.tagText }]}>
                {method.tag}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                selected ? styles.badgeSelected : styles.badgeUnselected,
              ]}
            >
              {selected ? (
                <Image
                  color={CHECK_COLOR}
                  height={CHECK_ICON_SIZE}
                  name="ic_check"
                  type="svg"
                  width={CHECK_ICON_SIZE}
                />
              ) : undefined}
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text
              numberOfLines={1}
              style={[styles.label, { color: theme.text }]}
            >
              {method.label}
            </Text>
            <Text style={[styles.subLabel, { color: theme.sub }]}>
              {method.subLabel}
            </Text>
          </View>
        </View>
      </AppButton>
    </View>
  );
}

type AddMethodItemProps = {
  readonly label: string;
  readonly onPress: () => void;
};

function AddMethodItem({ label, onPress }: AddMethodItemProps) {
  return (
    <View style={styles.slot}>
      <AppButton onPress={onPress} testID="payment-offline-add-method">
        <View style={[styles.card, styles.addCard]}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addLabel}>{label}</Text>
        </View>
      </AppButton>
    </View>
  );
}

type Properties = {
  readonly methods: readonly IPaymentMethod[];
  readonly onAddMethod: () => void;
  readonly onSelect: (id: string) => void;
  readonly selectedId: string | undefined;
};

function PaymentMethodCarousel({
  methods,
  onAddMethod,
  onSelect,
  selectedId,
}: Properties) {
  const { t } = useTranslation();
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const data = useMemo<CarouselEntry[]>(
    () => [...methods, ADD_METHOD_ENTRY],
    [methods],
  );

  // Tapping a method both selects it and, if it isn't already focused (e.g.
  // a peeking neighbour), scrolls the carousel to center it.
  const handleSelect = useCallback(
    (id: string, index: number) => {
      onSelect(id);
      carouselRef.current?.scrollTo({ animated: true, index });
    },
    [onSelect],
  );

  const renderItem = useCallback<CarouselRenderItem<CarouselEntry>>(
    ({ index, item }) =>
      item.kind === 'add' ? (
        <AddMethodItem
          label={t('payment_offline.add_method')}
          onPress={onAddMethod}
        />
      ) : (
        <MethodItem
          method={item}
          methodIndex={index}
          onSelect={handleSelect}
          selected={item.id === selectedId}
        />
      ),
    [handleSelect, onAddMethod, selectedId, t],
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
      <View
        onTouchCancel={onTouchEnd}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
      >
        <Carousel
          data={data}
          defaultIndex={0}
          height={CARD_HEIGHT}
          onProgressChange={(_, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          onSnapToItem={index => {
            const entry = data[index];
            if (entry.kind !== 'add') {
              onSelect(entry.id);
            }
          }}
          loop={false}
          pagingEnabled
          ref={carouselRef}
          renderItem={renderItem}
          style={styles.carousel}
          testID="payment-offline-method-carousel"
          width={ITEM_WIDTH}
        />
      </View>

      <PaginationDots
        activeWidth={DOT_ACTIVE_WIDTH}
        count={data.length}
        gap={DOT_GAP}
        progress={progress}
        size={DOT_SIZE}
        style={styles.paginationRow}
      />
    </View>
  );
}

export default React.memo(PaymentMethodCarousel);

const styles = StyleSheet.create({
  addCard: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderColor: '#D7D7D7',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  addIcon: {
    color: '#5BB85C',
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  addLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(12),
    fontWeight: '600',
    marginTop: ScaleSize(6),
  },
  badge: {
    alignItems: 'center',
    borderRadius: BADGE_SIZE / 2,
    height: BADGE_SIZE,
    justifyContent: 'center',
    width: BADGE_SIZE,
  },
  badgeSelected: {
    backgroundColor: '#FFFFFF',
  },
  badgeUnselected: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
  },
  card: {
    borderRadius: ScaleSize(14),
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    padding: ScaleSize(12),
    width: CARD_WIDTH,
  },
  cardBottom: {
    gap: ScaleSize(4),
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carousel: {
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  label: {
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  paginationRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(12),
  },
  slot: {
    alignItems: 'center',
    height: CARD_HEIGHT,
    justifyContent: 'center',
    width: ITEM_WIDTH,
  },
  subLabel: {
    fontSize: ScaleSize(11),
    letterSpacing: ScaleSize(0.4),
  },
  tag: {
    borderRadius: ScaleSize(5),
    paddingHorizontal: ScaleSize(7),
    paddingVertical: ScaleSize(3),
  },
  tagText: {
    fontSize: ScaleSize(9),
    fontWeight: '700',
  },
  wrap: {
    alignSelf: 'center',
    width: SCREEN_WIDTH,
  },
});
