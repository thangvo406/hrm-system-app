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

  /**
   * Lỗi định dạng của email, hoặc `undefined` khi hợp lệ.
   *
   * Ô rỗng trả `undefined` chứ không trả "bỏ trống": lúc đang gõ mà xoá hết chữ
   * thì báo thiếu email là làm phiền, thông báo đó để dành cho lúc bấm đăng nhập.
   */
  const getEmailError = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || ValidateUtils.isEmail(trimmed)) {
        return undefined;
      }
      return t('authorisation.error_email_invalid');
    },
    [t],
  );

  // Soát định dạng ngay khi gõ để người dùng thấy sai từ sớm, thay vì phải bấm
  // đăng nhập mới biết.
  const onChangeEmail = useCallback(
    (text: string) => {
      setEmail(text);
      // setErrors(previous => ({ ...previous, email: getEmailError(text) }));
    },
    [getEmailError],
  );

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

  const getPasswordError = useCallback(() => {
    if (!password) {
      return t('authorisation.error_password_required');
    }
    return password.length < MIN_PASSWORD_LENGTH
      ? t('authorisation.error_password_min')
      : undefined;
  }, [password, t]);

  // Lúc bấm đăng nhập mới soát đủ cả "bỏ trống"; khi gõ chỉ soát định dạng.
  const validate = useCallback(() => {
    const trimmedEmail = email.trim();
    const nextErrors: LoginErrors = {
      email: trimmedEmail
        ? getEmailError(trimmedEmail)
        : t('authorisation.error_email_required'),
      password: getPasswordError(),
    };

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  }, [email, getEmailError, getPasswordError, t]);

  const onSignIn = useCallback(() => {
    const trimmedEmail = email.trim();

    dispatch(
      loginRequest({
        username: trimmedEmail,
        password,
        rememberMe,
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error?.message || t('authorisation.error_unknown'),
            type: 'failed',
          });
        },
        onSuccess: () => {
          AppNavigator.replace(AppStacks.App);
        },
      }),
    );
  }, [dispatch, email, password, rememberMe, t, validate]);

  // Khoá nút khi email chưa đúng định dạng (kể cả còn rỗng) hoặc chưa nhập mật
  // khẩu. Độ dài mật khẩu vẫn để `validate()` soát lúc bấm, tránh khoá nút ngay
  // từ ký tự đầu tiên.
  // const isSubmitDisabled = !ValidateUtils.isEmail(email.trim()) || !password;
  const isSubmitDisabled = !email.trim() || !password;

  return {
    email,
    errors,
    isSubmitDisabled,
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
