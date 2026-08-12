import type { IconName } from '@assets/icons';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';
import type { TranslationKeys } from '@translations/i18next';

import { Colors } from '@constants';
import {
  AmountRow,
  DashedDivider,
  HeaderDetail,
  TransactionDetailLoading,
} from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency } from '@utils/product';
import { useTransactionDetail } from '@hooks';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import PointRow from './PointRow';
import SectionCard from './SectionCard';
import SummaryHeader from './SummaryHeader';
import {
  BALANCE_ACCOUNT_TYPE,
  TRANSACTION_DETAIL_DISPLAY,
} from '@constants/config';

const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';
const EMPTY_VALUE = '-';
const POINT_SUFFIX = ' P';

const ICONS_SECTION: Record<string, IconName | undefined> = {
  [BALANCE_ACCOUNT_TYPE.PAY_MONEY]: 'ic_point',
  [BALANCE_ACCOUNT_TYPE.POINT]: 'ic_point',
  [BALANCE_ACCOUNT_TYPE.CONTRIBUTION]: 'ic_contribution',
  [BALANCE_ACCOUNT_TYPE.DIVIDEND]: 'ic_dividend',
};

const LEG_LABELS: Record<string, string | undefined> =
  TRANSACTION_DETAIL_DISPLAY;

const formatWon = (t: any, value: number | undefined, negative = false) =>
  `${negative ? EMPTY_VALUE : ''}${t('common.display_price', { amount: formatCurrency(value) })}`;

const formatPoint = (value: number | undefined, negative = false) =>
  `${negative ? EMPTY_VALUE : ''}${formatCurrency(value)}${POINT_SUFFIX}`;

const getAmount = (data: any, fieldName: string) => {
  return data?.[fieldName] || 0;
};

function TransactionDetail(props: RootScreenProps<Paths.TransactionDetail>) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, loading, groupedLegs, order } = useTransactionDetail(props);

  const headerTitle = data ? formatWon(t, order?.totalAmount) : '';
  const headerDate = data?.occurredAt
    ? dayjs(data?.occurredAt).format(DATE_FORMAT)
    : '';

  const paymentMethod = data?.headlineFundingSource
    ? t('order_history_detail.price_detail.paymentMethod', {
        method: t(
          `order_history_detail.payment_methods.${data?.headlineFundingSource.toLowerCase()}`,
        ),
      })
    : EMPTY_VALUE;
  return (
    <View style={styles.root}>
      <HeaderDetail hideNotify title={t('transaction_detail.title')} />
      {loading ? (
        <TransactionDetailLoading />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + ScaleSize(24) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <SummaryHeader date={headerDate} title={headerTitle} />

          <View style={styles.section}>
            <SectionCard
              icon="ic_wallet"
              title={t('transaction_detail.payment_summary_section_title')}
            >
              <AmountRow
                bold
                label={t('transaction_detail.payment_amount_label')}
                value={formatWon(t, order?.totalAmount)}
              />

              <View style={styles.divider} />

              {getAmount(order, 'voucherAmount') > 0 && (
                <AmountRow
                  caption={order?.couponName}
                  label={t('transaction_detail.coupon_discount_label')}
                  value={formatWon(t, order?.voucherAmount, true)}
                  valueColor={Colors.red01}
                />
              )}
              {getAmount(order, 'memberDiscountAmount') > 0 && (
                <AmountRow
                  label={t('transaction_detail.member_discount')}
                  value={formatWon(t, order?.memberDiscountAmount, true)}
                  valueColor={Colors.red01}
                />
              )}
              {getAmount(order, 'usedPointAmount') > 0 && (
                <AmountRow
                  label={t('transaction_detail.point_used_label')}
                  value={formatPoint(order?.usedPointAmount, true)}
                  valueColor={Colors.red01}
                />
              )}

              <DashedDivider />

              <AmountRow
                highlight
                label={t('transaction_detail.final_payment_label')}
                value={formatWon(t, order?.settledMoneyAmount)}
                valueColor={Colors.green02}
              />

              <AmountRow
                label={paymentMethod}
                value={formatWon(t, order?.settledMoneyAmount, true)}
                valueColor={Colors.green02}
              />
            </SectionCard>
          </View>

          <View style={styles.section}>
            {groupedLegs.map((it, index) => {
              return (
                <SectionCard
                  key={index}
                  icon={ICONS_SECTION[it.balanceAccountType]}
                  style={styles.sectionCard}
                  title={
                    !it.balanceAccountType
                      ? '-'
                      : t(
                          `transaction_detail.section_detail.${it.balanceAccountType?.toLowerCase()}`,
                        )
                  }
                >
                  {it.legs.map((le, i) => {
                    const title = LEG_LABELS[le.entryType];
                    return (
                      <PointRow
                        key={`${index}_${i}`}
                        direction={le.direction == 'DEBIT' ? 'used' : 'earned'}
                        label={
                          title ? t(title as TranslationKeys) : EMPTY_VALUE
                        }
                        value={formatPoint(le.amount, le.direction == 'DEBIT')}
                      />
                    );
                  })}
                </SectionCard>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default TransactionDetail;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: Colors.gray16,
    height: 1,
  },
  root: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  scrollContent: {
    paddingTop: ScaleSize(12),
  },
  section: {
    marginTop: ScaleSize(16),
  },
  sectionCard: {
    marginBottom: ScaleSize(20),
  },
});
