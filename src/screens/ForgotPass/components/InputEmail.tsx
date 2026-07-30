import { Button, Image, TextField } from '@components';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { ScaleSize } from '@kits/core';
import { ValidateUtils } from '@kits/core/utils';
import { Colors } from '@constants';
import { CommonUtils } from '@utils';
import imageNames from '@assets/images/names';

const TITLE_COLOR = '#1A1A1A';
const ILLUSTRATION_SIZE = ScaleSize(170);

type EmailValues = { email: string };
type EmailErrors = { email?: string };

const validateEmail = (
  values: EmailValues,
  t: (key: string) => string,
): EmailErrors => {
  const errors: EmailErrors = {};
  if (values.email.length === 0) {
    errors.email = t('authorisation.error_email_required');
  } else if (!ValidateUtils.isEmail(values.email)) {
    errors.email = t('authorisation.error_email_invalid');
  }
  return errors;
};

type InputEmailProps = {
  readonly disabled?: boolean;
  readonly onBack?: () => void;
  readonly onSubmit: (email: string) => void;
};

const handleDismissKeyboard = () => {
  Keyboard.dismiss();
};

function InputEmail({ disabled = false, onBack, onSubmit }: InputEmailProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean }>({});

  const { valid, visible } = CommonUtils.computeFormAuthErrors(
    { email },
    touched,
    validateEmail,
    t,
  );

  const onChangeEmail = (value: string) => {
    setEmail(value);
    setTouched(previous => ({ ...previous, email: true }));
  };

  const handleSubmit = () => {
    setTouched({ email: true });
    if (!valid) return;
    onSubmit(email);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={handleDismissKeyboard}
    >
      <RegisterHeader onBack={onBack} showBtnBack />

      <View style={styles.content}>
        {/* Placeholder for the forgot-password illustration asset */}
        <View style={styles.illustrationPlaceholder}>
          <Image
            name={imageNames.ic_header_forgot_pass}
            width="100%"
            height="100%"
          />
        </View>

        <Text style={styles.title}>{t('forgot_password.email_title')}</Text>
        <Text style={styles.description}>
          {t('forgot_password.email_description')}
        </Text>

        <View style={styles.formBlock}>
          <TextField
            autoCapitalize="none"
            error={visible.email}
            iconName="email"
            keyboardType="email-address"
            label={t('forgot_password.email_label')}
            onChangeText={onChangeEmail}
            onSubmitEditing={handleSubmit}
            placeholder={t('forgot_password.email_placeholder')}
            returnKeyType="send"
            testID="input-email-field"
            value={email}
          />
        </View>

        <Button
          disabled={disabled || !valid}
          onPress={handleSubmit}
          style={styles.submitButton}
          testID="input-email-submit"
          title={t('forgot_password.send_verification_email')}
          type="primary"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  description: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(12),
    textAlign: 'center',
  },
  formBlock: {
    marginTop: ScaleSize(28),
  },
  illustrationPlaceholder: {
    alignSelf: 'center',
    // backgroundColor: Colors.green03,
    borderRadius: ScaleSize(24),
    height: ILLUSTRATION_SIZE,
    marginBottom: ScaleSize(10),
    width: ILLUSTRATION_SIZE,
  },
  submitButton: {
    marginTop: ScaleSize(24),
  },
  title: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    lineHeight: ScaleSize(30),
    textAlign: 'center',
  },
});

export default React.memo(InputEmail);
