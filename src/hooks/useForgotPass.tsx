import { useRef, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
// import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import {
  createLinkVerifyForgotPassRequest,
  submitForgotPassRequest,
} from '@services/slices/auth/authSlice';
import { Paths } from '@navigation/paths';
import { IResponseCreateLinkVerifyForgotPass } from '@type';
import WebViewScreen from '@dialogs/Webview';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';

export type ForgotStep =
  | 'new_pass_form'
  | 'register_completed'
  | 'register_input';

const FORGOT_STEP: Record<string, ForgotStep> = {
  NEW_PASS_FORM: 'new_pass_form',
  REGISTER_INPUT: 'register_input',
};

const onBack = () => {
  AppNavigator.goBack();
};

const onSubmitRegisterCompleted = () => {
  AppNavigator.reset(Paths.Authorization);
};

export type FormData = {
  resetToken: string;
};

export const useForgotPass = () => {
  const formData = useRef<FormData>({} as FormData);
  const [step, setStep] = useState<ForgotStep>(FORGOT_STEP.REGISTER_INPUT);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onSubmitResetPass = (_data: any) => {
    dispatch(
      submitForgotPassRequest({
        resetToken: formData.current.resetToken,
        newPassword: _data?.password,
        confirmPassword: _data?.confirmPassword,
        onSuccess: () => {
          AppNavigator.navigate(Paths.RegisterCompleted, {
            goFrom: 'forgot_pass',
            isHideContribution: true,
          });
        },
        onFailure: msg => {
          AppNavigator.showSnackBar({
            message: msg,
            type: 'failed',
          });
        },
      }),
    );
  };
  const onExecuteVerifyUser = (data: IResponseCreateLinkVerifyForgotPass) => {
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
            formData.current.resetToken = params?.resetToken as string;
            setStep(FORGOT_STEP.NEW_PASS_FORM);
          }
        }
      },
      url: data?.certWebViewUrl,
      isFullScreen: true,
    });
  };
  const onSubmitRegisterInput = (email: string) => {
    // setStep(FORGOT_STEP.NEW_PASS_FORM);
    dispatch(
      createLinkVerifyForgotPassRequest({
        email,
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
        onSuccess: (response: IResponseCreateLinkVerifyForgotPass) => {
          onExecuteVerifyUser(response);
        },
      }),
    );
  };

  const onSubmit = (data?: any) => {
    const handlers: Record<ForgotStep, (data?: any) => void> = {
      new_pass_form: onSubmitResetPass,
      register_completed: onSubmitRegisterCompleted,
      register_input: onSubmitRegisterInput,
    };
    handlers[step]?.(data);
  };

  return {
    step,
    onBack,
    onSubmit,
  };
};
