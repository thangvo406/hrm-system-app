import { AppButton } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import PointBalanceCard from './PointBalanceCard';

const TEXT_COLOR_WARNING = '#B8730D';
const TEXT_COLOR_SUBTITLE = '#8A8F94';
const BG_WARNING = '#FEF6E1';

type Properties = {
  readonly balance?: number;
  readonly expiringAmount?: number;
  readonly onUsePoint: () => void;
  readonly onViewAllHistory: () => void;
  readonly onViewExpireDetail: () => void;
};

function DashboardHeader({
  balance,
  expiringAmount,
  onUsePoint,
  onViewAllHistory,
  onViewExpireDetail,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.subtitle}>{t('point_dashboard.subtitle')}</Text>

      <PointBalanceCard balance={balance} onUse={onUsePoint} />

      {(expiringAmount || 0) > 0 ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            {t('point_dashboard.expire_warning', {
              amount: formatCurrency(expiringAmount || 0),
            })}
          </Text>
          <AppButton
            onPress={onViewExpireDetail}
            testID="point-dashboard-expire"
          >
            <Text style={styles.linkText}>
              {`${t('point_dashboard.expire_detail')} ›`}
            </Text>
          </AppButton>
        </View>
      ) : undefined}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('point_dashboard.history_title')}
        </Text>
        <AppButton onPress={onViewAllHistory} testID="point-dashboard-view-all">
          <Text style={styles.viewAllText}>
            {`${t('point_dashboard.view_all')} ›`}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default React.memo(DashboardHeader);

const styles = StyleSheet.create({
  linkText: {
    color: Colors.primary,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(24),
  },
  sectionTitle: {
    color: Colors.black01,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  subtitle: {
    color: TEXT_COLOR_SUBTITLE,
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(20),
    marginTop: ScaleSize(14),
  },
  viewAllText: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    fontWeight: 'bold',
  },
  warningBanner: {
    alignItems: 'center',
    backgroundColor: BG_WARNING,
    borderRadius: ScaleSize(10),
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  warningIcon: {
    fontSize: ScaleSize(14),
  },
  warningText: {
    color: TEXT_COLOR_WARNING,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});
