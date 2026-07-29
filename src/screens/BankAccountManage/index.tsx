import { ScrollView, StyleSheet, View } from 'react-native';
import { HeaderDetail } from '@components';
import { useBankAccount } from '@hooks';
import { PRIMARY_CARD_INDEX } from '@hooks/useBankAccount';
import { ScaleSize } from '@kits/core';
import CardList from './CardList';
import { useTranslation } from 'react-i18next';

function BankAccountManage() {
  const { cards, accounts } = useBankAccount();

  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <HeaderDetail hideNotify title={t('account_management.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CardList
          title="Cards"
          accounts={cards}
          initialIndex={PRIMARY_CARD_INDEX}
          isShowUnRegister={false}
          // onRegisterCard={onRegisterAccount}
        />

        <CardList
          title="Bank Accounts"
          accounts={accounts}
          isShowUnRegister={false}
          // onRegisterAccount={onRegisterAccount}
          initialIndex={PRIMARY_CARD_INDEX}
          // onRegisterCard={onRegisterCard}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
});
export default BankAccountManage;
