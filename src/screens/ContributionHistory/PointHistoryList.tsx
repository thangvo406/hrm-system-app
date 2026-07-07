import type { ListRenderItem } from 'react-native';
import type { TransactionHistory } from '@type';

import { EmptyView, TransactionHistoriesLoading } from '@components';
import { FlatList } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import { MemoTransactionRow } from './TransactionList';

const keyExtractor = (item: TransactionHistory) => String(item.id);

const renderItem: ListRenderItem<TransactionHistory> = ({ item }) => (
  <MemoTransactionRow item={item} />
);

type PointHistoryListProps = {
  readonly data: readonly TransactionHistory[];
  readonly loading: boolean;
  readonly onLoadMore?: () => void;
};

function PointHistoryList({ loading, data, onLoadMore = undefined }: PointHistoryListProps) {
  const { t } = useTranslation();

  return (
    <>
      {loading ? (
        <TransactionHistoriesLoading />
      ) : data?.length > 0 ? (
        <FlatList
          data={data as TransactionHistory[]}
          keyExtractor={keyExtractor}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyView
          desc={t('common.no_data')}
          icon={imageNames.ic_tran_history}
        />
      )}
    </>
  );
}

export default PointHistoryList;
