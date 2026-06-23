import { Button, HeaderDetail, SegmentedTab } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { ScaleSize } from '@kits/core';
import { usePayCard } from '@hooks';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { formatCurrency } from '@utils/product';
import PointHistoryList from './PointHistoryList';
import TransactionList from './TransactionList';

const TEXT_DARK = '#1A1A1A';
const SECTION_DIVIDER = Colors.gray3;
const SCREEN_BACKGROUND = '#F2F2F2';

function PayCard() {
  const { t } = useTranslation();
  const {
    currentWallet,
    historyTab,
    onLoadMore,
    onRecharge,
    payTransactions,
    pointBalance,
    pointTransactions,
    setHistoryTab,
  } = usePayCard();

  const historyTabs = useMemo(
    () => [
      {
        id: 'pay' as const,
        label: t('pay_card.tab_pay'),
        render: () => (
          <TransactionList data={payTransactions} onLoadMore={onLoadMore} />
        ),
        testID: 'pay-card-tab-pay',
      },
      {
        id: 'point' as const,
        label: t('pay_card.tab_point'),
        render: () => <PointHistoryList data={pointTransactions} />,
        testID: 'pay-card-tab-point',
      },
    ],
    [t, payTransactions, pointTransactions, onLoadMore],
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('pay_card.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
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
            {t('pay_card.pay_balance', {
              amount: formatCurrency(currentWallet?.balance),
            })}
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
    flex: 1,
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
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
  },
  scrollView: {
    flex: 1,
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
});
