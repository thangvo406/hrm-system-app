import { Button, HeaderDetail, SegmentedTab } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { ScaleSize } from '@kits/core';
import { useContributeHistory } from '@hooks';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { formatCurrency } from '@utils/product';
import PointHistoryList from './PointHistoryList';
import TransactionList from './TransactionList';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const SECTION_DIVIDER = Colors.gray3;
const SCREEN_BACKGROUND = '#F2F2F2';

function PayCard() {
  const { t } = useTranslation();
  const {
    summary,
    historyTab,
    onLoadMore,
    onRecharge,
    tranHistories,
    pointTransactions,
    loading,
    onChangeTab,
    onPressTranItem,
  } = useContributeHistory();

  const historyTabs = useMemo(
    () => [
      {
        id: 'pay' as const,
        label: t('pay_card.tab_pay'),
        render: () => (
          <TransactionList
            data={tranHistories}
            onPressItem={onPressTranItem}
            onLoadMore={onLoadMore}
            loading={loading}
          />
        ),
        testID: 'pay-card-tab-pay',
      },
      {
        id: 'point' as const,
        label: t('pay_card.tab_point'),
        render: () => (
          <PointHistoryList
            loading={loading}
            data={pointTransactions ?? []}
            // onPressItem={onPressTranItem}
            onLoadMore={onLoadMore}
          />
        ),
        testID: 'pay-card-tab-point',
      },
    ],
    [t, tranHistories, loading, pointTransactions, onLoadMore],
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
            <Text style={styles.sectionTitle}>
              {t('contribute_history.contribution_status_title')}
            </Text>
            <Button
              onPress={onRecharge}
              style={styles.rechargeButton}
              testID="contribute-history-add"
              title={t('contribute_history.add_contribute')}
              type="primary"
            />
          </View>
          <Text style={styles.balanceText}>
            {t('contribute_history.cumulative_contribution', {
              amount: formatCurrency(summary?.currentContribution),
            })}
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <View style={styles.payHeaderRow}>
            <Text style={styles.sectionTitle}>
              {t('contribute_history.dividend_info_title')}
            </Text>
            <Button
              onPress={() => {}}
              style={styles.dividendDetailButton}
              testID="contribute-history-dividend-detail"
              title={t('contribute_history.dividend_detail')}
              type="outline-bordered"
            />
          </View>
          <Text style={styles.balanceText}>
            {t('contribute_history.cumulative_dividend', {
              amount: formatCurrency(summary?.totalDividend),
            })}
          </Text>
          <Text style={styles.balanceText}>
            {t('contribute_history.expected_dividend', {
              amount: formatCurrency(summary?.expectedDividend),
            })}
          </Text>
          <Text style={styles.balanceText}>
            {t('contribute_history.expected_dividend_date', {
              date: summary?.expectedDividendDate
                ? dayjs(summary?.expectedDividendDate).format('YYYY-MM-DD')
                : '-',
            })}
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>{t('pay_card.history_title')}</Text>
          <SegmentedTab
            activeTab={historyTab}
            onTabChange={onChangeTab}
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
  dividendDetailButton: {
    borderRadius: ScaleSize(20),
    height: ScaleSize(36),
    paddingHorizontal: ScaleSize(14),
    width: undefined,
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
