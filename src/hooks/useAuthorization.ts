import { useAppDispatch } from '@services/common/storeHooks';
import {
  loginRequest,
  loginSocialRequest,
  logout,
  verifyUserNewLoginRequest,
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
import {
  activeAccountRequest,
  deleteAccountRequest,
  getTotalItemCartRequest,
} from '@services/slices/account/accountSlice';
import { MEMBER_STATUS } from '@constants/config';
import InActiveAccount from '@dialogs/InActiveAccount';
import DeletionAccount from '@dialogs/DeletionAccount';
import { IResponseCreateLinkVerifyInfoUser, IResponseLogin } from '@type';
import WebViewScreen from '@dialogs/Webview';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';
import Information from '@dialogs/Information';
import { FORGOT_STEP } from './useForgotPass';
// import InActiveAccount from '@dialogs/InActiveAccount';
// import DeletionAccount from '@dialogs/DeletionAccount';

const { REGISTER_FLOW_STEP, NEED_INFO_LOGIN_CODE, initialLoginForm } =
  AppConstants;
export type { RegisterErrors } from './useRegister';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type TLoginErrors = {
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
): TLoginErrors => {
  const errors: TLoginErrors = {};
  if (values.email.length === 0) {
    errors.email = t('authorisation.error_email_required');
  } else if (!ValidateUtils.isEmail(values.email)) {
    errors.email = t('authorisation.error_email_invalid');
  }
  return errors;
};

const onLoginGoogle = async (
  t: (key: string) => string,
): Promise<SocialLoginToken | undefined> => {
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
          Alert.alert(t('authorisation.google_play_services_unavailable'));
          break;
        }
        default: {
          Alert.alert(t('authorisation.google_signin_error'), error.code);
        }
      }
    } else {
      Alert.alert(
        t('authorisation.google_signin_error'),
        error?.message ?? t('authorisation.error_unknown'),
      );
    }
  }
  return undefined;
};

const onLoginKakao = async (
  t: (key: string) => string,
): Promise<SocialLoginToken | undefined> => {
  try {
    const token = await loginWithKakaoAccount();
    return {
      accessToken: token.accessToken,
      idToken: token.idToken,
    };
  } catch (error: any) {
    console.warn('onLoginKakao.error', error);
    Alert.alert(
      t('authorisation.kakao_signin_error'),
      error?.message ?? t('authorisation.error_unknown'),
    );
  }
  return undefined;
};

const onLoginNaver = async (
  t: (key: string) => string,
): Promise<SocialLoginToken | undefined> => {
  try {
    await NaverLogin.logout();
    const { failureResponse, successResponse } = await NaverLogin.login();
    if (successResponse) {
      return {
        accessToken: successResponse.accessToken,
      };
    }
    if (failureResponse && !failureResponse.isCancel) {
      Alert.alert(
        t('authorisation.naver_signin_error'),
        failureResponse.message ?? t('authorisation.error_unknown'),
      );
    }
  } catch (error: any) {
    console.warn('onLoginNaver.error', error);
    Alert.alert(
      t('authorisation.naver_signin_error'),
      error?.message ?? t('authorisation.error_unknown'),
    );
  }
  return undefined;
};

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // Initialize with errors so button is disabled on mount
  const [loginErrors, setLoginErrors] = useState<TLoginErrors>(() =>
    validateLogin(initialLoginForm, k => k),
  );
  const [touchedFields, setTouchedFields] = useState<
    ReadonlySet<keyof TLoginErrors>
  >(() => new Set());
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  // Ref: no re-render on keystroke — TextInput uses defaultValue (uncontrolled)
  const loginFormRef = useRef({ ...initialLoginForm });

  const register = useRegister();

  const clearLoginErrors = () => {
    setTouchedFields(new Set());
  };

  // Called when the auth tab loses focus: drop everything typed in the login
  // form so the next visit starts empty (inputs are uncontrolled + remounted).
  const resetLoginForm = () => {
    loginFormRef.current = { ...initialLoginForm };
    setLoginErrors(validateLogin(initialLoginForm, k => k));
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

  const onLoginSuccess = (response: IResponseLogin) => {
    setLoading(false);
    if (response.accountStatus == MEMBER_STATUS.HIBERNATION) {
      AppNavigator.showDialog({
        screen: InActiveAccount,
        isFullScreen: true,
        archivedInformation: response.archivedInformation,
        dormantDate: response.dormantDate,
        expiredInformation: response.expiredInformation,
        lastLoginDate: response.lastLoginDate,
        onReactivate: onReActiveAccount,
        onDeleteAccount: () => {
          AppNavigator.showDialog({
            screen: DeletionAccount,
            isFullScreen: true,
            onSubmit: onDeleteAccount,
          });
        },
      });
    } else if (!response?.universityId) {
      AppNavigator.navigate(Paths.SchoolSelection);
    } else {
      AppNavigator.replace(AppStacks.App);
      dispatch(getTotalItemCartRequest());
    }
  };

  const handleVerifyUserNewLogin = (data: any) => {
    AppNavigator.showDialog({
      screen: Information,
      title: t('authorisation.new_login_dialog.title'),
      desc: t('authorisation.new_login_dialog.desc'),
      confirmTitle: t('common.confirm'),
      cancelTitle: t('common.cancel'),
      onConfirm: () => {
        dispatch(
          verifyUserNewLoginRequest({
            initialPasswordToken: data?.initialPasswordToken,
            onSuccess: (response: IResponseCreateLinkVerifyInfoUser) => {
              AppNavigator.showDialog({
                screen: WebViewScreen,
                cookies: {
                  call_url: response?.callUrl,
                  reg_cert_key: response?.regCertKey,
                  ordr_idxx: response?.ordrIdxx,
                },
                onNavigationStateChange: (
                  navState: WebViewNavigation,
                  onRequestClose: any,
                ) => {
                  const { url } = navState || {};
                  // coop://registration/identity/failure?error=cert_failed
                  const isDeeplinkApp = url?.startsWith?.('coop://');
                  if (isDeeplinkApp) {
                    const params = deepLinkGate.getPathFromUrl(navState.url);
                    onRequestClose?.();
                    if (params?.error) {
                      AppNavigator.showSnackBar({
                        message: t('forgot_password.verify_user_failed'),
                        type: 'failed',
                      });
                    } else {
                      AppNavigator.navigate(Paths.ForgotPass, {
                        initScreen: FORGOT_STEP.NEW_PASS_FORM,
                        resetToken: params.resetToken,
                      });
                    }
                  }
                },
                url: response?.certWebViewUrl,
                isFullScreen: true,
              });
            },
            onFailure: (error: string) => {
              AppNavigator.showSnackBar({
                message: error,
                type: 'failed',
              });
            },
          }),
        );
      },
    });
  };
  const onLoginFailure = (error: any) => {
    setLoading(false);
    if (error?.code == NEED_INFO_LOGIN_CODE.VERIFY_NEW_LOGIN) {
      handleVerifyUserNewLogin(error?.data);
    } else if (
      [
        NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED,
        NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE,
        NEED_INFO_LOGIN_CODE.VERIFY_UNIVERSITY_EMAIL,
      ].includes(error?.code)
    ) {
      const stepMapping = {
        [NEED_INFO_LOGIN_CODE.MEMBERSHIP_INCOMPLETE]:
          REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP,
        // [NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED]:
        //   REGISTER_FLOW_STEP.REGISTER_INPUT,
        [NEED_INFO_LOGIN_CODE.VERIFY_UNIVERSITY_EMAIL]:
          REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP,
      };
      const step = stepMapping[error?.code];

      register.goToStep(step, true);
      const { registerToken, signupToken } = error?.data || {};
      if (registerToken) {
        register.setRegisterToken(registerToken);
      } else if (signupToken) {
        register.setSignupToken(signupToken);
      }
      if (!step && error?.code == NEED_INFO_LOGIN_CODE.PHONE_NOT_VERIFIED) {
        register.onCreateLinkVerifyUser();
      }
      return;
    }
    setLoginErrors(prev => ({
      ...prev,
      errorApi: error?.message,
    }));
  };

  const onReActiveAccount = () => {
    dispatch(
      activeAccountRequest({
        onSuccess: data => {
          AppNavigator.showDialog({
            screen: WebViewScreen,
            cookies: {
              call_url: data?.callUrl,
              reg_cert_key: data?.regCertKey,
              ordr_idxx: data?.ordrIdxx,
            },
            onNavigationStateChange: (
              navState: WebViewNavigation,
              onRequestClose: any,
            ) => {
              const { url } = navState || {};
              // coop://registration/identity/failure?error=cert_failed
              const isDeeplinkApp = url?.startsWith?.('coop://');
              if (isDeeplinkApp) {
                const params = deepLinkGate.getPathFromUrl(navState.url);
                onRequestClose();
                if (params?.error) {
                  // onShowPopupFailed();
                  AppNavigator.showSnackBar({
                    message: t('forgot_password.verify_user_failed'),
                    type: 'failed',
                  });
                } else {
                  AppNavigator.hideAllPopup();
                  AppNavigator.showSnackBar({
                    message: t('inactive_account.active_account_success'),
                    type: 'success',
                  });
                }
              }
            },
            url: data?.certWebViewUrl,
            isFullScreen: true,
          });
        },
        onFailure: message =>
          AppNavigator.showSnackBar({ message, type: 'failed' }),
      }),
    );
  };

  const onDeleteAccount = (selectedReason: string) => {
    dispatch(
      deleteAccountRequest({
        deletedReason: selectedReason || '',
        onSuccess: () => {
          dispatch(logout());
          AppNavigator.reset(AppStacks.Auth);
        },
        onFailure: message =>
          AppNavigator.showSnackBar({ message, type: 'failed' }),
      }),
    );
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
        token = await onLoginGoogle(t);
        break;
      }
      case 'kakao': {
        token = await onLoginKakao(t);
        break;
      }
      case 'naver': {
        token = await onLoginNaver(t);
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

  const visibleErrors: TLoginErrors = {
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
    resetLoginForm,
    submitLogin,
  };
};
