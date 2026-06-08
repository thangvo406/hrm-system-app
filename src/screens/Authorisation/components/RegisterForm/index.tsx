import TextField from '@components/TextField';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

export type RegisterValues = {
  readonly email: string;
  readonly name: string;
  readonly password: string;
};

type RegisterFormProps = {
  readonly loading?: boolean;
  readonly onChange: (field: keyof RegisterValues) => (value: string) => void;
  readonly onSubmit: () => void;
  readonly values: RegisterValues;
};

function RegisterForm({
  loading = false,
  onChange,
  onSubmit,
  values,
}: RegisterFormProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        iconName="user"
        label={t('authorisation.name_label')}
        onChangeText={onChange('name')}
        placeholder={t('authorisation.name_placeholder')}
        testID="auth-name-input"
        value={values.name}
      />

      <TextField
        autoCapitalize="none"
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
        iconName="lock"
        label={t('authorisation.password_label')}
        onChangeText={onChange('password')}
        placeholder={t('authorisation.password_placeholder')}
        secureTextEntry
        testID="auth-password-input"
        value={values.password}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={loading}
        onPress={onSubmit}
        style={styles.submitButton}
        testID="auth-login-button"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>
            {t('authorisation.register')}
          </Text>
        )}
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
