import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch } from '@services/common/storeHooks';
import { getTransactionsMovementRequest } from '@services/slices/account/accountSlice';
import { ITransactionMovement, ListApiResponse } from '@type';

import TransactionItem from './TransactionItem';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

const useTransaction = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const [data, setData] = useState<ITransactionMovement[]>([]);
  const isLoadingMore = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSuccess = (data: ListApiResponse<ITransactionMovement[]>) => {
    isLast.current = data.last;
    setLoading(false);
    setData(prev => {
      let results = [];
      results =
        currentPage != 0
          ? (prev || [])?.concat?.(data?.content)
          : data?.content;
      isLoadingMore.current = false;
      return results;
    });
  };

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      getTransactionsMovementRequest({
        page: currentPage,
        size: 10,
        onFailure: handleFailure,
        onSuccess: handleSuccess,
      }),
    );
  }, [dispatch, currentPage]);

  const onPressTransaction = (item: any) => {
    AppNavigator.navigate(Paths.TransactionDetail, { transactionId: item?.id });
  };

  return {
    onLoadMore,
    onPressTransaction,
    data,
    loading,
    error,
  };
};

type Properties = {
  readonly onViewAllTransactions: () => void;
};

function TransactionHistories({ onViewAllTransactions }: Properties) {
  const { t } = useTranslation();
  const { data, onPressTransaction } = useTransaction();

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('account_management.recent_history')}
        </Text>
        <AppButton
          onPress={onViewAllTransactions}
          style={styles.manageButton}
          testID="account-management-view-all"
        >
          <Text style={styles.manageText}>
            {t('account_management.view_all')}
          </Text>
        </AppButton>
      </View>

      <View style={styles.list}>
        {data?.length > 0 ? (
          data.map((transaction, index) => (
            <TransactionItem
              key={`${index}`}
              transaction={transaction}
              onPress={onPressTransaction}
            />
          ))
        ) : (
          <Text style={styles.desc}>{t('account_management.no_history')}</Text>
        )}
      </View>
    </>
  );
}

export default React.memo(TransactionHistories);

const styles = StyleSheet.create({
  desc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(28),
    paddingHorizontal: ScaleSize(20),
  },
  list: {
    paddingHorizontal: ScaleSize(20),
  },
  manageButton: {
    borderColor: '#DBDBDB',
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
  },
  manageText: {
    color: '#717171',
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '800',
  },
});
