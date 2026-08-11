import type { ListRenderItem } from 'react-native';
import type { IPointExpiryItem } from '@type/wallet';

import { AppButton, EmptyView, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCallback } from 'react';
import { usePointExpiring } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ExpiringRow from './ExpiringRow';
import ExpiringSummaryCard from './ExpiringSummaryCard';
import imageNames from '@assets/images/names';

const FOOTER_BOTTOM_SPACING = ScaleSize(12);

const keyExtractor = (item: IPointExpiryItem) => String(item.id);

const renderItem: ListRenderItem<IPointExpiryItem> = ({ item }) => (
  <ExpiringRow item={item} />
);

function PointExpiring() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    expiringWindowDays,
    items,
    loading,
    summary,
    onLoadMore,
    onUsePoint,
  } = usePointExpiring();

  const renderEmpty = useCallback(
    () => (
      <EmptyView
        desc={t('common.no_data')}
        icon={imageNames.ic_mega_phone}
        style={styles.empty}
      />
    ),
    [t],
  );

  return (
    <View style={styles.container}>
      <HeaderDetail
        hideNotify
        title={t('point_expiring.title')}
        usePaddingTop
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t('point_expiring.subtitle')}</Text>

        <ExpiringSummaryCard
          expiringWindowDays={expiringWindowDays}
          nearestExpiryDate={summary?.nextExpiryDate}
          totalAmount={summary?.currentBalance}
        />

        <Text style={styles.sectionTitle}>
          {t('point_expiring.list_title')}
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={styles.loading} />
        ) : (
          <FlatList
            ListEmptyComponent={renderEmpty}
            data={items}
            keyExtractor={keyExtractor}
            onEndReached={onLoadMore}
            onEndReachedThreshold={1.5}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>{t('point_expiring.info')}</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + FOOTER_BOTTOM_SPACING },
        ]}
      >
        <AppButton
          onPress={onUsePoint}
          style={styles.cta}
          testID="point-expiring-use"
        >
          <Text style={styles.ctaText}>{t('point_expiring.use_action')}</Text>
        </AppButton>
      </View>
    </View>
  );
}

export default PointExpiring;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(26),
    height: ScaleSize(52),
    justifyContent: 'center',
  },
  ctaText: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  empty: {
    paddingVertical: ScaleSize(32),
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  infoBanner: {
    backgroundColor: Colors.gray21,
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
    color: Colors.gray17,
    flex: 1,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
  },
  loading: {
    marginTop: ScaleSize(24),
  },
  scrollContent: {
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
  },
  sectionTitle: {
    color: Colors.black01,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(24),
  },
  subtitle: {
    color: Colors.gray24,
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(16),
    marginTop: ScaleSize(14),
  },
});
