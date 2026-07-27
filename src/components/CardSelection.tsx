import type {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import type { IAccount } from '@type';

import { AppButton, Image, PaginationDots } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Globals } from '@utils';

const { ifIOS } = DeviceUtils;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH - ScaleSize(64);

const CARD_GAP = ScaleSize(ifIOS(16, 24));
const CARD_WIDTH = ITEM_WIDTH - CARD_GAP;
const CARD_HEIGHT = ScaleSize(96);
const CHEVRON_SIZE = ScaleSize(18);
const ACCOUNT_GRADIENTS: readonly (readonly string[])[] = [
  ['#3B6BE0', '#274BB0'],
  ['#1F2A44', '#0E1526'],
];

const DOT_SIZE = ScaleSize(6);
const DOT_ACTIVE_WIDTH = ScaleSize(18);
const DOT_GAP = ScaleSize(3);
const SELECTED_BORDER_COLOR = Colors.primary;

type AccountItemProps = {
  readonly account: IAccount;
  readonly accountIndex: number;
  readonly onSelect: (id: IAccount['id'], index: number) => void;
  readonly selected: boolean;
};

function AccountItem({
  account,
  accountIndex,
  onSelect,
  selected,
}: AccountItemProps) {
  const colors = ACCOUNT_GRADIENTS[accountIndex % ACCOUNT_GRADIENTS.length];
  return (
    <View style={styles.slot}>
      <AppButton
        onPress={() => onSelect(account.id, accountIndex)}
        testID={`card-selection-account-${account.id}`}
      >
        <LinearGradient
          colors={[...colors]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.card}
        >
          <View style={[styles.content, selected && styles.contentSelected]}>
            <View style={styles.info}>
              <Text style={styles.bankName}>{account.displayName}</Text>
              <Text style={styles.account}>{account.displayNumber}</Text>
            </View>
            <View style={styles.chevron}>
              <Image
                color="#FFFFFF"
                height={CHEVRON_SIZE}
                name="ic_chevron_right"
                type="svg"
                width={CHEVRON_SIZE}
              />
            </View>
          </View>
        </LinearGradient>
      </AppButton>
    </View>
  );
}

type Properties = {
  readonly accounts: readonly IAccount[];
  readonly onSelect: (id: IAccount['id']) => void;
  readonly selectedId: IAccount['id'] | undefined;
};

function CardSelection({ accounts, onSelect, selectedId }: Properties) {
  const { t } = useTranslation();
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const data = React.useMemo<IAccount[]>(() => [...accounts], [accounts]);

  // Tapping an account both selects it and, if it isn't already focused
  // (e.g. a peeking neighbour), scrolls the carousel to center it.
  const handleSelect = useCallback(
    (id: IAccount['id'], index: number) => {
      onSelect(id);
      carouselRef.current?.scrollTo({ animated: true, index });
    },
    [onSelect],
  );

  const renderItem = useCallback<CarouselRenderItem<IAccount>>(
    ({ index, item }) => (
      <AccountItem
        account={item}
        accountIndex={index}
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
      {accounts.length > 0 ? (
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
              loop={false}
              onProgressChange={(_, absoluteProgress) => {
                progress.value = absoluteProgress;
              }}
              onSnapToItem={index => onSelect(data[index].id)}
              pagingEnabled
              ref={carouselRef}
              renderItem={renderItem}
              style={styles.carousel}
              testID="card-selection-carousel"
              width={ITEM_WIDTH}
            />
          </View>
          {data.length > 1 ? (
            <PaginationDots
              activeWidth={DOT_ACTIVE_WIDTH}
              count={data.length}
              gap={DOT_GAP}
              progress={progress}
              size={DOT_SIZE}
              style={styles.paginationRow}
            />
          ) : undefined}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.desc}>
            {t('account_management.no_payment_methods_title')}
          </Text>
          <Text style={styles.subDesc}>
            {t('account_management.no_payment_methods_desc')}
          </Text>
        </View>
      )}
    </>
  );
}

export default React.memo(CardSelection);

const styles = StyleSheet.create({
  account: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    letterSpacing: ScaleSize(1),
    marginTop: ScaleSize(8),
    opacity: 0.9,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  card: {
    borderRadius: ScaleSize(16),
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
  },
  carousel: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  chevron: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: ScaleSize(15),
    height: ScaleSize(30),
    justifyContent: 'center',
    width: ScaleSize(30),
  },
  content: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(2),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
  },
  contentSelected: {
    borderColor: SELECTED_BORDER_COLOR,
  },
  desc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
  },
  emptyState: {
    alignItems: 'center',
  },
  info: {
    flex: 1,
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
  subDesc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
  },
  wrap: {
    alignSelf: 'center',
    width: SCREEN_WIDTH,
  },
});
