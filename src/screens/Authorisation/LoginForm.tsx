import type { Ref } from 'react';
import type { TextInput } from 'react-native';

import AppButton from '@components/AppButton';
import CheckBox from '@components/CheckBox';
import Image from '@components/Image';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import TextField from '@components/TextField';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ARROW_SIZE = ScaleSize(18);
const GRADIENT_END = { x: 1, y: 0 };
const GRADIENT_START = { x: 0, y: 0 };

type LoginFormProps = {
  readonly email: string;
  readonly emailError?: string;
  readonly onChangeEmail: (text: string) => void;
  readonly onChangePassword: (text: string) => void;
  readonly onFocusPassword: () => void;
  readonly onForgotPassword?: () => void;
  readonly onSignIn: () => void;
  readonly onToggleRememberMe: () => void;
  readonly password: string;
  readonly passwordError?: string;
  readonly passwordRef: Ref<TextInput>;
  readonly rememberMe: boolean;
};

/**
 * The white sheet that overlaps the hero: credentials, the "remember me" /
 * "forgot password" row and the sign-in call to action.
 */
function LoginForm({
  email,
  emailError,
  onChangeEmail,
  onChangePassword,
  onFocusPassword,
  onForgotPassword,
  onSignIn,
  onToggleRememberMe,
  password,
  passwordError,
  passwordRef,
  rememberMe,
}: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TextField
        autoCapitalize="none"
        autoCorrect={false}
        error={emailError}
        iconName="ic_mail"
        inputWrapperStyle={styles.inputWrapper}
        keyboardType="email-address"
        onChangeText={onChangeEmail}
        onSubmitEditing={onFocusPassword}
        placeholder={t('authorisation.email_address_placeholder')}
        returnKeyType="next"
        style={styles.input}
        submitBehavior="submit"
        testID="AuthorisationEmailField"
        value={email}
      />
      <TextField
        autoCapitalize="none"
        autoCorrect={false}
        error={passwordError}
        iconName="ic_lock"
        inputWrapperStyle={styles.inputWrapper}
        onChangeText={onChangePassword}
        onSubmitEditing={onSignIn}
        placeholder={t('authorisation.password_placeholder')}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        style={styles.input}
        testID="AuthorisationPasswordField"
        value={password}
      />

      <View style={styles.optionsRow}>
        <CheckBox
          activeColor={Colors.blue01}
          label={t('authorisation.remember_me')}
          labelStyle={styles.rememberLabel}
          onPress={onToggleRememberMe}
          selected={rememberMe}
          testID="AuthorisationRememberMe"
        />
        <AppButton
          onPress={onForgotPassword}
          testID="AuthorisationForgotPassword"
        >
          <Text style={styles.link}>{t('authorisation.forgot_password')}</Text>
        </AppButton>
      </View>

      <AppButton
        onPress={onSignIn}
        style={styles.signInButton}
        testID="AuthorisationSignIn"
      >
        <LinearGradient
          colors={[Colors.navy03, Colors.navy01]}
          end={GRADIENT_END}
          start={GRADIENT_START}
          style={styles.signInGradient}
        >
          <Text style={styles.signInLabel}>{t('authorisation.sign_in')}</Text>
          <Image
            color={Colors.white}
            height={ARROW_SIZE}
            name="ic_arrow_right"
            type="svg"
            width={ARROW_SIZE}
          />
        </LinearGradient>
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ScaleSize(24),
  },
  input: {
    fontSize: ScaleSize(15),
    paddingVertical: ScaleSize(15),
  },
  inputWrapper: {
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(14),
    marginBottom: ScaleSize(14),
    paddingHorizontal: ScaleSize(16),
  },
  link: {
    color: Colors.blue02,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(4),
  },
  rememberLabel: {
    color: Colors.gray23,
    fontSize: ScaleSize(14),
    marginLeft: ScaleSize(2),
  },
  signInButton: {
    borderRadius: ScaleSize(28),
    marginTop: ScaleSize(24),
    overflow: 'hidden',
  },
  signInGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    height: ScaleSize(56),
    justifyContent: 'center',
  },
  signInLabel: {
    color: Colors.white,
    fontSize: ScaleSize(17),
    fontWeight: '600',
  },
});

export default React.memo(LoginForm);
