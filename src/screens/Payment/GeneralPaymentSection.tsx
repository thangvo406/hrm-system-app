import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

const CARD_ICON_SIZE = ScaleSize(22);
const CHEVRON_SIZE = ScaleSize(16);

type Properties = {
  readonly onSelectMethod: () => void;
};

function GeneralPaymentSection({ onSelectMethod }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {t('payment.general_payment_label')}
      </Text>

      <View style={styles.card}>
        <AppButton
          onPress={onSelectMethod}
          style={styles.row}
          testID="payment-select-general-method"
        >
          <View style={styles.rowLeft}>
            <Image
              height={CARD_ICON_SIZE}
              name="ic_credit_card_green"
              width={CARD_ICON_SIZE}
            />
            <Text style={styles.rowLabel}>
              {t('payment.credit_check_card')}
            </Text>
          </View>
          <Image
            color="#B5BAC0"
            height={CHEVRON_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={CHEVRON_SIZE}
          />
        </AppButton>
      </View>
    </View>
  );
}

export default React.memo(GeneralPaymentSection);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(18),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(18),
  },
  rowLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  section: {
    marginTop: ScaleSize(24),
  },
  sectionLabel: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
});
