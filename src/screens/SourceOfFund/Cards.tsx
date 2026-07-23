import type { SourceAccount } from '@hooks/useSourceOfFund';
import type { ListRenderItem } from 'react-native';

import { Button, Carousel } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import AccountCard from './AccountCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACCOUNT_GUTTER = ScaleSize(20);
const ACCOUNT_GAP = ScaleSize(-10);
const ACCOUNT_PEEK = ScaleSize(56);
// The Carousel's viewport is shrunk by ACCOUNT_GUTTER on both sides, so the
// stride must leave ACCOUNT_PEEK of room for the next card to show through.
const ACCOUNT_STRIDE = SCREEN_WIDTH - ACCOUNT_GUTTER * 2 - ACCOUNT_PEEK;
const ACCOUNT_WIDTH = ACCOUNT_STRIDE - ACCOUNT_GAP;

type Properties = {
  readonly accounts: readonly SourceAccount[];
  readonly isShowUnRegister: boolean;
  readonly onRegisterAccount: () => void;
  readonly onRegisterCard: () => void;
};

function Cards({
  accounts,
  isShowUnRegister,
  onRegisterAccount,
  onRegisterCard,
}: Properties) {
  const { t } = useTranslation();

  const renderAccount = useCallback<ListRenderItem<SourceAccount>>(
    ({ index, item }) => (
      <View style={styles.accountSlot}>
        <AccountCard account={item} index={index} width={ACCOUNT_WIDTH} />
      </View>
    ),
    [],
  );

  return (
    <>
      {!isShowUnRegister && <Text style={styles.label}>{t('source_of_fund.account')}</Text> }
      <Carousel
        data={accounts}
        horizontalPadding={ACCOUNT_GUTTER}
        itemWidth={ACCOUNT_STRIDE}
        keyExtractor={item => item.id}
        renderItem={renderAccount}
        testID="source-of-fund-account-carousel"
      />

      {
        !(accounts?.length > 0) &&
            <View
              style={{
                alignItems: 'center'
              }}>
              <Text style={styles.desc}>
                {t('source_of_fund.no_payment_methods_title')}
              </Text>
              <Text style={styles.subDesc}>
                {t('source_of_fund.no_payment_methods_desc')}
              </Text>

              <View
                style={styles.actionRow}>
                  <Button
                    onPress={onRegisterCard}
                    title={t('source_of_fund.register_card')}
                    type="outline-green"
                    style={styles.actionButton}
                    testID="source-of-fund-register-card"
                  />
                   <Button
                    onPress={onRegisterAccount}
                    title={t('source_of_fund.register_account')}
                    type="outline-green"
                    style={styles.actionButton}
                    testID="source-of-fund-register-account"
                  />
              </View>
            </View>
      }
    </>
  );
}

export default React.memo(Cards);

const styles = StyleSheet.create({
  accountSlot: {
    marginRight: ACCOUNT_GAP,
    width: ACCOUNT_WIDTH,
  },
  actionRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(10),
    marginHorizontal: ScaleSize(20),
    paddingBottom: ScaleSize(20),
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    height: ScaleSize(46),
    justifyContent: 'center',
  },
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
  },
  subDesc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    // fontWeight: '700',
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
  },
  desc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
  }
});
