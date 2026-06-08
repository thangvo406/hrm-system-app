import TextField from '@components/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type LoginValues = {
  readonly email: string;
  readonly password: string;
};

type LoginFormProps = {
  readonly onForgotPassword?: () => void;
  readonly onSubmit?: (values: LoginValues) => void;
};

function LoginForm({
  onForgotPassword = undefined,
  onSubmit = undefined,
}: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <TextField
        autoCapitalize="none"
        iconName="email"
        keyboardType="email-address"
        label={t('authorisation.email_label')}
        onChangeText={setEmail}
        placeholder={t('authorisation.email_placeholder')}
        testID="auth-email-input"
        value={email}
      />

      <TextField
        autoCapitalize="none"
        iconName="lock"
        label={t('authorisation.password_label')}
        onChangeText={setPassword}
        placeholder={t('authorisation.password_placeholder')}
        secureTextEntry
        testID="auth-password-input"
        value={password}
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

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onSubmit?.({ email, password });
        }}
        style={styles.submitButton}
        testID="auth-login-button"
      >
        <Text style={styles.submitButtonText}>{t('authorisation.login')}</Text>
      </TouchableOpacity>
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
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#5BB85C',
    borderRadius: 12,
    elevation: 4,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#5BB85C',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginForm;
