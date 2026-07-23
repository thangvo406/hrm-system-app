import type { WalletTransaction } from '@hooks/useSourceOfFund';

import { AppButton } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import TransactionRow from './TransactionRow';

type Properties = {
  readonly onViewAllTransactions: () => void;
  readonly transactions: readonly WalletTransaction[];
};

function UseHistories({ onViewAllTransactions, transactions }: Properties) {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{t('source_of_fund.recent_history')}</Text>
        <AppButton
          onPress={onViewAllTransactions}
          style={styles.manageButton}
          testID="source-of-fund-view-all"
        >
          <Text style={styles.manageText}>{t('source_of_fund.view_all')}</Text>
        </AppButton>
      </View>

      <View style={styles.list}>
        {
          transactions?.length > 0 ? 
          transactions.map(transaction => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          )) : (
            <Text style={styles.desc}>{t('source_of_fund.no_history')}</Text>
          )
        }
      </View>
    </>
  );
}

export default React.memo(UseHistories);

const styles = StyleSheet.create({
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
  desc: {
    color: '#718096',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    textAlign: 'center'
  }
});
