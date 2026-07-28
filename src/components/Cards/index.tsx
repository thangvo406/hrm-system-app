import type { CarouselRenderItem } from 'react-native-reanimated-carousel';

import { AddPlaceholder, Button, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { Globals } from '@utils';

import PaginationDots from '../PaginationDots';
import { DeviceUtils } from '@kits/core/utils';
import { IAccount } from '@type';
const { ifIOS } = DeviceUtils;

const ADD_ACCOUNT_ID = '__add_account__';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH - ScaleSize(64);

const CARD_GAP = ScaleSize(ifIOS(0, 24));
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

function AccountItem({
  account,
  accountIndex,
}: {
  readonly account: IAccount;
  readonly accountIndex: number;
}) {
  const colors = ACCOUNT_GRADIENTS[accountIndex % ACCOUNT_GRADIENTS.length];
  return (
    <View style={styles.slot}>
      <LinearGradient
        colors={[...colors]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
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
      </LinearGradient>
    </View>
  );
}

type Properties = {
  readonly accounts?: readonly IAccount[];
  readonly isShowUnRegister?: boolean;
  readonly selectedAddCard?: boolean;
  readonly hideEmptyView?: boolean;
  readonly initialIndex?: number;
  readonly onRegisterAccount?: () => void;
  // readonly onRegisterCard?: () => void;
};

function Cards({
  accounts,
  isShowUnRegister,
  selectedAddCard,
  initialIndex = 0,
  hideEmptyView,
  onRegisterAccount,
  // onRegisterCard,
}: Properties) {
  const focusedIndex = accounts?.length > 0 ? initialIndex : -1;

  const { t } = useTranslation();
  const progress = useSharedValue(focusedIndex);
  const data = React.useMemo<IAccount[]>(
    () => [{ id: ADD_ACCOUNT_ID } as IAccount, ...(accounts || [])],
    [accounts],
  );

  const renderItem = useCallback<CarouselRenderItem<IAccount>>(
    ({ index, item }) =>
      item.id === ADD_ACCOUNT_ID ? (
        <View style={styles.slot}>
          <AddPlaceholder
            height={CARD_HEIGHT}
            label={t('account_management.add_account')}
            onPress={onRegisterAccount}
            testID="account-management-add-account"
            width={CARD_WIDTH}
            selected={selectedAddCard}
          />
        </View>
      ) : (
        <AccountItem account={item} accountIndex={index - 1} />
      ),
    [onRegisterAccount, selectedAddCard, t],
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
      {!isShowUnRegister && (
        <Text style={styles.label}>{t('account_management.account')}</Text>
      )}

      {hideEmptyView || (accounts?.length || 0) > 0 ? (
        <View style={styles.wrap}>
          <View
            onTouchCancel={onTouchEnd}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
          >
            <Carousel
              data={data}
              height={CARD_HEIGHT}
              defaultIndex={focusedIndex == -1 ? undefined : focusedIndex}
              onProgressChange={(_, absoluteProgress) => {
                progress.value = absoluteProgress;
              }}
              loop={false}
              pagingEnabled
              renderItem={renderItem}
              style={styles.carousel}
              testID="account-management-account-carousel"
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
        !hideEmptyView && (
          <View style={styles.emptyState}>
            <Text style={styles.desc}>
              {t('account_management.no_payment_methods_title')}
            </Text>
            <Text style={styles.subDesc}>
              {t('account_management.no_payment_methods_desc')}
            </Text>

            <View style={styles.actionRow}>
              {/* <Button
                onPress={onRegisterCard}
                title={t('account_management.register_card')}
                type="outline-green"
                style={styles.actionButton}
                testID="account-management-register-card"
              /> */}
              <Button
                onPress={onRegisterAccount}
                title={t('account_management.register_card_account')}
                type="outline-green"
                style={styles.actionButton}
                testID="account-management-register-account"
              />
            </View>
          </View>
        )
      )}
    </>
  );
}

export default React.memo(Cards);

const styles = StyleSheet.create({
  account: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    letterSpacing: ScaleSize(1),
    marginTop: ScaleSize(8),
    opacity: 0.9,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    height: ScaleSize(46),
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginHorizontal: ScaleSize(20),
    marginTop: ScaleSize(10),
    paddingBottom: ScaleSize(20),
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  card: {
    alignItems: 'center',
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    height: CARD_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
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
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
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
