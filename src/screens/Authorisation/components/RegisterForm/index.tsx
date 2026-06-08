import TextField from '@components/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export type RegisterValues = {
  readonly email: string;
  readonly name: string;
  readonly password: string;
};

type RegisterFormProps = {
  readonly onSubmit?: (values: RegisterValues) => void;
};

function RegisterForm({ onSubmit = undefined }: RegisterFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <TextField
        iconName="user"
        label={t('authorisation.name_label')}
        onChangeText={setName}
        placeholder={t('authorisation.name_placeholder')}
        testID="auth-name-input"
        value={name}
      />

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
        activeOpacity={0.8}
        onPress={() => {
          onSubmit?.({ email, name, password });
        }}
        style={styles.submitButton}
        testID="auth-login-button"
      >
        <Text style={styles.submitButtonText}>
          {t('authorisation.register')}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#5BB85C',
    borderRadius: 12,
    elevation: 4,
    height: 50,
    justifyContent: 'center',
    marginTop: 16,
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

export default RegisterForm;
