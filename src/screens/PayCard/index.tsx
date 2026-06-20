import type { PayCardTransaction } from '@hooks';
import type { ListRenderItem } from 'react-native';

import { Button, HeaderDetail, SegmentedTab } from '@components';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useMemo } from 'react';
import { ScaleSize } from '@kits/core';
import { usePayCard } from '@hooks';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';
const SECTION_DIVIDER = Colors.gray3;
const SCREEN_BACKGROUND = '#F2F2F2';

type TransactionRowProps = {
  readonly item: PayCardTransaction;
};

function TransactionRow({ item }: TransactionRowProps) {
  const { t } = useTranslation();

  return (
    <View
      style={styles.transactionRow}
      testID={`pay-card-transaction-${item.id}`}
    >
      <View style={styles.transactionTopRow}>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionBottomRow}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionBalance}>
          {t('pay_card.balance_after', { amount: item.balanceAfter })}
        </Text>
      </View>
    </View>
  );
}

const MemoTransactionRow = React.memo(TransactionRow);

const keyExtractor = (item: PayCardTransaction) => item.id;

const renderItem: ListRenderItem<PayCardTransaction> = ({ item }) => (
  <MemoTransactionRow item={item} />
);

function PayCard() {
  const { t } = useTranslation();
  const {
    historyTab,
    onRecharge,
    payBalance,
    pointBalance,
    setHistoryTab,
    transactions,
  } = usePayCard();

  const historyTabs = useMemo(
    () => [
      {
        id: 'pay' as const,
        label: t('pay_card.tab_pay'),
        testID: 'pay-card-tab-pay',
      },
      {
        id: 'point' as const,
        label: t('pay_card.tab_point'),
        testID: 'pay-card-tab-point',
      },
    ],
    [t],
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('pay_card.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.payHeaderRow}>
            <Text style={styles.sectionTitle}>{t('pay_card.pay_title')}</Text>
            <Button
              onPress={onRecharge}
              style={styles.rechargeButton}
              testID="pay-card-recharge"
              title={t('pay_card.recharge')}
              type="primary"
            />
          </View>
          <Text style={styles.balanceText}>
            {t('pay_card.pay_balance', { amount: payBalance })}
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <View style={styles.pointHeaderRow}>
            <Text style={styles.sectionTitle}>{t('pay_card.point_title')}</Text>
            <Text style={styles.pointBalanceText}>
              {t('pay_card.point_balance', { amount: pointBalance })}
            </Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>{t('pay_card.history_title')}</Text>
          <SegmentedTab
            activeTab={historyTab}
            onTabChange={setHistoryTab}
            style={styles.historyTabs}
            tabs={historyTabs}
          />
          <FlatList
            data={transactions}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default PayCard;

const styles = StyleSheet.create({
  balanceText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '600',
    marginTop: ScaleSize(12),
    textAlign: 'right',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
  },
  historyTabs: {
    marginBottom: ScaleSize(16),
  },
  historyTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
  },
  payHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointBalanceText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  pointHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rechargeButton: {
    borderRadius: ScaleSize(20),
    height: ScaleSize(36),
    paddingHorizontal: ScaleSize(14),
    width: undefined,
  },
  safeArea: {
    backgroundColor: SCREEN_BACKGROUND,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(18),
  },
  sectionDivider: {
    backgroundColor: SECTION_DIVIDER,
    height: ScaleSize(8),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  transactionAmount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  transactionBalance: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(16),
  },
  transactionBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  transactionDate: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  transactionDescription: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(16),
    marginRight: ScaleSize(8),
  },
  transactionRow: {
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    paddingVertical: ScaleSize(16),
  },
  transactionTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
