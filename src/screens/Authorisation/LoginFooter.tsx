import AppButton from '@components/AppButton';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type LoginFooterProps = {
  readonly onContactAdmin?: () => void;
};

/** Sign-up is not self-service here, so the footer points at the admin. */
function LoginFooter({ onContactAdmin }: LoginFooterProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('authorisation.no_account')}</Text>
      <AppButton onPress={onContactAdmin} testID="AuthorisationContactAdmin">
        <Text style={styles.link}>{t('authorisation.contact_admin')}</Text>
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
    justifyContent: 'center',
  },
  link: {
    color: Colors.blue02,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  text: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
  },
});

export default React.memo(LoginFooter);
