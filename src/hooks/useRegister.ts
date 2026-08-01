import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';
import { AuthStep } from '@type/auth';

import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  confirmMemberShipVerifyRequest,
  sendOtpVerifyMembershipRequest,
  registerUserRequest,
  sendOTPRequest,
  verifyOTPRequest,
  createLinkVerifyUserRequest,
  membershipRequestManualRequest,
} from '@services/slices/auth/authSlice';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import Selection from '@screens/Dialog/components/Selection';
import { CommonUtils } from '@utils';
import { AppConstants } from '@constants';
// import Information from '@screens/Dialog/components/Information';
import type {
  IResponseCreateLinkVerifyInfoUser,
  IResponseRegisterUser,
  IResponseUniversity,
} from '@type/auth';
import {
  IResponseRegisterSendOtp,
  IResponseRegisterVerifyOtp,
} from '@type/auth';
import { validatePassword } from '@utils/common';
import Information from '@dialogs/Information';
import WebViewScreen from '@dialogs/Webview';
import { WebViewNavigation } from 'react-native-webview';
import { deepLinkGate } from '@navigation/deepLinkGate';
import { AppSelector } from '@services/selectors';

const {
  CARRIER_ITEMS,
  DEFAULT_CARRIER,
  MEMBERSHIP_OPTIONS,
  REGISTER_FLOW_STEP,
} = AppConstants;

export type RegisterErrors = {
  email?: string;
  errorApi?: string;
  name?: string;
  password?: string;
};

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

const INITIAL_FORM_DATA: FormData = {
  email: '',
  name: '',
  password: '',
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
  const formData = useRef<FormData>({ ...INITIAL_FORM_DATA });
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);

  const [errors, setErrors] = useState<{
    email?: boolean;
    errorApi?: string;
    name?: boolean;
    password?: boolean;
  }>({});

  const dataInfoVerifyMembership = useRef<unknown>(undefined);
  const [isVerifiedEmailAcademic, setVerifiedEmailAcademic] = useState(false);

  const [step, setStep] = useState<AuthStep>(REGISTER_FLOW_STEP.FORM);
  const stepStack = useRef<AuthStep[]>([]);

  const navigateToStep = (nextStep: AuthStep) => {
    if (nextStep == REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP) {
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
    if (step == REGISTER_FLOW_STEP.VERIFIED_INFO) {
      return 'register_completed.btn_confirm';
    }
    return '';
  }, [step]);

  const titleRegisterCompletedBtnSecondary = useMemo(() => {
    if (step == REGISTER_FLOW_STEP.VERIFIED_INFO) {
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

  // Called when the auth tab loses focus: wipe every value typed in the flow
  // (the ref) plus the states mirroring it, so coming back starts from scratch.
  const resetFormData = () => {
    formData.current = { ...INITIAL_FORM_DATA };
    dataInfoVerifyMembership.current = undefined;
    setErrors({});
    setAgreed(false);
    setCarrier(DEFAULT_CARRIER);
    setSelectedMembershipId(undefined);
    setVerifiedEmailAcademic(false);
  };

  const goToStep = (nextStep: string, showBtnBack = false) => {
    if (Object.values(REGISTER_FLOW_STEP).includes(nextStep as AuthStep)) {
      navigateToStep(nextStep as AuthStep);
      needShowBtnBack.current = showBtnBack;
    }
  };

  const { visibleRegisterErrors, isRegisterValid } = useMemo(() => {
    if (step !== REGISTER_FLOW_STEP.FORM) {
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

  const onCreateLinkVerifyUser = () => {
    dispatch(
      createLinkVerifyUserRequest({
        registerToken: formData.current.registerToken || '',
        onSuccess: (response: IResponseCreateLinkVerifyInfoUser) => {
          AppNavigator.showDialog({
            screen: WebViewScreen,
            cookies: {
              call_url: response?.callUrl,
              reg_cert_key: response?.regCertKey,
              ordr_idxx: response?.ordrIdxx,
            },
            onLoadStart: () => undefined,
            url: response?.certWebViewUrl,
            isFullScreen: true,
            onNavigationStateChange: (
              navState: WebViewNavigation,
              onRequestClose?: any,
            ) => {
              // console.log('navState', navState);
              const { url } = navState || {};
              // coop://registration/identity/failure?error=cert_failed
              const isDeeplinkApp = url?.startsWith?.('coop://');
              if (isDeeplinkApp) {
                const params = deepLinkGate.getPathFromUrl(navState.url);
                if (params?.error) {
                  onRequestClose?.();
                  navigateToStep(REGISTER_FLOW_STEP.VERIFY_INFO_FAILED);
                } else {
                  formData.current.signupToken = params.signupToken as string;
                  onRequestClose?.();
                  onSubmitRegisterInfo();
                }
                // console.log("params",params)
              }
            },
          });
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
        onSuccess: (response: IResponseRegisterUser) => {
          // console.log("responseCreateLink",response)
          // navigateToStep(REGISTER_FLOW_STEP.REGISTER_INPUT);
          formData.current.registerToken = response.registerToken;
          onCreateLinkVerifyUser();
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
    // navigateToStep(REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP);
    navigateToStep(REGISTER_FLOW_STEP.VERIFIED_INFO);
  };

  const onSelectMembership = (id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  };

  const onSubmitFormRegister = (_data: any) => {
    const { item, otherReason } = _data || {};

    if (item?.other && otherReason) {
      dispatch(
        membershipRequestManualRequest({
          universityId: formData.current.school?.id,
          applicationNote: otherReason,
          signupToken: formData.current?.signupToken,
          membershipType: item?.id || '',
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
    } else {
      formData.current.membershipId = item?.id;
      navigateToStep(REGISTER_FLOW_STEP.INPUT_ACADEMIC_EMAIL);
    }
    // if (formData.current?.membershipId !== MEMBERSHIP_TYPE.NON_MEMBER) {
    //   navigateToStep(REGISTER_FLOW_STEP.INPUT_ACADEMIC_EMAIL);
    // } else {
    //   dispatch(
    //     sendOtpVerifyMembershipRequest({
    //       universityId: formData.current.school?.id,
    //       signupToken: formData.current?.signupToken,
    //       membershipType: formData.current?.membershipId,
    //       onSuccess: () => {
    //         AppNavigator.navigate(Paths.RegisterCompleted, {
    //           isHideContribution: true,
    //         });
    //       },
    //       onFailure(error) {
    //         AppNavigator.showSnackBar({
    //           message: error,
    //           type: 'failed',
    //         });
    //       },
    //     }),
    //   );
    // }
  };

  const onSelectRole = (id: string) => {
    formData.current = { ...formData.current, roleId: id };
  };

  const goBack = () => {
    needShowBtnBack.current = false;
    const previous = stepStack.current?.pop?.();
    if (previous !== undefined) {
      if (previous == REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP) {
        needShowBtnBack.current = true;
      }
      setStep(previous);
    } else {
      setStep(REGISTER_FLOW_STEP.FORM);
    }
  };

  const handleSubmit = (data?: any) => {
    switch (step) {
      case REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP: {
        onSubmitFormRegister(data);
        break;
      }
      case REGISTER_FLOW_STEP.VERIFIED_INFO: {
        navigateToStep(REGISTER_FLOW_STEP.FORM);
        break;
      }
      case REGISTER_FLOW_STEP.CHOOSE_SCHOOL: {
        formData.current.school = data;
        navigateToStep(REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP);
        break;
      }
      case REGISTER_FLOW_STEP.ACADEMIC_VERIFICATION_COMPLETED: {
        if (isEnablePaymentCard) {
          AppNavigator.navigate(Paths.RegisterCompleted);
        } else {
          navigateToStep(REGISTER_FLOW_STEP.BANK_INFORMATION);
        }
        break;
      }
      case REGISTER_FLOW_STEP.ACADEMIC_VERIFICATION: {
        navigateToStep(REGISTER_FLOW_STEP.ACADEMIC_VERIFICATION_COMPLETED);
        break;
      }
      case REGISTER_FLOW_STEP.REGISTER_INPUT: {
        onSubmitRegisterInfo();
        break;
      }
      case REGISTER_FLOW_STEP.INPUT_ACADEMIC_EMAIL: {
        onSubmitAcademicEmail(data);
        break;
      }
      case REGISTER_FLOW_STEP.BANK_INFORMATION: {
        AppNavigator.navigate(Paths.RegisterCompleted, {
          isHideContribution: true,
        });
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
    navigateToStep(REGISTER_FLOW_STEP.INPUT_ACADEMIC_EMAIL);
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
          navigateToStep(REGISTER_FLOW_STEP.ACADEMIC_VERIFICATION);
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
          // setStep(REGISTER_FLOW_STEP.CHOOSE_MEMBERSHIP);
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
    navigateToStep(REGISTER_FLOW_STEP.CHOOSE_SCHOOL);
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
    onCreateLinkVerifyUser,
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
    resetRegisterForm: resetFormData,
    selectedMembershipId,
    setRegisterToken,
    step,
  };
};
