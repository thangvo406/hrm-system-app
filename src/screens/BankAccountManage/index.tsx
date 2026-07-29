import { AppButton, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { useBankAccount } from '@hooks';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BankAccountRow from './BankAccountRow';
import Collapsible from './Collapsible';
import PaymentCardRow from './PaymentCardRow';
import SectionHeader from './SectionHeader';
import { HAIRLINE, MUTED_INK, PAGE_SURFACE, ROW_SURFACE } from './tokens';

const CTA_ICON_SIZE = ScaleSize(22);

function BankAccountManage() {
  const {
    accounts,
    cards,
    expandedSections,
    onPressAddCard,
    onRemoveItem,
    onSettingsItem,
    onToggleSection,
  } = useBankAccount();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <HeaderDetail hideNotify title={t('account_management.manage_title')} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{t('account_management.manage_desc')}</Text>

        <SectionHeader
          // actionLabel={t('account_management.add_card')}
          onPressAction={onPressAddCard}
          count={cards?.length ?? 0}
          expanded={expandedSections.cards}
          icon="ic_credit_card"
          onPress={onToggleSection('cards')}
          testID="payment-methods-add-card"
          title={t('account_management.cards')}
        />
        <Collapsible
          contentStyle={styles.section}
          expanded={expandedSections.cards}
        >
          {cards?.length > 0 ? (
            cards.map((card, index) => (
              <PaymentCardRow
                card={card}
                cardIndex={index}
                key={card.id}
                onRemove={onRemoveItem('card')}
                onSettings={onSettingsItem('card')}
              />
            ))
          ) : (
            <Text style={styles.empty}>{t('account_management.no_cards')}</Text>
          )}
        </Collapsible>

        <SectionHeader
          // actionLabel={t('account_management.add_account')}
          count={accounts?.length ?? 0}
          expanded={expandedSections.accounts}
          icon="ic_bank"
          // onPressAction={onPressAddCard}
          onPress={onToggleSection('accounts')}
          testID="payment-methods-add-account"
          title={t('account_management.bank_accounts')}
        />
        <Collapsible
          contentStyle={styles.section}
          expanded={expandedSections.accounts}
        >
          {accounts?.length > 0 ? (
            accounts.map(account => (
              <BankAccountRow
                account={account}
                key={account.id}
                onRemove={onRemoveItem('account')}
                onSettings={onSettingsItem('account')}
              />
            ))
          ) : (
            <Text style={styles.empty}>
              {t('account_management.no_accounts')}
            </Text>
          )}
        </Collapsible>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + ScaleSize(12) },
        ]}
      >
        <AppButton
          onPress={onPressAddCard}
          style={styles.cta}
          testID="payment-methods-add"
        >
          <Image
            color="#FFFFFF"
            height={CTA_ICON_SIZE}
            name="ic_plus_circle"
            type="svg"
            width={CTA_ICON_SIZE}
          />
          <Text style={styles.ctaLabel}>
            {t('account_management.add_payment_method')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PAGE_SURFACE,
    flex: 1,
  },
  cta: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    gap: ScaleSize(10),
    height: ScaleSize(54),
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  empty: {
    color: MUTED_INK,
    fontSize: ScaleSize(14),
    paddingVertical: ScaleSize(10),
    textAlign: 'center',
  },
  footer: {
    backgroundColor: ROW_SURFACE,
    borderTopColor: HAIRLINE,
    borderTopWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  intro: {
    color: MUTED_INK,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(8),
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: ScaleSize(24),
  },
  section: {
    gap: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
  },
});

export default BankAccountManage;
