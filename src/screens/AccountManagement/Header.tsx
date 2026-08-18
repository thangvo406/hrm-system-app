import type { IAccount, IResponseOrganizationInfo } from '@type';

import { AppButton, BankAccounts, Cards, Image } from '@components';
import { PRIMARY_CARD_INDEX } from '@hooks/useAccountManagement';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import WalletCard from './WalletCard';
import imageNames from '@assets/images/names';
import { Colors } from '@constants';

type Properties = {
  readonly accounts?: readonly IAccount[];
  readonly balance?: number;
  readonly cards?: readonly IAccount[];
  readonly isEmptyBankAccount: boolean;
  readonly isEnablePaymentCard: boolean;
  readonly isShowBottomButtonWallet: boolean;
  readonly isShowUnRegister: boolean;
  readonly onCharge: () => void;
  readonly onChargeHistory: () => void;
  readonly onManagePaymentMethods: () => void;
  readonly onRegisterAccount: () => void;
  readonly onUse: () => void;
  readonly onUseOrganize: (info?: IResponseOrganizationInfo) => void;
  readonly onViewAllTransactions: () => void;
  readonly organizationInfo?: IResponseOrganizationInfo[];
  readonly point?: number;
  readonly toggleUnRegister: () => void;
};

function AccountManagementHeader({
  accounts,
  balance,
  cards,
  isEmptyBankAccount,
  isEnablePaymentCard,
  isShowBottomButtonWallet,
  isShowUnRegister,
  onCharge,
  onChargeHistory,
  onManagePaymentMethods,
  onRegisterAccount,
  onUse,
  onUseOrganize,
  onViewAllTransactions,
  organizationInfo,
  point,
  toggleUnRegister,
}: Properties) {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.walletWrap}>
        <WalletCard
          balance={balance}
          onCharge={onCharge}
          onUseOrganize={onUseOrganize}
          onChargeHistory={onChargeHistory}
          onUse={onUse}
          organizationInfo={organizationInfo}
          point={point}
          toggleUnRegister={toggleUnRegister}
          isShowBottomButton={isShowBottomButtonWallet}
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
            style={styles.emptyIllustration}
          />
        </>
      )}

      <Cards
        accounts={accounts}
        hideRegisterAccount={!isEnablePaymentCard}
        isShowUnRegister={isShowUnRegister}
        onRegisterAccount={onRegisterAccount}
        initialIndex={PRIMARY_CARD_INDEX}
      />

      <View style={[styles.sectionHeader, styles.transactionsHeaderSpacing]}>
        <Text style={styles.sectionTitle}>
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
    </>
  );
}

export default React.memo(AccountManagementHeader);

const styles = StyleSheet.create({
  coopPayLabel: {
    color: Colors.green04,
    fontSize: ScaleSize(14),
    fontWeight: 'bold',
    marginTop: ScaleSize(10),
    paddingHorizontal: ScaleSize(17),
  },
  emptyIllustration: {
    alignSelf: 'center',
    marginVertical: ScaleSize(20),
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
  transactionsHeaderSpacing: {
    marginBottom: ScaleSize(13),
  },
  walletWrap: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
});
