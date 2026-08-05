import type { IAccount } from '@type';

import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import BankThumbnail from './BankThumbnail';
import CardActions from './CardActions';
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
import { BankUtils } from '@utils';

type Properties = {
  readonly account: IAccount;
  readonly onRemove?: (account: IAccount) => void;
  readonly onSettings?: (account: IAccount) => void;
};

function BankAccountRow({ account, onRemove, onSettings }: Properties) {
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
            {BankUtils.maskFullNumber(account.displayNumber)}
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
        </View>
      </View>

      <View style={styles.actions}>
        <CardActions
          direction="row"
          onRemove={() => onRemove?.(account)}
          onSettings={() => onSettings?.(account)}
          testIDSuffix={`-account-${account.id}`}
        />
      </View>
    </View>
  );
}

export default React.memo(BankAccountRow);

const styles = StyleSheet.create({
  actions: {
    paddingTop: ROW_GAP,
  },
  holder: {
    color: MUTED_INK,
    fontSize: ScaleSize(13),
  },
  info: {
    flex: 1,
    gap: ScaleSize(3),
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
