import type { TRequestDetail } from '@type/requests';

import React from 'react';
import { Colors } from '@constants';
import { formatLeaveDays } from '@utils/requests';
import { REQUEST_TYPE_STYLES } from '@screens/Requests/requestTypes';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const DURATION_LABEL_KEYS = {
  afternoon: 'create_request.duration_afternoon',
  full_day: 'create_request.duration_full_day',
  morning: 'create_request.duration_morning',
};

type RowProperties = {
  readonly label: string;
  readonly value: string;
};

function InfoRow({ label, value }: RowProperties) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

type Properties = {
  readonly detail: TRequestDetail;
};

/** Bảng thông tin chung của đơn: nhãn bên trái, giá trị bên phải. */
function InfoRows({ detail }: Properties) {
  const { t } = useTranslation();

  const periodLabel = detail.endDate
    ? t('request_detail.period_range', {
        end: detail.endDate,
        start: detail.startDate,
      })
    : detail.startDate;

  return (
    <View style={styles.container}>
      <InfoRow
        label={t('request_detail.field_type')}
        value={t(REQUEST_TYPE_STYLES[detail.type].labelKey)}
      />
      <InfoRow label={t('request_detail.field_period')} value={periodLabel} />
      <InfoRow
        label={t('request_detail.field_days')}
        value={t('request_detail.days_value', {
          days: formatLeaveDays(detail.dayCount),
        })}
      />
      <InfoRow
        label={t('request_detail.field_remaining')}
        value={t('request_detail.remaining_value', {
          days: formatLeaveDays(detail.remainingDays),
        })}
      />

      <View style={styles.row}>
        <Text style={styles.label}>{t('request_detail.field_duration')}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>
            {t(DURATION_LABEL_KEYS[detail.duration])}
          </Text>
        </View>
      </View>

      {/* Lý do dài nhiều dòng nên xuống hàng riêng thay vì ép vào cột phải. */}
      <View style={styles.reasonRow}>
        <Text style={styles.label}>{t('request_detail.field_reason')}</Text>
        <Text style={styles.reason}>{detail.reason}</Text>
      </View>
    </View>
  );
}

export default React.memo(InfoRows);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.blue06,
    borderRadius: ScaleSize(8),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  chipLabel: {
    color: Colors.blue02,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  container: {
    gap: ScaleSize(12),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    width: ScaleSize(116),
  },
  reason: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
  },
  reasonRow: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  value: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
