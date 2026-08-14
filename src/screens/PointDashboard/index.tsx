import type { IPointPayHistory } from '@type';
import type { ListRenderItem } from 'react-native';

import imageNames from '@assets/images/names';
import { EmptyView, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { usePointDashboard } from '@hooks';
import { ScaleSize } from '@kits/core';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import DashboardHeader from './DashboardHeader';
import PointHistoryRow from './PointHistoryRow';

const TEXT_COLOR_INFO = '#7A7F85';
const BG_INFO = '#F4F5F6';

const keyExtractor = (item: IPointPayHistory) => String(item.id);

function Separator() {
  return (
    <View style={styles.separatorWrap}>
      <View style={styles.separator} />
    </View>
  );
}

type LoadingProperties = {
  readonly loading: boolean;
};

function Footer({ loading }: LoadingProperties) {
  return loading ? (
    <ActivityIndicator color={Colors.primary} style={styles.footerLoading} />
  ) : undefined;
}

function Empty({ loading }: LoadingProperties) {
  const { t } = useTranslation();
  return loading ? undefined : (
    <EmptyView
      desc={t('common.no_data')}
      icon={imageNames.ic_placeholder_star}
      style={styles.empty}
    />
  );
}

function PointDashboard() {
  const { t } = useTranslation();
  const {
    balance,
    histories,
    expiringAmount,
    loadingHistories,
    loadingMoreHistories,
    onLoadMoreHistories,
    summary,
    onPressItemHistory,
    onUsePoint,
    onViewExpireDetail,
    onViewAllHistory,
  } = usePointDashboard();

  const infoDesc = useMemo(() => {
    const key = `point_expiring.${summary?.deductionOrder?.toLowerCase()}_info`;
    return t(key, { time: summary?.validityDays });
  }, [summary]);

  const lastIndex = histories.length - 1;

  // The rows share one bordered card, so the outer corners live on the first
  // and last row instead of on a wrapper view.
  const renderItem = useCallback<ListRenderItem<IPointPayHistory>>(
    ({ index, item }) => (
      <View
        style={[
          styles.cardRow,
          index === 0 && styles.cardRowFirst,
          index === lastIndex && styles.cardRowLast,
        ]}
      >
        <PointHistoryRow item={item} onPressItem={onPressItemHistory} />
      </View>
    ),
    [lastIndex, onPressItemHistory],
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail
        hideNotify
        title={t('point_dashboard.title')}
        usePaddingTop
      />

      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={histories}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Empty loading={loadingHistories} />}
        ListFooterComponent={<Footer loading={loadingMoreHistories} />}
        ListHeaderComponent={
          <DashboardHeader
            balance={balance}
            expiringAmount={expiringAmount}
            onUsePoint={onUsePoint}
            onViewAllHistory={onViewAllHistory}
            onViewExpireDetail={onViewExpireDetail}
          />
        }
        onEndReached={onLoadMoreHistories}
        onEndReachedThreshold={1.5}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>{infoDesc}</Text>
      </View>
    </View>
  );
}

export default PointDashboard;

const styles = StyleSheet.create({
  cardRow: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray3,
    borderLeftWidth: ScaleSize(1),
    borderRightWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(16),
  },
  cardRowFirst: {
    borderTopLeftRadius: ScaleSize(12),
    borderTopRightRadius: ScaleSize(12),
    borderTopWidth: ScaleSize(1),
    marginTop: ScaleSize(10),
  },
  cardRowLast: {
    borderBottomLeftRadius: ScaleSize(12),
    borderBottomRightRadius: ScaleSize(12),
    borderBottomWidth: ScaleSize(1),
  },
  empty: {
    marginTop: ScaleSize(30),
  },
  footerLoading: {
    paddingVertical: ScaleSize(20),
  },
  infoBanner: {
    alignSelf: 'center',
    backgroundColor: BG_INFO,
    borderRadius: ScaleSize(10),
    bottom: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
    width: '90%',
  },
  infoIcon: {
    fontSize: ScaleSize(14),
  },
  infoText: {
    color: TEXT_COLOR_INFO,
    flex: 1,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
  },
  safeArea: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(20),
  },
  separator: {
    backgroundColor: Colors.gray20,
    height: ScaleSize(1),
  },
  separatorWrap: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray3,
    borderLeftWidth: ScaleSize(1),
    borderRightWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(16),
  },
});
