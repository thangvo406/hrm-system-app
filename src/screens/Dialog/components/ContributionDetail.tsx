import type { IContributeHistoryDetail } from '@type';

import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

type StatusBadge = {
  readonly color: string;
  readonly labelKey: string;
};

// Data-driven status → badge map. Add a new status = add one entry here
// (+ the i18n key); anything unmapped falls back to FAILED_BADGE.
const STATUS_BADGES: Record<string, StatusBadge> = {
  APPROVED: {
    color: Colors.primary,
    labelKey: 'contribute_history.detail.statuses.approved',
  },
  PENDING: {
    color: '#1A1F4D',
    labelKey: 'contribute_history.detail.statuses.pending',
  },
  CANCELLED: {
    color: '#D0342C',
    labelKey: 'contribute_history.detail.statuses.failed',
  },
};

type StatusProps = {
  readonly status?: string;
};

function Status({ status }: StatusProps) {
  const { t } = useTranslation();
  const badge = STATUS_BADGES[status ?? ''] || STATUS_BADGES.PENDING; // OK, vì rule đã OFF
  return (
    <View style={[styles.containerStatus, { backgroundColor: badge.color }]}>
      <Text style={styles.textStatus}>{t(badge.labelKey)}</Text>
    </View>
  );
}

type ContributionDetailProps = {
  readonly data?: IContributeHistoryDetail;
  readonly title?: string;
};

function ContributionDetailComponent({ data, title }: ContributionDetailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="contribution-detail">
      <Text style={styles.sectionTitle}>
        {title ?? t('contribute_history.detail.title')}
      </Text>

      <View style={styles.section}>
        <Text style={styles.date}>
          {t('contribute_history.detail.date_label')}:
          <Text
            style={{
              fontSize: ScaleSize(16),
            }}
          >
            {` ${dayjs(data?.requestedAt).format('YYYY-MM-DD   hh:mmA')}`}
          </Text>
        </Text>
        <Text style={styles.amount}>
          {t('contribute_history.detail.amount_label')}:
          <Text
            style={{
              fontSize: ScaleSize(24),
            }}
          >
            {` ${t('common.display_price', {
              amount: formatCurrency(data?.amount),
            })}`}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.paymentMethodRow}>
          <Text style={styles.paymentMethodSection}>
            {t('contribute_history.detail.payment_method_label')}
          </Text>
          <Status status={data?.status} />
        </View>
        <Text style={styles.status}>{data?.displayType}</Text>
        <Text style={styles.paymentMethod}>{data?.paymentMethod?.type}</Text>
        {/* <Text style={styles.paymentMethod}>{data?.paymentType}</Text> */}
      </View>
    </View>
  );
}

type DividendDetailProps = {
  readonly data?: IContributeHistoryDetail;
};

function DividendDetail({ data }: DividendDetailProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="dividend-detail">
      <Text style={styles.sectionTitle}>
        {t('contribute_history.dividend_detail.title')}
      </Text>

      <View style={styles.section}>
        <Text style={styles.date}>
          {t('contribute_history.dividend_detail.date_label')}:
          <Text
            style={{
              fontSize: ScaleSize(16),
            }}
          >
            {` ${dayjs(data?.paidAt).format('YYYY-MM-DD   hh:mmA')}`}
          </Text>
        </Text>
        <Text style={styles.amount}>
          {t('contribute_history.dividend_detail.amount_label')}:
          <Text
            style={{
              fontSize: ScaleSize(24),
            }}
          >
            {` ${t('common.display_price', {
              amount: formatCurrency(data?.totalDividend),
            })}`}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionDividendTitle}>
          {t('contribute_history.dividend_detail.contribution_dividend')}:
        </Text>
        <Text style={styles.sectionDividendValue}>
          {t('common.display_price', {
            amount: formatCurrency(data?.contributionDividend),
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionDividendTitle}>
          {t('contribute_history.dividend_detail.usage_dividend')}:
        </Text>
        <Text style={styles.sectionDividendValue}>
          {t('common.display_price', {
            amount: formatCurrency(data?.usageDividend),
          })}
        </Text>
      </View>
    </View>
  );
}

const ContributionDetail = (props: any) => {
  const { isContribute } = props || {};

  const Component = isContribute ? ContributionDetailComponent : DividendDetail;
  return <Component {...props} />;
};

export default React.memo(ContributionDetail);

const styles = StyleSheet.create({
  amount: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    marginBottom: ScaleSize(10),
    textAlign: 'right',
  },
  container: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(20),
    width: '100%',
    // borderWidth: 1,
  },
  containerStatus: {
    alignSelf: 'flex-start',
    borderRadius: ScaleSize(10),
    marginLeft: ScaleSize(10),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(4),
  },
  date: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    paddingVertical: ScaleSize(10),
    textAlign: 'right',
  },
  paymentMethod: {
    color: Colors.black,
    fontSize: ScaleSize(12),
    // marginBottom: ScaleSize(10),
    marginTop: ScaleSize(13),
    textAlign: 'right',
  },
  paymentMethodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: ScaleSize(13),
  },
  paymentMethodSection: {
    color: Colors.black,
    fontSize: ScaleSize(16),
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(10),
    marginTop: ScaleSize(16),
    padding: ScaleSize(10),
    paddingHorizontal: ScaleSize(25),
  },
  sectionDividendTitle: {
    color: Colors.black,
    fontSize: ScaleSize(16),
  },
  sectionDividendValue: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    marginTop: ScaleSize(6),
    textAlign: 'right',
  },
  sectionTitle: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  status: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
    marginTop: ScaleSize(10),
    textAlign: 'right',
  },
  textStatus: {
    color: Colors.white,
    fontSize: ScaleSize(12),
  },
});
