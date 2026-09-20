import type { THomeBalance } from '@type/home';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CHEVRON_BUTTON_SIZE = ScaleSize(32);
const CHEVRON_ICON_SIZE = ScaleSize(16);

/** Tiếng Việt dùng dấu phẩy thập phân: 6.5 ngày phép đọc là "6,5". */
const formatDays = (days: number) => String(days).replace('.', ',');

type Properties = {
  readonly balance: THomeBalance;
  readonly onPress: () => void;
};

/** Dải tóm tắt: số ngày phép còn lại và số đơn đang chờ duyệt. */
function LeaveSummary({ balance, onPress }: Properties) {
  const { t } = useTranslation();

  return (
    <AppButton
      onPress={onPress}
      style={styles.container}
      testID="HomeLeaveSummary"
    >
      <View style={styles.stat}>
        <Text style={styles.label}>{t('home.leave_remaining_label')}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>
            {formatDays(balance.remainingLeaveDays)}
          </Text>
          <Text style={styles.unit}>
            {t('home.leave_remaining_total', { total: balance.totalLeaveDays })}
          </Text>
        </View>
      </View>

      <View style={styles.stat}>
        <Text style={styles.label}>{t('home.pending_requests_label')}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, styles.valuePending]}>
            {balance.pendingRequests}
          </Text>
          <Text style={styles.unit}>{t('home.pending_requests_unit')}</Text>
        </View>
      </View>

      <View style={styles.chevron}>
        <Image
          color={Colors.gray24}
          height={CHEVRON_ICON_SIZE}
          name="ic_chevron_right"
          type="svg"
          width={CHEVRON_ICON_SIZE}
        />
      </View>
    </AppButton>
  );
}

export default React.memo(LeaveSummary);

const styles = StyleSheet.create({
  chevron: {
    alignItems: 'center',
    backgroundColor: Colors.gray21,
    borderRadius: ScaleSize(10),
    height: CHEVRON_BUTTON_SIZE,
    justifyContent: 'center',
    width: CHEVRON_BUTTON_SIZE,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(16),
    padding: ScaleSize(16),
  },
  label: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
  },
  stat: {
    flex: 1,
  },
  unit: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
    marginLeft: ScaleSize(4),
  },
  value: {
    color: Colors.navy04,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  valuePending: {
    color: Colors.orange02,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginTop: ScaleSize(2),
  },
});
