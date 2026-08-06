import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

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

const DATE_FORMAT = 'YYYY-MM-DD hh:mmA';
const MINUS_SIGN = '-';
const POINT_BADGE = 'P';
const POINT_SUFFIX = ' P';

const formatWon = (t: any, value: number | undefined, negative = false) =>
  `${negative ? MINUS_SIGN : ''}${t('common.display_price', { amount: formatCurrency(value) })}`;

const formatPoint = (value: number | undefined, negative = false) =>
  `${negative ? MINUS_SIGN : ''}${formatCurrency(value)}${POINT_SUFFIX}`;

function TransactionDetail(props: RootScreenProps<Paths.TransactionDetail>) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, loading } = useTransactionDetail(props);

  const headerTitle = data
    ? `${data.productName} ${formatWon(t, data.paymentAmount)}`
    : '';
  const headerDate = data?.paidAt ? dayjs(data.paidAt).format(DATE_FORMAT) : '';

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
                value={formatWon(t, data?.paymentAmount)}
              />

              <View style={styles.divider} />

              <AmountRow
                caption={data?.couponName}
                label={t('transaction_detail.coupon_discount_label')}
                value={formatWon(t, data?.couponDiscount, true)}
                valueColor={Colors.red01}
              />
              <AmountRow
                label={t('transaction_detail.point_used_label')}
                value={formatPoint(data?.pointUsed, true)}
                valueColor={Colors.red01}
              />

              <DashedDivider />

              <AmountRow
                highlight
                label={t('transaction_detail.final_payment_label')}
                value={formatWon(t, data?.finalPaymentAmount)}
                valueColor={Colors.green02}
              />
              <AmountRow
                label={t('transaction_detail.pay_money_label')}
                value={formatWon(t, data?.payMoneyAmount, true)}
                valueColor={Colors.green02}
              />
            </SectionCard>
          </View>

          <View style={styles.section}>
            <SectionCard
              badge={POINT_BADGE}
              title={t('transaction_detail.point_section_title')}
            >
              <PointRow
                direction="used"
                label={t('transaction_detail.point_used_label')}
                value={formatPoint(data?.pointUsed, true)}
              />
              <PointRow
                direction="earned"
                label={t('transaction_detail.point_earned_label')}
                value={formatPoint(data?.pointEarned)}
              />
            </SectionCard>
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
});
