import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency } from '@utils/product';
import { useTransactionDetail } from '@hooks';
import { useTranslation } from 'react-i18next';

const SCREEN_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#9B9B9B';
const TEXT_LABEL = '#6B6B6B';
const NEGATIVE_COLOR = '#E05353';
const POSITIVE_COLOR = '#2DB34A';
const DIVIDER = '#E5E7EB';

type AmountRowProps = {
  readonly bold?: boolean;
  readonly caption?: string;
  readonly label: string;
  readonly value: string;
  readonly valueColor?: string;
};

function AmountRow({ bold, caption, label, value, valueColor }: AmountRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLabelWrap}>
        <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>
          {label}
        </Text>
        {caption ? <Text style={styles.rowCaption}>{caption}</Text> : undefined}
      </View>
      <Text
        style={[
          styles.rowValue,
          bold && styles.rowValueBold,
          valueColor ? { color: valueColor } : undefined,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function TransactionDetail(props: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, formattedDate } = useTransactionDetail(props);

  return (
    <View style={styles.root}>
      <HeaderDetail hideNotify title={t('transaction_detail.title')} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + ScaleSize(24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('transaction_detail.title')}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.productTitle}>
          {`${data.productName} ${formatCurrency(data.paymentAmount)}원`}
        </Text>

        <View style={styles.card}>
          <AmountRow
            bold
            label={t('transaction_detail.payment_amount_label')}
            value={`${formatCurrency(data.paymentAmount)}원`}
          />
          <AmountRow
            caption={data.couponName}
            label={t('transaction_detail.coupon_discount_label')}
            value={`-${formatCurrency(data.couponDiscount)}원`}
            valueColor={NEGATIVE_COLOR}
          />
          <AmountRow
            label={t('transaction_detail.point_used_label')}
            value={`-${formatCurrency(data.pointUsed)} P`}
            valueColor={NEGATIVE_COLOR}
          />

          <View style={styles.divider} />

          <AmountRow
            bold
            label={t('transaction_detail.final_payment_label')}
            value={`${formatCurrency(data.finalPaymentAmount)}원`}
          />
          <AmountRow
            label={t('transaction_detail.pay_money_label')}
            value={`-${formatCurrency(data.payMoneyAmount)}원`}
            valueColor={POSITIVE_COLOR}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t('transaction_detail.point_section_title')}
        </Text>
        <View style={styles.card}>
          <AmountRow
            label={t('transaction_detail.point_used_label')}
            value={`-${formatCurrency(data.pointUsed)} P`}
          />
          <AmountRow
            label={t('transaction_detail.point_earned_label')}
            value={`${formatCurrency(data.pointEarned)} P`}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default TransactionDetail;

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(14),
    marginHorizontal: ScaleSize(16),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(6),
  },
  date: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  divider: {
    backgroundColor: DIVIDER,
    height: 1,
    marginVertical: ScaleSize(4),
  },
  heading: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  productTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    marginBottom: ScaleSize(20),
    marginTop: ScaleSize(6),
    textAlign: 'center',
  },
  root: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  rowCaption: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(2),
  },
  rowLabel: {
    color: TEXT_LABEL,
    fontSize: ScaleSize(14),
  },
  rowLabelBold: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  rowLabelWrap: {
    flex: 1,
  },
  rowValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '500',
    marginLeft: ScaleSize(12),
  },
  rowValueBold: {
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  scrollContent: {
    paddingTop: ScaleSize(16),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(24),
  },
});
