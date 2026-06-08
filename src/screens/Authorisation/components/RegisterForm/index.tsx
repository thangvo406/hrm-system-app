import { Button, TextField } from '@components';
import type { RegisterErrors } from '@hooks';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet } from 'react-native';

export type RegisterValues = {
  readonly email: string;
  readonly name: string;
  readonly password: string;
};

type RegisterFormProps = {
  readonly errors: RegisterErrors;
  readonly loading?: boolean;
  readonly onChange: (field: keyof RegisterValues) => (value: string) => void;
  readonly onSubmit: () => void;
  readonly valid: boolean;
  readonly values: RegisterValues;
};

function RegisterForm({
  errors,
  loading = false,
  onChange,
  onSubmit,
  valid,
  values,
}: RegisterFormProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        error={errors.name}
        iconName="user"
        label={t('authorisation.name_label')}
        onChangeText={onChange('name')}
        placeholder={t('authorisation.name_placeholder')}
        testID="auth-name-input"
        value={values.name}
      />

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

      <Button
        disabled={!valid}
        title={t('authorisation.register')}
        loading={loading}
        style={styles.submit}
        onPress={onSubmit}
        type="rounded"
        testID="auth-login-button"
      />
    </>
  );
}

const styles = StyleSheet.create({
  submit: {
    marginTop: 16,
  },
});

export default React.memo(RegisterForm);
