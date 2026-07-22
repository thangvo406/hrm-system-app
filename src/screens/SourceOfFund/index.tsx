import type { SourceAccount } from '@hooks/useSourceOfFund';
import type { ListRenderItem } from 'react-native';

import { AppButton, Carousel, HeaderDetail } from '@components';
import { PRIMARY_CARD_INDEX, useSourceOfFund } from '@hooks/useSourceOfFund';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import AccountCard from './AccountCard';
import CardCarousel from './CardCarousel';
import TransactionRow from './TransactionRow';
import WalletCard from './WalletCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACCOUNT_GUTTER = ScaleSize(20);
const ACCOUNT_GAP = ScaleSize(-10);
const ACCOUNT_PEEK = ScaleSize(56);
// The Carousel's viewport is shrunk by ACCOUNT_GUTTER on both sides, so the
// stride must leave ACCOUNT_PEEK of room for the next card to show through.
const ACCOUNT_STRIDE = SCREEN_WIDTH - ACCOUNT_GUTTER * 2 - ACCOUNT_PEEK;
const ACCOUNT_WIDTH = ACCOUNT_STRIDE - ACCOUNT_GAP;

function SourceOfFund() {
  const { t } = useTranslation();
  const {
    accounts,
    balance,
    cards,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onUse,
    onViewAllTransactions,
    point,
    transactions,
  } = useSourceOfFund();

  const renderAccount = useCallback<ListRenderItem<SourceAccount>>(
    ({ index, item }) => (
      <View style={styles.accountSlot}>
        <AccountCard account={item} index={index} width={ACCOUNT_WIDTH} />
      </View>
    ),
    [],
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('source_of_fund.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.walletWrap}>
          <WalletCard
            balance={balance}
            onCharge={onCharge}
            onChargeHistory={onChargeHistory}
            onUse={onUse}
            point={point}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('source_of_fund.payment_methods')}
          </Text>
          <AppButton
            onPress={onManagePaymentMethods}
            style={styles.manageButton}
            testID="source-of-fund-manage"
          >
            <Text style={styles.manageText}>{t('source_of_fund.manage')}</Text>
          </AppButton>
        </View>

        <Text style={styles.subLabel}>{t('source_of_fund.card')}</Text>
        <CardCarousel cards={cards} initialIndex={PRIMARY_CARD_INDEX} />

        <Text style={[styles.subLabel, styles.accountLabel]}>
          {t('source_of_fund.account')}
        </Text>
        <Carousel
          data={accounts}
          horizontalPadding={ACCOUNT_GUTTER}
          itemWidth={ACCOUNT_STRIDE}
          keyExtractor={item => item.id}
          renderItem={renderAccount}
          testID="source-of-fund-account-carousel"
        />

        <View style={[styles.sectionHeader, styles.historyHeader]}>
          <Text style={styles.sectionTitle}>
            {t('source_of_fund.recent_history')}
          </Text>
          <AppButton
            onPress={onViewAllTransactions}
            style={styles.manageButton}
            testID="source-of-fund-view-all"
          >
            <Text style={styles.manageText}>
              {t('source_of_fund.view_all')}
            </Text>
          </AppButton>
        </View>

        <View style={styles.historyList}>
          {transactions.map(transaction => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default SourceOfFund;

const styles = StyleSheet.create({
  accountLabel: {
    marginTop: ScaleSize(20),
  },
  accountSlot: {
    marginRight: ACCOUNT_GAP,
    width: ACCOUNT_WIDTH,
  },
  historyHeader: {
    marginTop: ScaleSize(28),
  },
  historyList: {
    paddingHorizontal: ScaleSize(20),
  },
  manageButton: {
    borderColor: '#DBDBDB',
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
  },
  manageText: {
    color: '#717171',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  safeArea: {
    backgroundColor: '#F5F6F7',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(28),
    paddingHorizontal: ScaleSize(20),
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '800',
  },
  subLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
  },
  walletWrap: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
});
