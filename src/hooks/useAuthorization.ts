import { useAppDispatch } from '@services/common/storeHooks';
import { loginRequest } from '@services/slices/auth/authSlice';
import { useState } from 'react';
import { DeviceUtils, ValidateUtils } from '@kits/core/utils';
import { Platform } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@navigation/paths';
import type { RootStackParamList } from '@navigation/types';
import { useTranslation } from 'react-i18next';

import { computeFormAuthErrors } from '@utils/common';
import { AppConstants } from '@constants';
import { useRegister } from './useRegister';
import AppNavigator from '@navigation/AppNavigator';
const { STEP, PASSWORD_MIN_LENGTH, NEED_INFO_LOGIN_CODE, initialLoginForm } =
  AppConstants;
export type { AuthStep, RegisterErrors } from './useRegister';

export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

export type LoginErrors = {
  email?: string;
  password?: string;
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

const loginWithSocial = (provider: SocialProvider) => {
  switch (provider) {
    case 'google': {
      // TODO: implement Google login
      break;
    }
    case 'kakao': {
      // TODO: implement Kakao login
      break;
    }
    case 'naver': {
      // TODO: implement Naver login
      break;
    }
  }
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

  const submitLogin = () => {
    setLoginErrorsState({ email: true, password: true });
    if (!isLoginValid) return;
    // setLoading(true);
    dispatch(
      loginRequest({
        deviceId: DeviceUtils.getDeviceId(),
        deviceName: DeviceUtils.getDeviceName(),
        email: loginForm?.email,
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: loginForm.password,
        platform: Platform.OS,
      }),
    );
  };

  return {
    isLoginValid,
    loading,
    login: loginForm,
    loginErrors: visibleLoginErrors,
    loginWithSocial,
    onLoginChange,
    register,
    submitLogin,
  };
};
