import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { loginRequest, registerRequest } from '@services/slices/auth/authSlice';
import { useCallback, useState } from 'react';
import { DeviceUtils, ValidateUtils } from '@kits/core/utils';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';
export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type LoginErrors = {
  email?: string;
  password?: string;
};

export type RegisterErrors = {
  email?: string;
  name?: string;
  password?: string;
};

const initialLoginForm = {
  email: '',
  password: '',
};

const initialRegisterForm = {
  email: '',
  name: '',
  password: '',
};

const PASSWORD_MIN_LENGTH = 6;

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

const validateRegister = (
  values: typeof initialRegisterForm,
  t: (key: string) => string,
): RegisterErrors => {
  const errors: RegisterErrors = {};
  if (values.name.trim().length === 0) {
    errors.name = t('authorisation.error_name_required');
  }
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

const computeFormErrors = <V extends Record<string, string>, E extends Record<string, string | undefined>>(
  values: V,
  errorsState: Record<string, boolean | undefined>,
  validate: (values: V, t: (key: string) => string) => E,
  t: (key: string) => string,
): { full: E; visible: E; valid: boolean } => {
  const full = validate(values, t);
  const visible = {} as E;
  for (const key of Object.keys(full) as (keyof E)[]) {
    visible[key] =
      errorsState[key as string] === true ? full[key] : undefined;
  }
  return { full, valid: Object.keys(full).length === 0, visible };
};

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const loading = useAppSelector(state => state.auth.loading);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [errors, setErrors] = useState<{
    loginForm: { email?: boolean; password?: boolean };
    registerForm: { email?: boolean; name?: boolean; password?: boolean };
  }>({ loginForm: {}, registerForm: {} });

  const onLoginSuccess = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
  }, [navigation]);

  const onLoginChange = useCallback(
    (field: keyof typeof initialLoginForm) => (value: string) => {
      setLoginForm(previous => ({ ...previous, [field]: value }));
      setErrors(previous => ({
        ...previous,
        loginForm: { ...previous.loginForm, [field]: true },
      }));
    },
    [],
  );

  const onRegisterChange = useCallback(
    (field: keyof typeof initialRegisterForm) => (value: string) => {
      setRegisterForm(previous => ({ ...previous, [field]: value }));
      setErrors(previous => ({
        ...previous,
        registerForm: { ...previous.registerForm, [field]: true },
      }));
    },
    [],
  );

  const loginFormState = computeFormErrors(
    loginForm,
    errors.loginForm,
    validateLogin,
    t,
  );
  const registerFormState = computeFormErrors(
    registerForm,
    errors.registerForm,
    validateRegister,
    t,
  );
  const visibleLoginErrors = loginFormState.visible;
  const visibleRegisterErrors = registerFormState.visible;
  const isLoginValid = loginFormState.valid;
  const isRegisterValid = registerFormState.valid;

  const onLoginFailure = useCallback((_error: string) => {
    setError(_error);
  }, []);

  const submitLogin = () => {
    setErrors(previous => ({
      ...previous,
      loginForm: { email: true, password: true },
    }));
    if (!isLoginValid) return;
    dispatch(
      loginRequest({
        deviceId: DeviceUtils.getDeviceId(),
        deviceName: DeviceUtils.getDeviceName(),
        email: loginForm.email.trim(),
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: loginForm.password,
        platform: Platform.OS,
      }),
    );
  };

  const submitRegister = () => {
    setErrors(previous => ({
      ...previous,
      registerForm: { email: true, name: true, password: true },
    }));
    if (!isRegisterValid) return;
    dispatch(
      registerRequest({
        email: registerForm.email.trim(),
        name: registerForm.name.trim(),
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: registerForm.password,
      }),
    );
  };

  const loginWithKakao = useCallback(() => {
    // TODO: implement Kakao login
  }, []);

  const loginWithNaver = useCallback(() => {
    // TODO: implement Naver login
  }, []);

  const loginWithGoogle = useCallback(() => {
    // TODO: implement Google login
  }, []);

  const loginWithSocial = useCallback(
    (provider: SocialProvider) => {
      switch (provider) {
        case 'google': {
          loginWithGoogle();
          break;
        }
        case 'kakao': {
          loginWithKakao();
          break;
        }
        case 'naver': {
          loginWithNaver();
          break;
        }
      }
    },
    [loginWithGoogle, loginWithKakao, loginWithNaver],
  );

  const cleanError = useCallback(() => {
    setError('');
  }, []);

  return {
    cleanError,
    error,
    isLoginValid,
    isRegisterValid,
    loading,
    login: loginForm,
    loginErrors: visibleLoginErrors,
    loginWithGoogle,
    loginWithKakao,
    loginWithNaver,
    loginWithSocial,
    onLoginChange,
    onRegisterChange,
    register: registerForm,
    registerErrors: visibleRegisterErrors,
    submitLogin,
    submitRegister,
  };
};
