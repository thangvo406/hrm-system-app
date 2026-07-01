import { Button, TextField } from '@components';
import type { RegisterErrors } from '@hooks';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { ScaleSize } from '@kits/core';

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
};

function RegisterForm({
  errors,
  loading = false,
  onChange,
  onSubmit,
  valid,
}: RegisterFormProps) {
  const { t } = useTranslation();
  const emailReference = useRef<TextInput>(null);
  const passwordReference = useRef<TextInput>(null);

  return (
    <>
      <TextField
        error={errors.name}
        iconName="user"
        label={t('authorisation.name_label')}
        onChangeText={onChange('name')}
        onSubmitEditing={() => emailReference.current?.focus()}
        placeholder={t('authorisation.name_placeholder')}
        returnKeyType="next"
        submitBehavior="submit"
        testID="auth-name-input"
        // value={values?.name ?? ''}
      />

      <TextField
        autoCapitalize="none"
        error={errors.email}
        iconName="email"
        keyboardType="email-address"
        label={t('authorisation.email_label')}
        onChangeText={onChange('email')}
        onSubmitEditing={() => passwordReference.current?.focus()}
        placeholder={t('authorisation.email_placeholder')}
        ref={emailReference}
        returnKeyType="next"
        submitBehavior="submit"
        testID="auth-email-input"
        // value={values?.email ?? ''}
      />

      <TextField
        autoCapitalize="none"
        error={errors.password}
        iconName="lock"
        label={t('authorisation.password_label')}
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
        // value={values?.password ?? ''}
      />

      {!!errors?.errorApi && (
        <Text style={styles.errorApi}>{errors.errorApi}</Text>
      )}

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
    marginTop: ScaleSize(16),
  },
  errorApi: {
    color: 'red',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
});

export default React.memo(RegisterForm);
