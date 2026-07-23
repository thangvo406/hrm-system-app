import { AppButton, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePointMain } from '@hooks';
import { useTranslation } from 'react-i18next';
import React from 'react';
import PointBalanceCard from './PointBalanceCard';
import PointHistoryRow from './PointHistoryRow';

const CHEVRON_SIZE = ScaleSize(16);
const TEXT_COLOR_WARNING = '#B8730D';
function PointMain() {
  const { t } = useTranslation();
  const {
    balance,
    expiringAmount,
    histories,
    onLegacyLookup,
    onUsePoint,
    onViewAllHistory,
    onViewExpireDetail,
  } = usePointMain();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title="" usePaddingTop />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('point_main.title')}</Text>
        <Text style={styles.subtitle}>{t('point_main.subtitle')}</Text>
        <PointBalanceCard balance={balance} onUse={onUsePoint} />

        <View style={styles.warningBanner}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            {t('point_main.expire_warning', { amount: expiringAmount })}
          </Text>
          <AppButton onPress={onViewExpireDetail} testID="point-main-expire">
            <Text style={styles.linkText}>
              {`${t('point_main.expire_detail')} ›`}
            </Text>
          </AppButton>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('point_main.history_title')}
          </Text>
          <AppButton onPress={onViewAllHistory} testID="point-main-view-all">
            <Text style={[styles.linkText, { color: Colors.gray06 }]}>
              {`${t('point_main.view_all')} ›`}
            </Text>
          </AppButton>
        </View>

        <View style={styles.historyCard}>
          {histories.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.separator} />}
              <PointHistoryRow item={item} />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>{t('point_main.info')}</Text>
        </View>

        <AppButton
          onPress={onLegacyLookup}
          style={styles.legacyCard}
          testID="point-main-legacy"
        >
          <Text style={styles.legacyText}>{t('point_main.legacy_lookup')}</Text>
          <Image
            color={Colors.gray08}
            height={CHEVRON_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={CHEVRON_SIZE}
          />
        </AppButton>
      </ScrollView>
    </View>
  );
}

export default PointMain;

const styles = StyleSheet.create({
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
  },
  walletWrap: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
  infoBanner: {
    backgroundColor: '#F4F5F6',
    borderRadius: ScaleSize(10),
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  infoIcon: {
    fontSize: ScaleSize(14),
  },
  infoText: {
    color: '#7A7F85',
    flex: 1,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
  },
  legacyCard: {
    alignItems: 'center',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(18),
  },
  legacyText: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  linkText: {
    color: TEXT_COLOR_WARNING,
    fontSize: ScaleSize(13),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(20),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(24),
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  separator: {
    backgroundColor: '#F0F0F0',
    height: 1,
  },
  subtitle: {
    color: '#8A8F94',
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(20),
    marginTop: ScaleSize(4),
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginTop: ScaleSize(8),
  },
  warningBanner: {
    alignItems: 'center',
    backgroundColor: '#FEF6E1',
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
