import type { ListRenderItem } from 'react-native';
import type { PayCardTransaction } from '@hooks';

import { EmptyView } from '@components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#7A7A7A';

function PointRow({ item }: { readonly item: PayCardTransaction }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row} testID={`pay-card-point-${item.id}`}>
      <View style={styles.topRow}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.balance}>
          {t('pay_card.balance_after', { amount: item.balanceAfter })}
        </Text>
      </View>
    </View>
  );
}

const MemoPointRow = React.memo(PointRow);

const keyExtractor = (item: PayCardTransaction) => item.id;

const renderItem: ListRenderItem<PayCardTransaction> = ({ item }) => (
  <MemoPointRow item={item} />
);

type PointHistoryListProps = {
  readonly data: readonly PayCardTransaction[];
};

function PointHistoryList({ data }: PointHistoryListProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <EmptyView
        desc={t('common.no_data')}
        icon={imageNames.ic_tran_history}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  amount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  balance: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(16),
  },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  date: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  description: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(16),
    marginRight: ScaleSize(8),
  },
  row: {
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    paddingVertical: ScaleSize(16),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PointHistoryList;
