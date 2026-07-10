import { useAppDispatch } from '@services/common/storeHooks';
import {
  loginRequest,
  loginSocialRequest,
} from '@services/slices/auth/authSlice';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ValidateUtils } from '@kits/core/utils';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppStacks, Paths } from '@navigation/paths';
import type { RootStackParamList } from '@navigation/types';
import { useTranslation } from 'react-i18next';
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
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import { AuthResponse } from '@services/request/auth';
import { MEMBERSHIP_TYPE } from '@constants/config';

const { STEP, NEED_INFO_LOGIN_CODE, initialLoginForm } = AppConstants;
export type { AuthStep, RegisterErrors } from './useRegister';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type LoginErrors = {
  email?: string;
  password?: string;
  errorApi?: string;
};

export type SocialLoginToken = {
  accessToken?: string;
  authorizationCode?: string;
  idToken?: string;
};

// Configure once at module level — no need to re-run on every hook mount
GoogleSignin.configure({
  offlineAccess: true,
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
  return errors;
};

const onLoginGoogle = async (): Promise<SocialLoginToken | undefined> => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    await GoogleSignin.signOut();
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
          Alert.alert('Google sign-in error', error.code);
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
    await NaverLogin.logout();
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
  // Initialize with errors so button is disabled on mount
  const [loginErrors, setLoginErrors] = useState<LoginErrors>(() =>
    validateLogin(initialLoginForm, k => k),
  );
  const [touchedFields, setTouchedFields] = useState<
    ReadonlySet<keyof LoginErrors>
  >(() => new Set());
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  // Ref: no re-render on keystroke — TextInput uses defaultValue (uncontrolled)
  const loginFormRef = useRef({ ...initialLoginForm });

  const register = useRegister();

  const clearLoginErrors = () => {
    setTouchedFields(new Set());
  };

  const onLoginChange =
    (field: keyof typeof initialLoginForm) => (value: string) => {
      loginFormRef.current[field] = value.trim();
      // Mark field as touched on first change
      setTouchedFields(prev =>
        prev.has(field) ? prev : new Set([...prev, field]),
      );
      // Validate and only update state when error for this field changes
      const newErrors = validateLogin(loginFormRef.current, t);
      setLoginErrors(prev => {
        if (prev[field] === newErrors[field]) return prev;
        return { ...prev, errorApi: undefined, [field]: newErrors[field] };
      });
    };

  const onLoginSuccess = (response: AuthResponse) => {
    setLoading(false);
    if (response?.roleCode == MEMBERSHIP_TYPE.NON_MEMBER) {
      AppNavigator.navigate(Paths.SchoolSelection);
      return;
    }
    AppNavigator.replace(AppStacks.App);
    dispatch(getTotalItemCartRequest());
  };

  const onLoginFailure = (error: any) => {
    setLoading(false);
    if (
      [
        NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED,
        NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE,
        NEED_INFO_LOGIN_CODE.VERIFY_UNIVERSITY_EMAIL,
      ].includes(error?.code)
    ) {
      const stepMapping = {
        [NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE]: STEP.CHOOSE_MEMBERSHIP,
        [NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED]: STEP.REGISTER_INPUT,
        [NEED_INFO_LOGIN_CODE.VERIFY_UNIVERSITY_EMAIL]: STEP.CHOOSE_MEMBERSHIP,
      };
      const step = stepMapping[error?.code];
      register.goToStep(step, true);
      const { registerToken, signupToken } = error?.data || {};
      if (registerToken) {
        register.setRegisterToken(registerToken);
      } else if (signupToken) {
        register.setSignupToken(signupToken);
      }
      return;
    }
    setLoginErrors(prev => ({
      ...prev,
      errorApi: error?.message,
    }));
  };

  const onForgotPassword = () => {
    navigation.navigate(Paths.ForgotPass);
  };

  const submitLogin = () => {
    const errors = validateLogin(loginFormRef.current, t);
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    dispatch(
      loginRequest({
        email: loginFormRef.current.email,
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: loginFormRef.current.password,
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
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        provider: provider.toUpperCase() as 'GOOGLE' | 'KAKAO' | 'NAVER',
      }),
    );
  };

  const visibleErrors: LoginErrors = {
    email: touchedFields.has('email') ? loginErrors.email : undefined,
    password: touchedFields.has('password') ? loginErrors.password : undefined,
    errorApi: loginErrors.errorApi,
  };

  return {
    clearLoginErrors,
    isLoginValid: !loginErrors.email && !!loginFormRef.current?.password,
    loading,
    loginErrors: visibleErrors,
    loginWithSocial,
    onForgotPassword,
    onLoginChange,
    register,
    submitLogin,
  };
};
