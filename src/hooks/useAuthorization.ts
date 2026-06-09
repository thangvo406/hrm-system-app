import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { loginRequest } from '@services/slices/auth/authSlice';
import { useCallback, useState } from 'react';
import { DeviceUtils, ValidateUtils } from '@kits/core/utils';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';

import {
  PASSWORD_MIN_LENGTH,
  computeFormErrors,
} from './authorisation/validation';
import { useRegister } from './useRegister';

export type { AuthStep, RegisterErrors } from './useRegister';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type LoginErrors = {
  email?: string;
  password?: string;
};

const initialLoginForm = {
  email: '',
  password: '',
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

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const loading = useAppSelector(state => state.auth.loading);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [loginErrorsState, setLoginErrorsState] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  const register = useRegister();

  const onLoginSuccess = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
  }, [navigation]);

  const onLoginChange = useCallback(
    (field: keyof typeof initialLoginForm) => (value: string) => {
      setLoginForm(previous => ({ ...previous, [field]: value }));
      setLoginErrorsState(previous => ({ ...previous, [field]: true }));
    },
    [],
  );

  const loginFormState = computeFormErrors(
    loginForm,
    loginErrorsState,
    validateLogin,
    t,
  );
  const visibleLoginErrors = loginFormState.visible;
  const isLoginValid = loginFormState.valid;

  const onLoginFailure = useCallback((_error: string) => {
    setError(_error);
  }, []);

  const submitLogin = () => {
    setLoginErrorsState({ email: true, password: true });
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
    filteredSchools: register.filteredSchools,
    goToStep: register.goToStep,
    infoValues: register.infoValues,
    isLoginValid,
    isRegisterValid: register.isRegisterValid,
    loading,
    login: loginForm,
    loginErrors: visibleLoginErrors,
    loginWithGoogle,
    loginWithKakao,
    loginWithNaver,
    loginWithSocial,
    onLoginChange,
    onRegisterChange: register.onRegisterChange,
    onSchoolKeywordChange: register.onSchoolKeywordChange,
    onSelectSchool: register.onSelectSchool,
    register: register.register,
    registerErrors: register.registerErrors,
    schoolKeyword: register.schoolKeyword,
    selectedSchool: register.selectedSchool,
    selectedSchoolId: register.selectedSchoolId,
    step: register.step,
    submitInfo: register.submitInfo,
    submitLogin,
    submitRegister: register.submitRegister,
  };
};
