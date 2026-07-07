import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  memberShipVerifyRequest,
  registerUserRequest,
  sendOTPRequest,
  verifyOTPRequest,
} from '@services/slices/auth/authSlice';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import Selection from '@screens/Dialog/components/Selection';
import { CommonUtils } from '@utils';
import { AppConstants } from '@constants';
// import Information from '@screens/Dialog/components/Information';
import type { IResponseUniversity } from '@type/auth';
import {
  IResponseRegisterSendOtp,
  IResponseRegisterVerifyOtp,
} from '@type/auth';
import { validatePassword } from '@utils/common';

const {
  CARRIER_ITEMS,
  DEFAULT_CARRIER,
  MEMBERSHIP_OPTIONS,
  MEMBERSHIP_TYPE,
  STEP,
} = AppConstants;

export type RegisterErrors = {
  email?: string;
  errorApi?: string;
  name?: string;
  password?: string;
};

export type AuthStep =
  | 'choose_membership'
  | 'input_academic_email'
  | 'academic_verification'
  | 'academic_verification_completed'
  | 'choose_role'
  | 'form'
  | 'bank_information'
  | 'register_input';

export type FormData = {
  birthday?: string;
  mailAcademic?: string;
  carrier?: string;
  email: string;
  indentify?: string;
  membershipId?: string;
  name: string;
  otp?: string;
  password: string;
  phone?: string;
  phoneVerificationToken?: string;
  registerToken?: string;
  roleId?: string;
  school?: IResponseUniversity;
  signupToken?: string;
};

type RegisterFormFields = Pick<FormData, 'email' | 'name' | 'password'>;

const validateRegister = (
  values: RegisterFormFields,
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
  } else if (!validatePassword(values.password)) {
    errors.password = t('authorisation.pass_invalid');
  }
  return errors;
};

export const useRegister = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formData = useRef<FormData>({
    email: '',
    name: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    email?: boolean;
    errorApi?: string;
    name?: boolean;
    password?: boolean;
  }>({});

  const [step, setStep] = useState<AuthStep>(STEP.FORM);
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | undefined
  >();
  const [agreed, setAgreed] = useState(false);
  const [carrier, setCarrier] = useState<string>(DEFAULT_CARRIER);

  const onToggleAgreement = () => {
    setAgreed(previous => !previous);
  };

  const onPressCarrier = () => {
    AppNavigator.showDialog({
      cancelable: true,
      items: CARRIER_ITEMS,
      onSelect: (id: string) => {
        setCarrier(id);
        formData.current.carrier = id;
      },
      popupType: 'bottomSheet',
      screen: Selection,
      selectedId: carrier,
      title: t('register_flow.choose_carrier'),
    });
  };

  const onRegisterChange =
    (field: keyof RegisterFormFields) => (value: string) => {
      formData.current[field] = value;
      setErrors(previous => ({ ...previous, [field]: true }));
    };

  const onInfoChange = (field: keyof InputInfoValues, value: string) => {
    formData.current[field] = value;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const goToStep = (nextStep: string) => {
    if (Object.values(STEP).includes(nextStep as AuthStep)) {
      setStep(nextStep as AuthStep);
    }
  };

  const { visibleRegisterErrors, isRegisterValid } = useMemo(() => {
    if (step !== STEP.FORM) {
      return {};
    }
    const registerFormState = CommonUtils.computeFormAuthErrors(
      formData.current,
      { email: errors.email, name: errors.name, password: errors.password },
      validateRegister,
      t,
    );
    return {
      isRegisterValid: registerFormState.valid,
      visibleRegisterErrors: {
        ...(registerFormState.visible || {}),
        errorApi: errors.errorApi,
      },
    };
  }, [errors, step, t]);

  const onGoRegisterForm = () => {
    setErrors({ email: true, name: true, password: true });
    if (!isRegisterValid) return;
    dispatch(
      registerUserRequest({
        email: formData.current.email,
        name: formData.current.name,
        onFailure: (error: string) => {
          setErrors(prev => ({ ...prev, errorApi: error }));
        },
        onSuccess: (response: any) => {
          setStep(STEP.REGISTER_INPUT);
          formData.current.registerToken = response.registerToken;
        },
        password: formData.current.password,
      }),
    );
  };

  const setSignupToken = (token: string) => {
    formData.current.signupToken = token;
  };
  const setRegisterToken = (token: string) => {
    formData.current.registerToken = token;
  };

  const onSubmitRegisterInfo = () => {
    setStep(STEP.CHOOSE_MEMBERSHIP);
  };

  const onSelectMembership = (id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  };

  const onSubmitFormRegister = () => {
    if (formData.current?.membershipId !== MEMBERSHIP_TYPE.NON_MEMBER) {
      setStep(STEP.INPUT_ACADEMIC_EMAIL);
    } else {
      dispatch(
        memberShipVerifyRequest({
          signupToken: formData.current?.signupToken,
          membershipType: formData.current?.membershipId,
          onSuccess: () => {
            AppNavigator.navigate(Paths.RegisterCompleted, {
              isHideContribution: true,
            });
          },
          onFailure(error) {
            AppNavigator.showSnackBar({
              message: error,
              type: 'failed',
            });
          },
        }),
      );
    }
  };

  const onSelectRole = (id: string) => {
    formData.current = { ...formData.current, roleId: id };
  };

  const handleSubmit = (data?: any) => {
    switch (step) {
      case STEP.CHOOSE_MEMBERSHIP: {
        onSubmitFormRegister();
        break;
      }
      case STEP.ACADEMIC_VERIFICATION_COMPLETED: {
        AppNavigator.navigate(Paths.RegisterCompleted);
        break;
      }
      case STEP.REGISTER_INPUT: {
        onSubmitRegisterInfo();
        break;
      }
      case STEP.INPUT_ACADEMIC_EMAIL: {
        onSubmitAcademicEmail(data);
        break;
      }
      case STEP.BANK_INFORMATION: {
        AppNavigator.navigate(Paths.RegisterCompleted);
        break;
      }
      default: {
        break;
      }
    }
  };

  const onPressRequestOtp = (onSuccess: (isSuccess: boolean) => void) => {
    dispatch(
      sendOTPRequest({
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
          onSuccess(false);
        },
        onSuccess: (response: IResponseRegisterSendOtp) => {
          formData.current.phoneVerificationToken =
            response.phoneVerificationToken;
          onSuccess(true);
        },
        phone: formData.current.phone ?? '',
        registerToken: formData.current.registerToken ?? '',
      }),
    );
  };

  const onReEnterEmailAcademic = () => {
    setStep(STEP.INPUT_ACADEMIC_EMAIL);
  };

  const onSubmitAcademicEmail = (email: string) => {
    formData.current.mailAcademic = email;
    // setStep(STEP.ACADEMIC_VERIFICATION);
    dispatch(
      memberShipVerifyRequest({
        signupToken: formData.current?.signupToken,
        membershipType: formData.current?.membershipId,
        universityEmail: formData.current?.mailAcademic,
        onSuccess: () => {
          setStep(STEP.ACADEMIC_VERIFICATION);
        },
        onFailure(error) {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
          });
        },
      }),
    );
  };

  const onResendEmailAcademic = () => {
    dispatch(
      memberShipVerifyRequest({
        signupToken: formData.current?.signupToken,
        membershipType: formData.current?.membershipId,
        universityEmail: formData.current?.mailAcademic,
        onSuccess: () => {
          AppNavigator.showSnackBar({
            message: t('input_academic_email.resend_email_success'),
            type: 'success',
          });
        },
        onFailure(error) {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
          });
        },
      }),
    );
  };

  const onPressVerify = (callback: any) => {
    dispatch(
      verifyOTPRequest({
        identityNumber: `${formData.current.birthday ?? ''}-${
          formData.current.indentify ?? ''
        }`,
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
        onSuccess: (response: IResponseRegisterVerifyOtp) => {
          formData.current.signupToken = response.signupToken;
          // setStep(STEP.CHOOSE_MEMBERSHIP);
          callback?.(true);
        },
        otp: formData.current.otp ?? '',
        phone: formData.current.phone ?? '',
        phoneVerificationToken: formData.current.phoneVerificationToken,
        termsAgreed: true,
      }),
    );
  };

  return {
    clearErrors,
    agreed,
    carrier,
    chooseOptions: MEMBERSHIP_OPTIONS,
    formData,
    goToStep,
    handleSubmit,
    isRegisterValid,
    onGoRegisterForm,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onRegisterChange,
    onSelectMembership,
    onSelectRole,
    onToggleAgreement,
    onPressVerify,
    onReEnterEmailAcademic,
    onResendEmailAcademic,
    mailAcademic: formData.current.mailAcademic,
    setSignupToken,
    registerErrors: visibleRegisterErrors,
    selectedMembershipId,
    setRegisterToken,
    step,
  };
};
