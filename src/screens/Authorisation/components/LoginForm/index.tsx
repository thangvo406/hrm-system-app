import { Button, TextField } from '@components';
import type { LoginErrors } from '@hooks';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';

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
};

function LoginForm({
  errors,
  loading = false,
  onChange,
  onForgotPassword = undefined,
  onSubmit,
  valid,
}: LoginFormProps) {
  const { t } = useTranslation();
  const passwordReference = useRef<TextInput>(null);

  return (
    <>
      <TextField
        autoCapitalize="none"
        error={errors.email}
        iconName="email"
        keyboardType="email-address"
        label={t('authorisation.email_label')}
        defaultValue=""
        onChangeText={onChange('email')}
        onSubmitEditing={() => passwordReference.current?.focus()}
        placeholder={t('authorisation.email_placeholder')}
        returnKeyType="next"
        submitBehavior="submit"
        testID="auth-email-input"
      />

      <TextField
        autoCapitalize="none"
        error={errors.password}
        iconName="lock"
        label={t('authorisation.password_label')}
        defaultValue=""
        onChangeText={onChange('password')}
        onSubmitEditing={() => {
          if (valid) {
            onSubmit();
          }
        }}
        placeholder={t('authorisation.password_placeholder')}
        ref={passwordReference}
        returnKeyType="done"
        secureTextEntry
        testID="auth-password-input"
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
