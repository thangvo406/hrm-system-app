import { ValidateUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import Selection from '@screens/Dialog/components/Selection';
import { useAppDispatch } from '@services/common/storeHooks';
import { sendOtpForgotPassRequest } from '@services/slices/auth/authSlice';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IResponseRegisterSendOtp } from '../types/Auth';
import { ForgotStep } from './useForgotPass';

export const useForgotPass = () => {
  const [agreed, setAgreed] = useState(false);
  const [carrier, setCarrier] = useState<string>(DEFAULT_CARRIER);
  const formData = useRef<FormData>({
    email: '',
    name: '',
    password: '',
  });
  const [step, setStep] = useState<ForgotStep>('register_input');
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

  const onPressRequestOtp = (onSuccess: () => void) => {
    // alert(ValidateUtils.isPhoneNumber(formData.current.phone));
    if (!ValidateUtils.isPhoneNumber(formData.current.phone as string)) {
      AppNavigator.showSnackBar({
        message: t('authorisation.error_phone_invalid'),
        type: 'failed',
      });
      return;
    }
    dispatch(
      sendOtpForgotPassRequest({
        identifier: formData.current.email,
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
        onSuccess: (response: IResponseRegisterSendOtp) => {
          // formData.current.phoneVerificationToken =
          //   response.phoneVerificationToken;
          onSuccess();
        },
      }),
    );
  };

  const onSubmit = () => {};

  const onToggleAgreement = () => {
    setAgreed(previous => !previous);
  };

  return {
    agreed,
    carrier,
    step,
    // disabled = false,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onSubmit,
    onToggleAgreement,
  };
};
