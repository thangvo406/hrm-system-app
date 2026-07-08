import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HeaderDetail from '@components/HeaderDetail';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/product';
import { useAppDispatch } from '@services/common/storeHooks';
import { getContributeHistoryDetailRequest } from '@services/slices/payment/paymentSlice';
import { ContributeHistoryDetail as TContributeHistoryDetail } from '@type';
import { useRoute } from '@react-navigation/native';
import { ScaleSize } from '@kits/core';
import dayjs from 'dayjs';
import { Colors } from '@constants';

// eslint-disable-next-line react/function-component-definition
const Status = () => {
  return (
    <View style={styles.containerStatus}>
      <Text style={styles.textStatus}>납부완료</Text>
    </View>
  );
};

function ContributeHistoryDetail() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<TContributeHistoryDetail>();
  useEffect(() => {
    dispatch(
      getContributeHistoryDetailRequest({
        historyId: id,
        onSuccess: data => {
          setData(data);
        },
      }),
    );
  }, []);
  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('contribute_history.detail.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.section}>
          <Text style={styles.date}>
            {t('contribute_history.detail.date_label', {
              date: dayjs(data?.requestedAt).format('YYYY-MM-DD hh:mmA'),
            })}
          </Text>
          <Text style={styles.amount}>
            {t('contribute_history.detail.amount_label')}:{' '}
            {formatCurrency(data?.amount)}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.paymentMethodRow}>
            <Text style={styles.paymentMethodSection}>
              {t('contribute_history.detail.payment_method_label')}
            </Text>
            <Status />
          </View>
          <Text style={styles.status}>증좌</Text>
          <Text style={styles.paymentMethod}>{data?.paymentMethod}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default ContributeHistoryDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  textStatus: {
    color: Colors.white,
    fontSize: ScaleSize(12),
  },
  containerStatus: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(10),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(4),
    marginLeft: ScaleSize(10),
  },
  amount: {
    fontSize: ScaleSize(24),
    color: Colors.black,
    marginBottom: ScaleSize(10),
  },
  paymentMethodSection: {
    fontSize: ScaleSize(16),
    color: Colors.black,
  },
  paymentMethod: {
    fontSize: ScaleSize(12),
    color: Colors.black,
    textAlign: 'right',
    marginTop: ScaleSize(13),
    marginBottom: ScaleSize(10),
  },
  status: {
    fontSize: ScaleSize(16),
    color: Colors.black,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: ScaleSize(10),
  },
  date: {
    fontSize: ScaleSize(16),
    color: Colors.black,
    paddingVertical: ScaleSize(10),
  },
  section: {
    backgroundColor: '#FFFFFF',
    // flex: 1,
    marginBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(25),
    marginHorizontal: ScaleSize(20),
    marginTop: ScaleSize(20),
    padding: ScaleSize(10),
    borderRadius: ScaleSize(10),
  },
  scrollContent: {
    flexGrow: 1,
  },
  paymentMethodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: ScaleSize(13),
  },
  scrollView: {
    flex: 1,
  },
});
