import type { ListRenderItem } from 'react-native';
import type { ITransactionMovement } from '@type';

import { HeaderDetail } from '@components';
import { useAccountManagement } from '@hooks/useAccountManagement';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AccountManagementHeader from './Header';
import TransactionItem from './TransactionItem';
import { Colors } from '@constants';

const keyExtractor = (item: ITransactionMovement) => item.transactionKey;

type FooterProperties = {
  readonly loading: boolean;
};

function Footer({ loading }: FooterProperties) {
  return loading ? (
    <ActivityIndicator color={Colors.primary} style={styles.footerLoading} />
  ) : undefined;
}

type EmptyProperties = {
  readonly loading: boolean;
};

function Empty({ loading }: EmptyProperties) {
  const { t } = useTranslation();
  return loading ? undefined : (
    <Text style={styles.desc}>{t('account_management.no_history')}</Text>
  );
}

function AccountManagement() {
  const { t } = useTranslation();
  const {
    accounts,
    balance,
    cards,
    loadingMoreTransactions,
    loadingTransactions,
    onCharge,
    onChargeHistory,
    onLoadMoreTransactions,
    onManagePaymentMethods,
    onPressTransaction,
    onRegisterAccount,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    onUseOrganize,
    point,
    organizationInfo,
    isShowUnRegister,
    isShowBottomButtonWallet,
    isEmptyBankAccount,
    isEnablePaymentCard,
    transactions,
  } = useAccountManagement();

  const renderItem = useCallback<ListRenderItem<ITransactionMovement>>(
    ({ item }) => (
      <View style={styles.rowWrap}>
        <TransactionItem transaction={item} onPress={onPressTransaction} />
      </View>
    ),
    [onPressTransaction],
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('account_management.title')} />
      <FlatList
        contentContainerStyle={styles.scrollContent}
        data={transactions}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<Empty loading={loadingTransactions} />}
        ListFooterComponent={<Footer loading={loadingMoreTransactions} />}
        ListHeaderComponent={
          <AccountManagementHeader
            accounts={accounts}
            balance={balance}
            cards={cards}
            isEmptyBankAccount={isEmptyBankAccount}
            isEnablePaymentCard={isEnablePaymentCard}
            isShowBottomButtonWallet={isShowBottomButtonWallet}
            isShowUnRegister={isShowUnRegister}
            onCharge={onCharge}
            onChargeHistory={onChargeHistory}
            onManagePaymentMethods={onManagePaymentMethods}
            onRegisterAccount={onRegisterAccount}
            onUse={onUse}
            onUseOrganize={onUseOrganize}
            onViewAllTransactions={onViewAllTransactions}
            organizationInfo={organizationInfo}
            point={point}
            toggleUnRegister={toggleUnRegister}
          />
        }
        onEndReached={onLoadMoreTransactions}
        onEndReachedThreshold={0.4}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default AccountManagement;

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
  footerLoading: {
    paddingVertical: ScaleSize(20),
  },
  rowWrap: {
    paddingHorizontal: ScaleSize(20),
  },
  safeArea: {
    backgroundColor: '#F5F6F7',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
});
