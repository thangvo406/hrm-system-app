import { Button, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CHECK_SIZE = ScaleSize(18);
const TITLE_COLOR = '#1A1A1A';
const ITEM_COLOR = '#4A4A4A';

type AgreementItem = {
  readonly key: string;
  readonly labelKey: string;
};

const DEFAULT_ITEMS: readonly AgreementItem[] = [
  { key: 'service', labelKey: 'register_cart_confirm.term_service' },
  {
    key: 'privacy_collect',
    labelKey: 'register_cart_confirm.term_privacy_collect',
  },
  {
    key: 'privacy_third_party',
    labelKey: 'register_cart_confirm.term_privacy_third_party',
  },
];

type RegisterCartConfirmProps = {
  readonly items?: readonly AgreementItem[];
  readonly onConfirm?: () => void;
  readonly onRequestClose?: () => void;
};

/**
 * Confirmation dialog shown before starting the payment-method registration
 * flow. Rendered as a Dialog `screen`, so the host provides the rounded card
 * chrome; this component lays out the title, the list of required-agreement
 * links, and the "agree and proceed" action.
 */
function RegisterCartConfirm({
  items = DEFAULT_ITEMS,
  onConfirm,
  onRequestClose,
}: RegisterCartConfirmProps) {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm?.();
    onRequestClose?.();
  };

  return (
    <View style={styles.container} testID="register-cart-confirm-dialog">
      <Text style={styles.title}>{t('register_cart_confirm.title')}</Text>

      <View style={styles.items}>
        {items.map(item => (
          <View
            key={item.key}
            style={styles.item}
            testID={`register-cart-confirm-item-${item.key}`}
          >
            <Image
              color={Colors.green02}
              height={CHECK_SIZE}
              name="ic_check"
              type="svg"
              width={CHECK_SIZE}
            />
            <Text style={styles.itemLabel}>{t(item.labelKey)}</Text>
          </View>
        ))}
      </View>

      <Button
        onPress={handleConfirm}
        style={styles.submit}
        testID="register-cart-confirm-submit"
        title={t('register_cart_confirm.submit')}
        type="rounded"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: ScaleSize(30)
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(15),
  },
  itemLabel: {
    color: ITEM_COLOR,
    flex: 1,
    fontSize: ScaleSize(14),
    textDecorationLine: 'underline',
  },
  items: {
    gap: ScaleSize(18),
    marginTop: ScaleSize(24),
  },
  submit: {
    marginTop: ScaleSize(28),
  },
  title: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    lineHeight: ScaleSize(26),
  },
});

export default React.memo(RegisterCartConfirm);
