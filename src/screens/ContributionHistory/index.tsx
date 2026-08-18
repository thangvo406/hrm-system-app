import {
  AppButton,
  Button,
  HeaderDetail,
  Image,
  SegmentedTab,
} from '@components';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMemo } from 'react';
import { ScaleSize } from '@kits/core';
import { useContributeHistory } from '@hooks';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { formatCurrency } from '@utils/product';
import DividendHistory from './DividendHistory';
import TransactionList from './TransactionList';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const SECTION_DIVIDER = Colors.gray3;
const SCREEN_BACKGROUND = '#F2F2F2';
const BADGE_SIZE = ScaleSize(22);

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
    onPressFilter,
    onRefresh,
    refreshing,
    filterCount,
    isEnablePaymentCard,
    onCapitalWithdrawal,
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
          <DividendHistory
            loading={loading}
            data={pointTransactions ?? []}
            onPressItem={onPressTranItem}
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
        refreshControl={
          <RefreshControl
            colors={[Colors.primary]}
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.section}>
          <View style={styles.contributionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {t('contribute_history.contribution_status_title')}
            </Text>
            <View style={styles.headerActions}>
              <Button
                onPress={onRecharge}
                style={styles.primaryActionButton}
                testID="contribute-history-add"
                title={t('contribute_history.add_contribute')}
                titleStyle={styles.actionButtonLabel}
                type="primary"
              />
              <Button
                onPress={onCapitalWithdrawal}
                style={styles.secondaryActionButton}
                testID="contribute-history-withdrawal"
                title={t('contribute_history.capital_withdrawal')}
                titleStyle={styles.actionButtonLabel}
                type="outline-green"
              />
            </View>
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
            {/* <Button
              onPress={() => {}}
              style={styles.dividendDetailButton}
              titleStyle={{
                color: Colors.primary,
              }}
              testID="contribute-history-dividend-detail"
              title={t('contribute_history.btn_dividend_detail')}
              type="outline-bordered"
            /> */}
          </View>
          {isEnablePaymentCard ? (
            <>
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
            </>
          ) : (
            <Text style={styles.balanceText}>
              {t('common.display_price', {
                amount: 0,
              })}
            </Text>
          )}
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.historySection}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.historyTitle}>
              {t('pay_card.history_title')}
            </Text>
            <AppButton onPress={onPressFilter}>
              <Image
                name="ic_filter"
                width={ScaleSize(24)}
                height={ScaleSize(24)}
                color={Colors.gray06}
                type="svg"
              />
              {filterCount > 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: Colors.primary,
                    borderRadius: BADGE_SIZE / 2,
                    height: BADGE_SIZE,
                    justifyContent: 'center',
                    minWidth: BADGE_SIZE,
                    paddingHorizontal: ScaleSize(3),
                    position: 'absolute',
                    right: -(BADGE_SIZE / 4),
                    bottom: 3,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: ScaleSize(11),
                      fontWeight: '700',
                    }}
                  >
                    {filterCount}
                  </Text>
                </View>
              ) : undefined}
            </AppButton>
          </View>
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
    borderWidth: 1,
    borderColor: Colors.primary,
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
  actionButtonLabel: {
    fontSize: ScaleSize(14),
  },
  contributionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: ScaleSize(10),
    width: '100%',
  },
  headerActions: {
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  payHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryActionButton: {
    borderRadius: ScaleSize(19),
    height: ScaleSize(38),
    paddingHorizontal: ScaleSize(14),
    width: undefined,
  },
  secondaryActionButton: {
    borderColor: Colors.primary,
    borderRadius: ScaleSize(19),
    height: ScaleSize(38),
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
    flexShrink: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
