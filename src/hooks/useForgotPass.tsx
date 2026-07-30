import { useRef, useState } from 'react';
import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import Selection from '@screens/Dialog/components/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
// import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import { AppConstants } from '@constants';
import {
  createLinkVerifyForgotPassRequest,
  submitForgotPassRequest,
  verifyOtpForgotPassRequest,
} from '@services/slices/auth/authSlice';
import { Paths } from '@navigation/paths';
import { IResponseCreateLinkVerifyForgotPass } from '@type';
import WebViewScreen from '@dialogs/Webview';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';

const { CARRIER_ITEMS, DEFAULT_CARRIER } = AppConstants;

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
  birthday: string;
  indentify: string;
  carrier: string;
  email: string;
  membershipId: string;
  name: string;
  otp: string;
  password: string;
  phone: string;
  roleId: string;
  phoneVerificationToken: string;
  resetToken: string;
  signupToken: string;
};

export const useForgotPass = () => {
  const [agreed, setAgreed] = useState(false);
  const [carrier, setCarrier] = useState<string>(DEFAULT_CARRIER);
  const formData = useRef<FormData>({} as FormData);
  const [step, setStep] = useState<ForgotStep>(FORGOT_STEP.REGISTER_INPUT);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onInfoChange = (field: keyof InputInfoValues, value: string) => {
    formData.current[field] = value;
    // formData.current = { ...formData.current, [field]: value };
  };
  const onPressCarrier = () => {
    AppNavigator.showDialog({
      cancelable: true,
      items: CARRIER_ITEMS,
      onSelect: (id: string) => {
        setCarrier(id);
        formData.current.carrier = id;
      },
      screen: Selection,
      selectedId: carrier,
      title: t('register_flow.choose_carrier'),
    });
  };

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
            formData.current.resetToken = params?.resetToken;
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
  const onPressVerify = (callback: any) => {
    dispatch(
      verifyOtpForgotPassRequest({
        email: formData.current.email,
        phone: formData.current.phone,
        fullName: formData.current.name,
        phoneVerificationToken: formData.current.phoneVerificationToken,
        identityNumber: `${formData.current.birthday}-${formData.current.indentify}`,
        otp: formData.current.otp,
        termsAgreed: true,
        onSuccess: (response: any) => {
          formData.current.resetToken = response?.resetToken;
          callback?.(true);
        },
        onFailure: msg => {
          AppNavigator.showSnackBar({ message: msg, type: 'failed' });
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

  const onToggleAgreement = () => {
    setAgreed(previous => !previous);
  };

  return {
    agreed,
    carrier,
    step,
    onBack,
    onInfoChange,
    onPressVerify,
    onPressCarrier,
    onSubmit,
    onToggleAgreement,
  };
};
