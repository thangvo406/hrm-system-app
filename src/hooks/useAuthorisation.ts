import type { TextInput } from 'react-native';

import { AppConstants } from '@constants';
import { ValidateUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import { AppStacks } from '@navigation/paths';
import { AppStorage } from '@services/common/storage';
import { useAppDispatch } from '@services/common/storeHooks';
import { loginRequest } from '@services/slices/auth/authSlice';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_PASSWORD_LENGTH = 6;

type LoginErrors = {
  email?: string;
  password?: string;
};

/**
 * Holds every bit of logic for the login screen: form values, validation,
 * the "remember me" preference (persisted in MMKV) and the login dispatch.
 */
export function useAuthorisation() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const passwordRef = useRef<TextInput>(null);

  const rememberedEmail = useRef(
    AppStorage.getString(AppConstants.REMEMBERED_EMAIL_KEY) ?? '',
  );

  const [email, setEmail] = useState(rememberedEmail.current);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail.current);
  const [errors, setErrors] = useState<LoginErrors>({});

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text);
    setErrors(previous => ({ ...previous, email: undefined }));
  }, []);

  const onChangePassword = useCallback((text: string) => {
    setPassword(text);
    setErrors(previous => ({ ...previous, password: undefined }));
  }, []);

  const onToggleRememberMe = useCallback(() => {
    setRememberMe(previous => !previous);
  }, []);

  const onFocusPassword = useCallback(() => {
    passwordRef.current?.focus();
  }, []);

  const validate = useCallback(() => {
    const trimmedEmail = email.trim();
    const nextErrors: LoginErrors = {};

    if (!trimmedEmail) {
      nextErrors.email = t('authorisation.error_email_required');
    } else if (!ValidateUtils.isEmail(trimmedEmail)) {
      nextErrors.email = t('authorisation.error_email_invalid');
    }

    if (!password) {
      nextErrors.password = t('authorisation.error_password_required');
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = t('authorisation.error_password_min');
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  }, [email, password, t]);

  const onSignIn = useCallback(() => {
    if (!validate()) {
      return;
    }
    const trimmedEmail = email.trim();

    dispatch(
      loginRequest({
        email: trimmedEmail,
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error || t('authorisation.error_unknown'),
            type: 'failed',
          });
        },
        onSuccess: () => {
          if (rememberMe) {
            AppStorage.set(AppConstants.REMEMBERED_EMAIL_KEY, trimmedEmail);
          } else {
            AppStorage.remove(AppConstants.REMEMBERED_EMAIL_KEY);
          }
          AppNavigator.replace(AppStacks.App);
        },
        password,
      }),
    );
  }, [dispatch, email, password, rememberMe, t, validate]);

  return {
    email,
    errors,
    onChangeEmail,
    onChangePassword,
    onFocusPassword,
    onSignIn,
    onToggleRememberMe,
    password,
    passwordRef,
    rememberMe,
  };
}
