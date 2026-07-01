import type { LoginErrors, RegisterErrors, SocialProvider } from '@hooks';
import type { LoginValues } from '@screens/Authorisation/components/LoginForm';
import type { RegisterValues } from '@screens/Authorisation/components/RegisterForm';

import {SegmentedTab, Image} from '@components';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoginForm from '@screens/Authorisation/components/LoginForm';
import RegisterForm from '@screens/Authorisation/components/RegisterForm';
import SocialButtons from '@screens/Authorisation/components/SocialButtons';

const BANNER_HEIGHT = 64 + 30;
const BANNER_WIDTH = 150 + 30;
const FORM_FADE_DURATION = 250;

type AuthTab = 'login' | 'registration';

type AuthFormStackProps = {
  readonly initialTab: AuthTab;
  readonly loading: boolean;
  readonly loginErrors: LoginErrors;
  readonly loginWithSocial: (provider: SocialProvider) => void;
  readonly onClearErrors: () => void;
  readonly onForgotPassword: () => void;
  readonly onGoRegisterForm: () => void;
  readonly onLoginChange: (field: keyof LoginValues) => (value: string) => void;
  readonly onRegisterChange: (
    field: keyof RegisterValues,
  ) => (value: string) => void;
  readonly registerErrors: RegisterErrors;
  readonly submitLogin: () => void;
  readonly validLogin: boolean;
  readonly validRegister: boolean;
};

function AuthFormStack({
  initialTab,
  loading,
  loginErrors,
  loginWithSocial,
  onClearErrors,
  onForgotPassword,
  onGoRegisterForm,
  onLoginChange,
  onRegisterChange,
  registerErrors,
  submitLogin,
  validLogin,
  validRegister,
}: AuthFormStackProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

  const handleTabChange = (tab: AuthTab) => {
    onClearErrors();
    setActiveTab(tab);
  };

  const isRegister = activeTab === 'registration';
  const formOpacity = useMemo(() => new Animated.Value(1), []);
  const formTranslateX = useMemo(() => new Animated.Value(0), []);
  const renderedTab = useRef<AuthTab>(initialTab);

  useEffect(() => {
    if (renderedTab.current === activeTab) {
      return;
    }
    const fromX = activeTab === 'registration' ? 24 : -24;
    formOpacity.setValue(0);
    formTranslateX.setValue(fromX);
    renderedTab.current = activeTab;
    Animated.parallel([
      Animated.timing(formOpacity, {
        duration: FORM_FADE_DURATION,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateX, {
        duration: FORM_FADE_DURATION,
        easing: Easing.out(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab, formOpacity, formTranslateX]);

  const formStyle = {
    opacity: formOpacity,
    transform: [{ translateX: formTranslateX }],
  };

  const authTabs = useMemo(
    () => [
      {
        id: 'login' as const,
        label: t('authorisation.tab_login'),
        testID: 'auth-tab-login',
      },
      {
        id: 'registration' as const,
        label: t('authorisation.tab_registration'),
        testID: 'auth-tab-registration',
      },
    ],
    [t],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <View style={styles.header}>
        <View style={styles.bannerWrapper}>
          <Image
            height={BANNER_HEIGHT}
            name="ic_logo_banner"
            width={BANNER_WIDTH}
          />
        </View>

        <SegmentedTab
          activeTab={activeTab}
          onTabChange={handleTabChange}
          style={styles.tabs}
          tabs={authTabs}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isRegister ? (
          <Animated.View key="register" style={formStyle}>
            <RegisterForm
              errors={registerErrors}
              loading={loading}
              onChange={onRegisterChange}
              onSubmit={onGoRegisterForm}
              valid={validRegister}
              // values={register}
            />
          </Animated.View>
        ) : (
          <Animated.View key="login" style={formStyle}>
            <LoginForm
              errors={loginErrors}
              loading={loading}
              onChange={onLoginChange}
              onForgotPassword={onForgotPassword}
              onSubmit={submitLogin}
              valid={validLogin}
            />
          </Animated.View>
        )}

        <SocialButtons onPress={loginWithSocial} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  tabs: {
    marginBottom: 16,
  },
});

export default React.memo(AuthFormStack);
