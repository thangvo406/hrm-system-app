import type { ListRenderItem } from 'react-native';
import type { PayCardTransaction } from '@hooks';

import { EmptyView, TransactionHistoriesLoading } from '@components';
import { FlatList } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';
import { MemoTransactionRow } from './TransactionList';

const keyExtractor = (item: PayCardTransaction) => item.id;

const renderItem: ListRenderItem<PayCardTransaction> = ({ item }) => (
  <MemoTransactionRow item={item} />
);

type PointHistoryListProps = {
  readonly data: readonly PayCardTransaction[];
  readonly loading: boolean;
};

function PointHistoryList({ loading, data }: PointHistoryListProps) {
  const { t } = useTranslation();

  return (
    <>
      {loading ? (
        <TransactionHistoriesLoading />
      ) : data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
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
