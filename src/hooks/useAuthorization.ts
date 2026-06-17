import { useAppDispatch } from '@services/common/storeHooks';
import {
  loginRequest,
  loginSocialRequest,
} from '@services/slices/auth/authSlice';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ValidateUtils } from '@kits/core/utils';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@navigation/paths';
import type { RootStackParamList } from '@navigation/types';
import { useTranslation } from 'react-i18next';
import { computeFormAuthErrors } from '@utils/common';
import { AppConstants, Environment } from '@constants';
import { useRegister } from './useRegister';
import AppNavigator from '@navigation/AppNavigator';

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';

const { STEP, PASSWORD_MIN_LENGTH, NEED_INFO_LOGIN_CODE, initialLoginForm } =
  AppConstants;
export type { AuthStep, RegisterErrors } from './useRegister';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type LoginErrors = {
  email?: string;
  password?: string;
};

export type SocialLoginToken = {
  accessToken?: string;
  authorizationCode?: string;
  idToken?: string;
};

const validateLogin = (
  values: typeof initialLoginForm,
  t: (key: string) => string,
): LoginErrors => {
  const errors: LoginErrors = {};
  if (values.email.length === 0) {
    errors.email = t('authorisation.error_email_required');
  } else if (!ValidateUtils.isEmail(values.email)) {
    errors.email = t('authorisation.error_email_invalid');
  }
  if (values.password.length === 0) {
    errors.password = t('authorisation.error_password_required');
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = t('authorisation.error_password_min');
  }
  return errors;
};

const onLoginGoogle = async (): Promise<SocialLoginToken | undefined> => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      return {
        authorizationCode: response.data.serverAuthCode ?? undefined,
        idToken: response.data.idToken ?? undefined,
      };
    }
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE: {
          Alert.alert('Google Play Services not available');
          break;
        }
        default: {
          Alert.alert('Google sign-in error 111', error.code);
        }
      }
    } else {
      Alert.alert('Google sign-in error', error?.message ?? 'unknown');
    }
  }
  return undefined;
};

const onLoginKakao = async (): Promise<SocialLoginToken | undefined> => {
  try {
    const token = await loginWithKakaoAccount();
    return {
      accessToken: token.accessToken,
      idToken: token.idToken,
    };
  } catch (error: any) {
    console.warn('onLoginKakao.error', error);
    Alert.alert('Kakao sign-in error', error?.message ?? 'unknown');
  }
  return undefined;
};

const onLoginNaver = async (): Promise<SocialLoginToken | undefined> => {
  try {
    const { failureResponse, successResponse } = await NaverLogin.login();
    if (successResponse) {
      return {
        accessToken: successResponse.accessToken,
      };
    }
    if (failureResponse && !failureResponse.isCancel) {
      Alert.alert('Naver sign-in error', failureResponse.message ?? 'unknown');
    }
  } catch (error: any) {
    console.warn('onLoginNaver.error', error);
    Alert.alert('Naver sign-in error', error?.message ?? 'unknown');
  }
  return undefined;
};

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [loginErrorsState, setLoginErrorsState] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  const register = useRegister();

  const onLoginSuccess = () => {
    setLoading(false);
    navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
  };

  const onLoginChange =
    (field: keyof typeof initialLoginForm) => (value: string) => {
      setLoginForm(previous => ({ ...previous, [field]: value?.trim?.() }));
      setLoginErrorsState(previous => ({ ...previous, [field]: true }));
    };

  const loginFormState = computeFormAuthErrors(
    loginForm,
    loginErrorsState,
    validateLogin,
    t,
  );
  const visibleLoginErrors = loginFormState.visible;
  const isLoginValid = loginFormState.valid;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Environment.GOOGLE_WEB_CLIENT_ID,
    });
    NaverLogin.initialize({
      appName: Environment.APP_NAME ?? '',
      consumerKey: Environment.NAVER_CONSUMER_KEY ?? '',
      consumerSecret: Environment.NAVER_CONSUMER_SECRET ?? '',
      disableNaverAppAuthAndroid: true,
      disableNaverAppAuthIOS: true,
      serviceUrlSchemeIOS: Environment.NAVER_URL_SCHEME ?? '',
    });
  }, []);

  const onLoginFailure = (error: any) => {
    setLoading(false);
    if (
      [
        NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED,
        NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE,
      ].includes(error?.code)
    ) {
      const stepMapping = {
        [NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED]: STEP.REGISTER_INPUT,
        [NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE]: STEP.CHOOSE_SCHOOL,
      };
      const step = stepMapping[error?.code];
      register.goToStep(step);
      register.onGetUniversities();
      register.onRegisterChange('email')(loginForm.email);
      return;
    }
    AppNavigator.showSnackBar({
      type: 'failed',
      message: error?.message,
    });
  };

  const onForgotPassword = () => {
    navigation.navigate(Paths.ForgotPass);
  };

  const submitLogin = () => {
    setLoginErrorsState({ email: true, password: true });
    if (!isLoginValid) return;

    dispatch(
      loginRequest({
        email: loginForm?.email,
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: loginForm.password,
      }),
    );
  };

  const loginWithSocial = async (provider: SocialProvider) => {
    let token: SocialLoginToken | undefined;
    switch (provider) {
      case 'google': {
        token = await onLoginGoogle();
        break;
      }
      case 'kakao': {
        token = await onLoginKakao();
        break;
      }
      case 'naver': {
        token = await onLoginNaver();
        break;
      }
    }
    if (!token) return;

    dispatch(
      loginSocialRequest({
        ...token,
        provider: provider.toUpperCase() as 'GOOGLE' | 'KAKAO' | 'NAVER',
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
      }),
    );
  };

  return {
    isLoginValid,
    loading,
    login: loginForm,
    loginErrors: visibleLoginErrors,
    onForgotPassword,
    loginWithSocial,
    onLoginChange,
    register,
    submitLogin,
  };
};
