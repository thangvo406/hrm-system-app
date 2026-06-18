import { useRef, useState } from 'react';
import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import Selection from '@screens/Dialog/components/Selection';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
// import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import { AppConstants } from '@constants';
import {
  sendOtpForgotPassRequest,
  submitForgotPassRequest,
  verifyOtpForgotPassRequest,
} from '@services/slices/auth/authSlice';
import { IResponseSendOtpForgotPass } from '@type/auth';
import { Paths } from '@navigation/paths';

const { CARRIER_ITEMS, DEFAULT_CARRIER } = AppConstants;

export type ForgotStep =
  | 'new_pass_form'
  | 'register_completed'
  | 'register_input';

const FORGOT_STEP: Record<string, ForgotStep> = {
  NEW_PASS_FORM: 'new_pass_form',
  REGISTER_COMPLETED: 'register_completed',
  REGISTER_INPUT: 'register_input',
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
  const [errorMessage, setErrorMessage] = useState('');
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

  const onPressRequestOtp = (callback: (isSuccess: boolean) => void) => {
    // alert(ValidateUtils.isPhoneNumber(formData.current.phone));
    // if (!ValidateUtils.isPhoneNumber(formData.current.phone as string)) {
    //   AppNavigator.showSnackBar({
    //     message: t('authorisation.error_phone_invalid'),
    //     type: 'failed',
    //   });
    //   return;
    // }
    dispatch(
      sendOtpForgotPassRequest({
        identifier: `${formData.current.birthday}-${formData.current.indentify}`,
        phone: formData.current.phone,
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
          callback?.(false);
        },
        onSuccess: (response: IResponseSendOtpForgotPass) => {
          formData.current.phoneVerificationToken =
            response.phoneVerificationToken;
          callback?.(true);
        },
      }),
    );
  };

  const onSubmitResetPass = (_data: any) => {
    dispatch(
      submitForgotPassRequest({
        resetToken: formData.current.resetToken,
        newPassword: _data?.password,
        confirmPassword: _data?.confirmPassword,
        onSuccess: () => {
          setStep(FORGOT_STEP.REGISTER_COMPLETED);
        },
        onFailure: msg => setErrorMessage(msg),
      }),
    );
  };
  const onSubmitRegisterInput = () => {
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
          setStep(FORGOT_STEP.NEW_PASS_FORM);
        },
        onFailure: msg => {
          setErrorMessage(msg);
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
    // disabled = false,
    errorMessage,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onSubmit,
    onToggleAgreement,
  };
};
