import type { RootScreenProps } from '@navigation/types';

import { AppButton, HeaderDetail } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { Paths } from '@navigation/paths';
import { formatCurrency } from '@utils/product';
import {
  CONTRIBUTION_PAYMENT_METHODS,
  useConfirmPaymentContribution,
} from '@hooks/useConfirmPaymentContribution';
import { DeviceUtils } from '@kits/core/utils';
const { ifAndroid } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const SCREEN_BG = '#F2F2F2';
const CARD_BG = '#FFFFFF';

function ConfirmPaymentContribution({
  route,
}: RootScreenProps<Paths.ConfirmPaymentContribution>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const amount = route.params?.amount ?? 0;
  const { onSubmit, selectedMethod, setSelectedMethod } =
    useConfirmPaymentContribution(amount);

  return (
    <View style={styles.container}>
      <HeaderDetail title={t('confirm_payment_contribution.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardMeta}>
            {t('confirm_payment_contribution.org_name')}
          </Text>
          <Text style={styles.cardItemTitle}>
            {t('confirm_payment_contribution.item_name')}
          </Text>
          <Text style={styles.cardAmount}>
            {t('confirm_payment_contribution.amount', {
              amount: formatCurrency(amount),
            })}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t('confirm_payment_contribution.choose_method')}
          </Text>
        </View>

        <View style={styles.methodCard}>
          {CONTRIBUTION_PAYMENT_METHODS.map(method => {
            const isSelected = selectedMethod === method.id;
            return (
              <AppButton
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                style={[
                  styles.methodBtn,
                  isSelected && styles.methodBtnSelected,
                ]}
                testID={`payment-method-${method.id}`}
              >
                <Text
                  style={[
                    styles.methodBtnText,
                    isSelected && styles.methodBtnTextSelected,
                  ]}
                >
                  {t(method.labelKey)}
                </Text>
              </AppButton>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom + ScaleSize(12)) },
        ]}
      >
        <AppButton
          onPress={onSubmit}
          style={styles.nextBtn}
          testID="confirm-payment-next"
        >
          <Text style={styles.nextBtnText}>
            {t('confirm_payment_contribution.next')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default ConfirmPaymentContribution;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(8),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(20),
  },
  cardAmount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '500',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  cardItemTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '600',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  cardMeta: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    textAlign: 'center',
  },
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  footer: {
    backgroundColor: Colors.white,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(-13),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(30),
  },
  methodBtn: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderColor: Colors.gray2,
    borderRadius: ScaleSize(12),
    borderWidth: 1.5,
    justifyContent: 'center',
    marginHorizontal: ScaleSize(40),
    paddingVertical: ScaleSize(25),
  },
  methodBtnSelected: {
    borderColor: Colors.primary,
  },
  methodBtnText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '500',
  },
  methodBtnTextSelected: {
    color: Colors.primary,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(12),
    flex: 1,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(15),
    paddingVertical: ScaleSize(60),
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(28),
    height: ScaleSize(52),
    justifyContent: 'center',
    width: '100%',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  pageTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(16),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
  },
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(18),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '500',
  },
});
