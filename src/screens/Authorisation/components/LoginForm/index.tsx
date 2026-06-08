import { Button, TextField } from '@components';
import type { LoginErrors } from '@hooks';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export type LoginValues = {
  readonly email: string;
  readonly password: string;
};

type LoginFormProps = {
  readonly errors: LoginErrors;
  readonly loading?: boolean;
  readonly onChange: (field: keyof LoginValues) => (value: string) => void;
  readonly onForgotPassword?: () => void;
  readonly onSubmit: () => void;
  readonly valid: boolean;
  readonly values: LoginValues;
};

function LoginForm({
  errors,
  loading = false,
  onChange,
  onForgotPassword = undefined,
  onSubmit,
  valid,
  values,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        autoCapitalize="none"
        error={errors.email}
        iconName="email"
        keyboardType="email-address"
        label={t('authorisation.email_label')}
        onChangeText={onChange('email')}
        placeholder={t('authorisation.email_placeholder')}
        testID="auth-email-input"
        value={values.email}
      />

      <TextField
        autoCapitalize="none"
        error={errors.password}
        iconName="lock"
        label={t('authorisation.password_label')}
        onChangeText={onChange('password')}
        placeholder={t('authorisation.password_placeholder')}
        secureTextEntry
        testID="auth-password-input"
        value={values.password}
      />

      <TouchableOpacity
        onPress={onForgotPassword}
        style={styles.forgot}
        testID="auth-forgot-button"
      >
        <Text style={styles.forgotText}>
          {t('authorisation.forgot_password')}
        </Text>
      </TouchableOpacity>

      <Button
        disabled={!valid}
        title={t('authorisation.login')}
        loading={loading}
        onPress={onSubmit}
        type="rounded"
        testID="auth-login-button"
      />
    </>
  );
}

const styles = StyleSheet.create({
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: 8,
  },
  forgotText: {
    color: '#2F6BFF',
    fontSize: 13,
  },
});

export default React.memo(LoginForm);
