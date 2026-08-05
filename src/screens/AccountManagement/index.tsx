import {
  AppButton,
  HeaderDetail,
  Cards,
  BankAccounts,
  Image,
} from '@components';
import {
  PRIMARY_CARD_INDEX,
  useAccountManagement,
} from '@hooks/useAccountManagement';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import TransactionHistories from './TransactionHistories';
import WalletCard from './WalletCard';
import imageNames from '@assets/images/names';
import { Colors } from '@constants';

function AccountManagement() {
  const { t } = useTranslation();
  const {
    accounts,
    balance,
    cards,
    onCharge,
    onChargeHistory,
    onManagePaymentMethods,
    onRegisterAccount,
    // onRegisterCard,
    onUse,
    onViewAllTransactions,
    toggleUnRegister,
    point,
    isShowUnRegister,
    isEmptyBankAccount,
    isEnablePaymentCard,
  } = useAccountManagement();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('account_management.title')} />
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
            {t('account_management.payment_methods')}
          </Text>
          {isEnablePaymentCard ? (
            <AppButton
              onPress={onManagePaymentMethods}
              style={styles.manageButton}
              testID="account-management-manage"
            >
              <Text style={styles.manageText}>
                {t('account_management.manage')}
              </Text>
            </AppButton>
          ) : undefined}
        </View>

        {!isEmptyBankAccount ? (
          <BankAccounts
            accounts={cards}
            hideAddCard={!isEnablePaymentCard}
            initialIndex={PRIMARY_CARD_INDEX}
            isShowUnRegister={isShowUnRegister}
            onRegisterCard={onRegisterAccount}
          />
        ) : (
          <>
            <Text style={styles.coopPayLabel}>
              {t('account_management.coop_pay_label')}
            </Text>
            <Image
              name={imageNames.ic_empty_illustration}
              width={ScaleSize(72)}
              height={ScaleSize(72)}
              style={{
                alignSelf: 'center',
                marginVertical: ScaleSize(20),
              }}
            />
          </>
        )}

        <Cards
          accounts={accounts}
          hideRegisterAccount={!isEnablePaymentCard}
          isShowUnRegister={isShowUnRegister}
          onRegisterAccount={onRegisterAccount}
          initialIndex={PRIMARY_CARD_INDEX}
          // onRegisterCard={onRegisterCard}
        />

        <TransactionHistories onViewAllTransactions={onViewAllTransactions} />
      </ScrollView>
    </View>
  );
}

export default AccountManagement;

const styles = StyleSheet.create({
  manageButton: {
    borderColor: '#DBDBDB',
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
  },
  coopPayLabel: {
    color: Colors.green04,
    fontSize: ScaleSize(14),
    fontWeight: 'bold',
    paddingHorizontal: ScaleSize(17),
    marginTop: ScaleSize(10),
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
