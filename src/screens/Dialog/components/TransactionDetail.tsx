import { ScaleSize } from '@kits/core';
import { TransactionHistory } from '@type';
import { formatCurrency } from '@utils/product';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const TITLE_COLOR = '#1A1A1A';
const LABEL_COLOR = '#9E9E9E';
const CARD_BG = '#FFFFFF';
const SECTION_BG = '#F5F5F5';

const SECTION_TITLE_SIZE = ScaleSize(16);
const LABEL_FONT_SIZE = ScaleSize(13);
const AMOUNT_FONT_SIZE = ScaleSize(22);
const TYPE_FONT_SIZE = ScaleSize(18);
const SUB_TYPE_FONT_SIZE = ScaleSize(12);

type TransactionDetailProps = {
  readonly data: TransactionHistory;
};

function TransactionDetail({ data }: TransactionDetailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="transaction-detail">
      <Text style={styles.sectionTitle}>
        {t('pay_card.transaction_detail.title')}
      </Text>

      <View style={styles.card}>
        <Text style={styles.dateLabel}>
          {t('pay_card.transaction_detail.date_label')} :{' '}
          {dayjs(data.createdDate).format('YYYY-MM-DD hh:mmA')}
        </Text>
        <Text style={styles.amount}>
          {t('pay_card.transaction_detail.amount_label')} :{' '}
          {formatCurrency(data?.amount)}
        </Text>
      </View>

      <View style={styles.typeSection}>
        <Text style={styles.typeLabel}>
          {t('pay_card.transaction_detail.type_label')}
        </Text>
        <View style={styles.typeValueContainer}>
          <Text style={styles.typeValue}>{data?.transactionType}</Text>
          <Text style={styles.subTypeValue}>{data?.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: TITLE_COLOR,
    fontSize: AMOUNT_FONT_SIZE,
    fontWeight: '700',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(8),
    marginTop: ScaleSize(12),
    paddingVertical: ScaleSize(20),
  },
  container: {
    backgroundColor: SECTION_BG,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(20),
    width: '100%',
  },
  dateLabel: {
    color: LABEL_COLOR,
    fontSize: LABEL_FONT_SIZE,
  },
  sectionTitle: {
    color: TITLE_COLOR,
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: '700',
  },
  subTypeValue: {
    color: LABEL_COLOR,
    fontSize: SUB_TYPE_FONT_SIZE,
    marginTop: ScaleSize(2),
    textAlign: 'right',
  },
  typeLabel: {
    color: TITLE_COLOR,
    fontSize: LABEL_FONT_SIZE,
  },
  typeSection: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(8),
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  typeValue: {
    color: TITLE_COLOR,
    fontSize: TYPE_FONT_SIZE,
    fontWeight: '600',
    textAlign: 'right',
  },
  typeValueContainer: {
    alignItems: 'flex-end',
    marginTop: ScaleSize(20),
  },
});

export default React.memo(TransactionDetail);
