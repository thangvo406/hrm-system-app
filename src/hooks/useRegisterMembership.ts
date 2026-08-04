import {
  MEMBERSHIP_OPTIONS,
  REGISTER_MEMBER_SHIP_STEP,
} from '@constants/config';
import Information from '@dialogs/Information';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import {
  confirmOTPRequestMembershipRequest,
  getProfileRequest,
  updateMembershipRequest,
} from '@services/slices/account/accountSlice';
import { IResponseUniversity, RegisterMembershipStep } from '@type';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const membershipOptions = MEMBERSHIP_OPTIONS.filter(
  it => it.id != 'NON_MEMBER',
);

type TFormData = {
  emailVerificationToken?: string;
  academicEmail?: string;
  school?: IResponseUniversity;
  membership?: any;
};

const STEP_SHOW_BTN_BACK = new Set<string>([
  REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL,
  REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP,
  REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL,
]);

const useRegisterMembership = (props: any) => {
  const { onRequestClose } = props || {};
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);

  const [step, setStep] = useState<string>(
    REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL,
  );
  const [timeResendOtpVerifyEmail, setTimeResendOtpVerifyEmail] = useState(0);
  const [emailExpiresIn, setEmailExpiresIn] = useState(0);
  const dataInfoVerifyMembership = useRef<unknown>(undefined);
  const [isVerifiedEmailAcademic, setVerifiedEmailAcademic] = useState(false);
  const isShowContributeBtn = useRef(true);

  const stepStack = useRef<RegisterMembershipStep[]>([]);
  const formData = useRef<TFormData>({});

  const showBtnBack = useMemo(() => {
    const isValid = STEP_SHOW_BTN_BACK.has(step);
    return isValid;
  }, [step]);

  const ignoreSchoolId = useMemo(() => {
    if (profile?.membershipType && profile?.universityId) {
      return profile?.universityId;
    }
    return null;
  }, [profile]);

  const navigateToStep = (nextStep: RegisterMembershipStep) => {
    stepStack.current?.push?.(step);
    setStep(nextStep);
  };

  useEffect(() => {
    return () => {
      if (dataInfoVerifyMembership.current) {
        dispatch(getProfileRequest());
      }
    };
  }, []);

  const onSendOtpVerifyEmail = (callback: any) => {
    const { item, otherReason } = formData.current.membership || {};

    dispatch(
      updateMembershipRequest({
        universityId: formData.current.school?.id || 0,
        applicationNote: otherReason || '',
        membershipType: item?.id,
        universityEmail: formData.current?.academicEmail || '',
        onSuccess: res => {
          callback?.(res);
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

  const onSubmit = (data?: any) => {
    switch (step) {
      case REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP: {
        const { item, otherReason } = data || {};
        formData.current.membership = data;
        if (item?.other && otherReason) {
          onSendOtpVerifyEmail?.(() => {
            isShowContributeBtn.current = false;
            navigateToStep(REGISTER_MEMBER_SHIP_STEP.REGISTER_COMPLETED);
          });
        } else {
          navigateToStep(REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL);
        }
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL: {
        formData.current.school = data;
        navigateToStep(REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP);
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL: {
        formData.current.academicEmail = data;
        onSendOtpVerifyEmail(res => {
          const { item, otherReason } = formData.current.membership || {};
          if (item?.other && otherReason) {
            navigateToStep(REGISTER_MEMBER_SHIP_STEP.REGISTER_COMPLETED);
          } else {
            formData.current.emailVerificationToken =
              res.emailVerificationToken;
            setTimeResendOtpVerifyEmail(res?.resendAfterMs);
            setEmailExpiresIn(res?.emailVerificationExpiresIn);
            navigateToStep(REGISTER_MEMBER_SHIP_STEP.ACADEMIC_VERIFICATION);
          }
        });
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.ACADEMIC_VERIFICATION: {
        navigateToStep(
          REGISTER_MEMBER_SHIP_STEP.ACADEMIC_VERIFICATION_COMPLETED,
        );
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.ACADEMIC_VERIFICATION_COMPLETED: {
        navigateToStep(REGISTER_MEMBER_SHIP_STEP.REGISTER_COMPLETED);
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.REGISTER_COMPLETED: {
        onRequestClose?.();
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.BANK_INFORMATION: {
        onRequestClose?.();
        break;
      }
      default: {
        break;
      }
    }
  };

  const onPressContribute = () => {
    navigateToStep(REGISTER_MEMBER_SHIP_STEP.BANK_INFORMATION);
  };
  const onPressVerifyEmailAcademic = (otp: string) => {
    dispatch(
      confirmOTPRequestMembershipRequest({
        otp,
        emailVerificationToken: formData.current.emailVerificationToken || '',
        universityEmail: formData.current.academicEmail || '',
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
  const onReEnterEmailAcademic = () => {
    onBack();
    setVerifiedEmailAcademic(false);
  };
  const onResendEmailAcademic = () => {
    onSendOtpVerifyEmail(() => undefined);
  };
  const onBack = () => {
    const previous = stepStack.current?.pop?.();
    if (previous !== undefined) {
      setStep(previous);
    } else {
      onRequestClose?.();
    }
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

  return {
    step,
    membershipOptions,
    showBtnBack,
    timeResendOtpVerifyEmail,
    emailExpiresIn,
    isVerifiedEmailAcademic,
    ignoreSchoolId,
    isShowContributeBtn: isShowContributeBtn.current,
    mailAcademic: formData.current?.academicEmail,
    dataInfoVerifyMembership: dataInfoVerifyMembership.current,
    onBack,
    onOTPEmailAcademicExpired,
    onPressContribute,
    onSubmit,
    onResendEmailAcademic,
    onReEnterEmailAcademic,
    onPressVerifyEmailAcademic,
  };
};

export { useRegisterMembership };
