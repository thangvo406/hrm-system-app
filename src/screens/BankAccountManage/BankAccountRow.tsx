import type { IAccount } from '@type';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import BankThumbnail from './BankThumbnail';
import CardActions from './CardActions';
import { maskFullNumber } from './helpers';
import Pill from './Pill';
import {
  ACCENT_INK,
  ACCENT_SURFACE,
  MUTED_INK,
  ROW_GAP,
  ROW_PADDING,
  ROW_RADIUS,
  ROW_SURFACE,
  TITLE_INK,
} from './tokens';

const MORE_ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly account: IAccount;
  readonly onMore?: () => void;
  readonly onRemove?: (account: IAccount) => void;
  readonly onSettings?: (account: IAccount) => void;
};

function BankAccountRow({ account, onMore, onRemove, onSettings }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <View style={styles.top}>
        <BankThumbnail displayName={account.displayName} />

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {account.displayName}
          </Text>
          {account.holderName ? (
            <Text numberOfLines={1} style={styles.holder}>
              {account.holderName}
            </Text>
          ) : undefined}
          <Text numberOfLines={1} style={styles.number}>
            {maskFullNumber(account.displayNumber)}
          </Text>
        </View>

        <View style={styles.topRight}>
          {account.default ? (
            <Pill
              ink={ACCENT_INK}
              label={t('account_management.primary')}
              surface={ACCENT_SURFACE}
            />
          ) : undefined}
          <AppButton
            onPress={onMore}
            style={styles.more}
            testID={`payment-method-account-more-${account.id}`}
          >
            <Image
              color={MUTED_INK}
              height={MORE_ICON_SIZE}
              name="ic_dots_vertical"
              type="svg"
              width={MORE_ICON_SIZE}
            />
          </AppButton>
        </View>
      </View>

      <CardActions
        direction="row"
        onRemove={() => onRemove?.(account)}
        onSettings={() => onSettings?.(account)}
        testIDSuffix={`-account-${account.id}`}
      />
    </View>
  );
}

export default React.memo(BankAccountRow);

const styles = StyleSheet.create({
  holder: {
    color: MUTED_INK,
    fontSize: ScaleSize(13),
  },
  info: {
    flex: 1,
    gap: ScaleSize(3),
  },
  more: {
    alignItems: 'center',
    height: ScaleSize(24),
    justifyContent: 'center',
    width: ScaleSize(24),
  },
  name: {
    color: TITLE_INK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  number: {
    color: '#5C5C5C',
    fontSize: ScaleSize(13),
  },
  row: {
    backgroundColor: ROW_SURFACE,
    borderRadius: ROW_RADIUS,
    gap: ScaleSize(12),
    padding: ROW_PADDING,
  },
  top: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: ROW_GAP,
  },
  topRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
});
