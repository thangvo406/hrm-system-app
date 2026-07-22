import { AppConstants } from '@constants';
import {
  MEMBERSHIP_OPTIONS,
  REGISTER_MEMBER_SHIP_STEP,
} from '@constants/config';
import { AppStorage } from '@services/common/storage';
import { IResponseUniversity, RegisterMembershipStep } from '@type';
import { useMemo, useRef, useState } from 'react';

const membershipOptions = MEMBERSHIP_OPTIONS.filter(
  it => it.id != 'NON_MEMBER',
);

type TFormData = {
  academicEmail?: string;
  school?: IResponseUniversity;
  membership?: string;
}

const STEP_SHOW_BTN_BACK = new Set<string>([
  REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL,
  REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP,
  REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL,
]);

const useRegisterMembership = (props: any) => {
  const { onRequestClose } = props || {};
  const [step, setStep] = useState<string>(
    REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL,
  );
  const stepStack = useRef<RegisterMembershipStep[]>([]);
  const formData = useRef<TFormData>({});

  const showBtnBack = useMemo(() => {
    const isValid = STEP_SHOW_BTN_BACK.has(step);
    return isValid;
  }, [step]);

  const navigateToStep = (nextStep: RegisterMembershipStep) => {
    stepStack.current?.push?.(step);
    setStep(nextStep);
  };


  const onVerifyEmail = () => {};
  const onSendOtpVerifyEmail = () => {};

  const onSubmit = (data?: any) => {
    switch (step) {
      case REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP: {
        formData.current.membership = data;
        navigateToStep(REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL);
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.CHOOSE_SCHOOL: {
        formData.current.school = data;
        navigateToStep(REGISTER_MEMBER_SHIP_STEP.CHOOSE_MEMBERSHIP);
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.INPUT_ACADEMIC_EMAIL: {
        formData.current.academicEmail = data;
        onSendOtpVerifyEmail();
        break;
      }
      case REGISTER_MEMBER_SHIP_STEP.ACADEMIC_VERIFICATION: {
        onVerifyEmail();
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
      default: {
        break;
      }
    }
  };

  const onPressTopup = () => {
    AppStorage.set(AppConstants.NEED_CONTRIBUTION_KEY, true);
    onRequestClose?.();
  };

  const onBack = () => {
    const previous = stepStack.current?.pop?.();
    if (previous !== undefined) {
      setStep(previous);
    } else {
      onRequestClose?.();
    }
  };

  return {
    step,
    membershipOptions,
    showBtnBack,
    onBack,
    onSubmit,
    onPressTopup,
  };
};

export { useRegisterMembership };
