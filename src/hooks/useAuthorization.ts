import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  authFailure,
  loginRequest,
  registerRequest,
} from '@services/slices/auth/authSlice';
import { useCallback, useEffect, useState } from 'react';
import { DeviceUtils } from '@kits/core/utils';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@navigation/paths';
export type SocialProvider = 'google' | 'kakao' | 'naver';

export type UseAuthorization = ReturnType<typeof useAuthorization>;

const initialLogin = {
  email: '',
  password: '',
};

const initialRegister = {
  email: '',
  name: '',
  password: '',
};

export const useAuthorization = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const loading = useAppSelector(state => state.auth.loading);
  const navigation = useNavigation();
  const [login, setLogin] = useState(initialLogin);
  const [register, setRegister] = useState(initialRegister);

  const onLoginSuccess = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
  }, [navigation]);

  const onLoginChange = useCallback(
    (field: keyof typeof initialLogin) => (value: string) => {
      setLogin(previous => ({ ...previous, [field]: value }));
    },
    [],
  );

  const onRegisterChange = useCallback(
    (field: keyof typeof initialRegister) => (value: string) => {
      setRegister(previous => ({ ...previous, [field]: value }));
    },
    [],
  );

  // useEffect(() => {
  //   dispatch(authFailure(''));
  // }, []);

  const onLoginFailure = (_error: string) => {
    setError(_error);
  };

  const submitLogin = useCallback(() => {
    dispatch(
      loginRequest({
        deviceId: DeviceUtils.getDeviceId(),
        deviceName: DeviceUtils.getDeviceName(),
        email: login.email.trim(),
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: login.password,
        platform: Platform.OS,
      }),
    );
  }, [dispatch, login.email, login.password, onLoginSuccess]);

  const submitRegister = useCallback(() => {
    dispatch(
      registerRequest({
        email: register.email.trim(),
        name: register.name.trim(),
        onFailure: onLoginFailure,
        onSuccess: onLoginSuccess,
        password: register.password,
      }),
    );
  }, [
    dispatch,
    onLoginSuccess,
    register.email,
    register.name,
    register.password,
  ]);

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

  const cleanError = () => {
    setError('');
  };

  return {
    error,
    loading,
    login,
    loginWithGoogle,
    loginWithKakao,
    loginWithNaver,
    cleanError,
    loginWithSocial,
    onLoginChange,
    onRegisterChange,
    register,
    submitLogin,
    submitRegister,
  };
};
