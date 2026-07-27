import {
  AppButton,
  BankAccounts,
  Button,
  Cards,
  HeaderDetail,
} from '@components';
import { Colors } from '@constants';
import { REQUEST_ADD_CARD_METHOD_TYPES } from '@constants/config';
import { useRequestAddCard } from '@hooks';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_PADDING = ScaleSize(20);
const { ifAndroid } = DeviceUtils;
type Properties = {
  readonly onRegisterAccount?: () => void;
  readonly onRegisterCard?: () => void;
  readonly onRequestClose?: () => void;
  readonly onDismiss?: () => void;
};

function RequestAddCard({
  onRegisterAccount,
  onRegisterCard,
  onRequestClose,
  onDismiss,
}: Properties) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    onManage,
    onSelectAccount,
    onSelectCard,
    cards,
    accounts,
    onSubmit,
    selectedMethod,
  } = useRequestAddCard({ onRegisterAccount, onRegisterCard, onRequestClose });

  const onPressBack = () => {
    onRequestClose?.();
    onDismiss?.();
  };

  return (
    <View style={styles.container}>
      <HeaderDetail
        usePaddingTop={false}
        hideNotify
        onPressBack={onPressBack}
        title={t('request_add_card.title')}
      />

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('request_add_card.payment_methods')}
          </Text>
          <AppButton
            onPress={onManage}
            style={styles.manageButton}
            testID="request-add-card-manage"
          >
            <Text style={styles.manageText}>
              {t('request_add_card.manage')}
            </Text>
          </AppButton>
        </View>

        <Text style={styles.label}>{t('request_add_card.card')}</Text>
        <View style={styles.cardSlot}>
          <BankAccounts
            accounts={cards}
            hideTitle
            selectedAddCard={
              selectedMethod === REQUEST_ADD_CARD_METHOD_TYPES.CARD
            }
            onRegisterCard={onSelectCard}
          />
        </View>

        <Text style={styles.label}>{t('request_add_card.account')}</Text>

        <Cards
          onRegisterAccount={onSelectAccount}
          hideEmptyView
          isShowUnRegister
          accounts={accounts}
          selectedAddCard={
            selectedMethod === REQUEST_ADD_CARD_METHOD_TYPES.ACCOUNT
          }
        />
      </View>

      <View
        style={[styles.footer, { paddingBottom: ifAndroid(0, insets.bottom) }]}
      >
        <Button
          onPress={onSubmit}
          testID="request-add-card-submit"
          title={t('request_add_card.submit')}
          type="rounded"
        />
      </View>
    </View>
  );
}

export default React.memo(RequestAddCard);

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
  cardSlot: {
    alignItems: 'center',
    marginBottom: ScaleSize(28),
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  footer: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: ScaleSize(12),
  },
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(20),
  },
  manageButton: {
    borderColor: Colors.gray2,
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(6),
  },
  manageText: {
    color: Colors.gray1,
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(16),
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '800',
  },
});
