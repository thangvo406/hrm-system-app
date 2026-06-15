import type { LayoutChangeEvent } from 'react-native';
import type { LoginErrors, RegisterErrors, SocialProvider } from '@hooks';
import type { LoginValues } from '@screens/Authorisation/components/LoginForm';
import type { RegisterValues } from '@screens/Authorisation/components/RegisterForm';

import Image from '@components/Image';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LoginForm from '@screens/Authorisation/components/LoginForm';
import RegisterForm from '@screens/Authorisation/components/RegisterForm';
import SocialButtons from '@screens/Authorisation/components/SocialButtons';

const BANNER_HEIGHT = 64 + 30;
const BANNER_WIDTH = 150 + 30;
const TABS_PADDING = 4;
const INDICATOR_DURATION = 220;
const FORM_FADE_DURATION = 250;

type AuthTab = 'login' | 'registration';

type AuthFormStackProps = {
  readonly initialTab: AuthTab;
  readonly loading: boolean;
  readonly login: LoginValues;
  readonly loginErrors: LoginErrors;
  readonly loginWithSocial: (provider: SocialProvider) => void;
  readonly onLoginChange: (field: keyof LoginValues) => (value: string) => void;
  readonly onRegisterChange: (
    field: keyof RegisterValues,
  ) => (value: string) => void;
  readonly registerErrors: RegisterErrors;
  readonly submitLogin: () => void;
  readonly onGoRegisterForm: () => void;
  readonly onForgotPassword: () => void;
  readonly validLogin: boolean;
  readonly validRegister: boolean;
};

function AuthFormStack({
  initialTab,
  loading,
  login,
  loginErrors,
  loginWithSocial,
  onLoginChange,
  onRegisterChange,
  registerErrors,
  submitLogin,
  onGoRegisterForm,
  onForgotPassword,
  validLogin,
  validRegister,
}: AuthFormStackProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [tabsWidth, setTabsWidth] = useState(0);

  const isRegister = activeTab === 'registration';
  const progress = useSharedValue(isRegister ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isRegister ? 1 : 0, {
      duration: INDICATOR_DURATION,
    });
  }, [isRegister, progress]);

  const indicatorWidth = tabsWidth > 0 ? (tabsWidth - TABS_PADDING * 2) / 2 : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * indicatorWidth }],
  }));

  const onTabsLayout = (event: LayoutChangeEvent) => {
    setTabsWidth(event.nativeEvent.layout.width);
  };

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

        <View onLayout={onTabsLayout} style={styles.tabs}>
          {indicatorWidth > 0 ? (
            <Animated.View
              style={[
                styles.tabIndicator,
                { width: indicatorWidth },
                indicatorStyle,
              ]}
            />
          ) : undefined}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setActiveTab('login');
            }}
            style={styles.tab}
            testID="auth-tab-login"
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.tabTextActive,
              ]}
            >
              {t('authorisation.tab_login')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setActiveTab('registration');
            }}
            style={styles.tab}
            testID="auth-tab-registration"
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'registration' && styles.tabTextActive,
              ]}
            >
              {t('authorisation.tab_registration')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isRegister ? (
          <Animated.View
            entering={FadeInRight.duration(FORM_FADE_DURATION)}
            key="register"
          >
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
          <Animated.View
            entering={FadeInLeft.duration(FORM_FADE_DURATION)}
            key="login"
          >
            <LoginForm
              errors={loginErrors}
              loading={loading}
              onChange={onLoginChange}
              onForgotPassword={onForgotPassword}
              onSubmit={submitLogin}
              valid={validLogin}
              values={login}
            />
          </Animated.View>
        )}

        <Animated.View layout={LinearTransition.duration(FORM_FADE_DURATION)}>
          <SocialButtons onPress={loginWithSocial} />
        </Animated.View>
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
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 11,
  },
  tabIndicator: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    bottom: TABS_PADDING,
    elevation: 2,
    left: TABS_PADDING,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    top: TABS_PADDING,
  },
  tabs: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 16,
    padding: TABS_PADDING,
  },
  tabText: {
    color: '#7A7A7A',
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});

export default React.memo(AuthFormStack);
