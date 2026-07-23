import { AppButton, HeaderDetail } from '@components';
import { PRIMARY_CARD_INDEX, useSourceOfFund } from '@hooks/useSourceOfFund';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Cards from './Cards';
import MembershipCards from './MembershipCards';
import TransactionHistories from './TransactionHistories';
import WalletCard from './WalletCard';

function SourceOfFund() {
  const { t } = useTranslation();
  const {
    accounts,
    balance,
    cards,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onRegisterAccount,
    onRegisterCard,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    point,
    transactions,
    isShowUnRegister,
  } = useSourceOfFund();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('source_of_fund.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.walletWrap}>
          <WalletCard
            balance={balance}
            onCharge={onCharge}
            onChargeHistory={onChargeHistory}
            onUse={onUse}
            point={point}
            toggleUnRegister={toggleUnRegister}
            isShowUnRegister={isShowUnRegister}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('source_of_fund.payment_methods')}
          </Text>
          <AppButton
            onPress={onManagePaymentMethods}
            style={styles.manageButton}
            testID="source-of-fund-manage"
          >
            <Text style={styles.manageText}>{t('source_of_fund.manage')}</Text>
          </AppButton>
        </View>

        <MembershipCards
          cards={cards}
          initialIndex={PRIMARY_CARD_INDEX}
          isShowUnRegister={isShowUnRegister}
        />

        <Cards
          accounts={accounts}
          isShowUnRegister={isShowUnRegister}
          onRegisterAccount={onRegisterAccount}
          onRegisterCard={onRegisterCard}
        />

        <TransactionHistories
          onViewAllTransactions={onViewAllTransactions}
          transactions={transactions}
        />
      </ScrollView>
    </View>
  );
}

export default SourceOfFund;

const styles = StyleSheet.create({
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
  safeArea: {
    backgroundColor: '#F5F6F7',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(28),
    paddingHorizontal: ScaleSize(20),
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '800',
  },
  walletWrap: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
});
