import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  confirmMemberShipVerifyRequest,
  sendOtpVerifyMembershipRequest,
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
import Information from '@dialogs/Information';

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
  | 'verified_info'
  | 'register_input'
  | 'choose_school';

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
  otpAcademic?: string;
  school?: IResponseUniversity;
  signupToken?: string;
  emailVerificationToken?: string;
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

  const dataInfoVerifyMembership = useRef(null);
  const [isVerifiedEmailAcademic, setVerifiedEmailAcademic] = useState(false);

  const [step, setStep] = useState<AuthStep>(STEP.FORM);
  const stepStack = useRef<AuthStep[]>([]);

  const navigateToStep = (nextStep: AuthStep) => {
    if (nextStep == STEP.CHOOSE_MEMBERSHIP) {
      needShowBtnBack.current = true;
    }
    stepStack.current?.push?.(step);
    setStep(nextStep);
  };
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | undefined
  >();
  const [agreed, setAgreed] = useState(false);
  const [carrier, setCarrier] = useState<string>(DEFAULT_CARRIER);
  const needShowBtnBack = useRef(false);

  const titleRegisterCompletedBtnPrimary = useMemo(() => {
    if (step == STEP.VERIFIED_INFO) {
      return 'register_completed.btn_confirm';
    }
    return '';
  }, [step]);

  const titleRegisterCompletedBtnSecondary = useMemo(() => {
    if (step == STEP.VERIFIED_INFO) {
      return 'register_completed.btn_academic_verification';
    }
    return '';
  }, [step]);

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

  const goToStep = (nextStep: string, showBtnBack = false) => {
    if (Object.values(STEP).includes(nextStep as AuthStep)) {
      navigateToStep(nextStep as AuthStep);
      needShowBtnBack.current = showBtnBack;
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

  const onPressVerifyEmailAcademic = (otp: string) => {
    formData.current.otpAcademic = otp;
    dispatch(
      confirmMemberShipVerifyRequest({
        otp,
        emailVerificationToken: formData.current.emailVerificationToken || '',
        universityEmail: formData.current.mailAcademic || '',
        onSuccess: (response: any) => {
          dataInfoVerifyMembership.current = response;
          setVerifiedEmailAcademic(true);
        },
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
          });
        },
      }),
    );
  };

  const onOTPEmailAcademicExpired = (callback: any) => {
    AppNavigator.showDialog({
      screen: Information,
      title: t('academic_verification.otp_expired_title'),
      desc: t('academic_verification.otp_expired_desc'),
      confirmTitle: t('academic_verification.otp_expired_confirm'),
      onConfirm: () => {
        onResendEmailAcademic();
        callback?.();
      },
    });
  };

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
          navigateToStep(STEP.REGISTER_INPUT);
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
    // navigateToStep(STEP.CHOOSE_MEMBERSHIP);
    //TODO: hard code
    navigateToStep(STEP.VERIFIED_INFO);
  };

  const onSelectMembership = (id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  };

  const onSubmitFormRegister = () => {
    if (formData.current?.membershipId !== MEMBERSHIP_TYPE.NON_MEMBER) {
      navigateToStep(STEP.INPUT_ACADEMIC_EMAIL);
    } else {
      dispatch(
        sendOtpVerifyMembershipRequest({
          universityId: formData.current.school?.id,
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

  const goBack = () => {
    needShowBtnBack.current = false;
    const previous = stepStack.current?.pop?.();
    if (previous !== undefined) {
      if (previous == STEP.CHOOSE_MEMBERSHIP) {
        needShowBtnBack.current = true;
      }
      setStep(previous);
    } else {
      setStep(STEP.FORM);
    }
  };

  const handleSubmit = (data?: any) => {
    switch (step) {
      case STEP.CHOOSE_MEMBERSHIP: {
        onSubmitFormRegister();
        break;
      }
      case STEP.VERIFIED_INFO: {
        navigateToStep(STEP.FORM);
        break;
      }
      case STEP.CHOOSE_SCHOOL: {
        formData.current.school = data;
        navigateToStep(STEP.CHOOSE_MEMBERSHIP);
        break;
      }
      case STEP.ACADEMIC_VERIFICATION_COMPLETED: {
        AppNavigator.navigate(Paths.RegisterCompleted);
        break;
      }
      case STEP.ACADEMIC_VERIFICATION: {
        navigateToStep(STEP.ACADEMIC_VERIFICATION_COMPLETED);
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
    setVerifiedEmailAcademic(false);
    navigateToStep(STEP.INPUT_ACADEMIC_EMAIL);
  };

  const onSubmitAcademicEmail = (email: string) => {
    formData.current.mailAcademic = email;
    dispatch(
      sendOtpVerifyMembershipRequest({
        universityId: formData.current.school?.id,
        signupToken: formData.current?.signupToken,
        membershipType: formData.current?.membershipId,
        universityEmail: formData.current?.mailAcademic,
        onSuccess: (response: any) => {
          formData.current.emailVerificationToken =
            response.emailVerificationToken;
          navigateToStep(STEP.ACADEMIC_VERIFICATION);
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
      sendOtpVerifyMembershipRequest({
        universityId: formData.current.school?.id,
        signupToken: formData.current?.signupToken,
        membershipType: formData.current?.membershipId,
        universityEmail: formData.current?.mailAcademic,
        onSuccess: (response: any) => {
          formData.current.emailVerificationToken =
            response.emailVerificationToken;
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

  const onPressSelectSchool = () => {
    navigateToStep(STEP.CHOOSE_SCHOOL);
  };

  return {
    clearErrors,
    agreed,
    carrier,
    chooseOptions: MEMBERSHIP_OPTIONS,
    formData,
    goBack,
    goToStep,
    handleSubmit,
    isRegisterValid,
    onGoRegisterForm,
    onInfoChange,
    onPressSelectSchool,
    titleRegisterCompletedBtnPrimary,
    titleRegisterCompletedBtnSecondary,
    isVerifiedEmailAcademic,
    dataInfoVerifyMembership: dataInfoVerifyMembership.current,
    onPressVerifyEmailAcademic,
    onPressCarrier,
    onPressRequestOtp,
    onRegisterChange,
    onSelectMembership,
    onSelectRole,
    onToggleAgreement,
    onPressVerify,
    onReEnterEmailAcademic,
    onResendEmailAcademic,
    onOTPEmailAcademicExpired,
    needShowBtnBack: needShowBtnBack.current,
    mailAcademic: formData.current.mailAcademic,
    setSignupToken,
    registerErrors: visibleRegisterErrors,
    selectedMembershipId,
    setRegisterToken,
    step,
  };
};
