import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  completeRegisterRequest,
  getUniversitiesRequest,
  registerUserRequest,
  sendOTPRequest,
  verifyOTPRequest,
} from '@services/slices/auth/authSlice';
import AppNavigator from '@navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@navigation/types';
import { Paths } from '@navigation/paths';
import Selection from '@screens/Dialog/components/Selection';
import { computeFormAuthErrors } from '@utils/common';
import { AppConstants } from '@constants';
import Information from '@screens/Dialog/components/Information';
import {
  IResponseRegisterSendOtp,
  IResponseRegisterVerifyOtp,
  IResponseUniversity,
} from '../types/Auth';

const {
  CARRIER_ITEMS,
  DEFAULT_CARRIER,
  MEMBERSHIP_OPTIONS,
  MEMBERSHIP_TYPE,
  PASSWORD_MIN_LENGTH,
  STEP,
} = AppConstants;
export type RegisterErrors = {
  email?: string;
  name?: string;
  password?: string;
};

export type AuthStep =
  | 'choose_membership'
  | 'choose_role'
  | 'choose_school'
  | 'form'
  | 'bank_information'
  | 'register_completed'
  | 'register_input';

export type FormData = {
  birthday?: string;
  indentify?: string;
  carrier?: string;
  email: string;
  membershipId?: string;
  name: string;
  otp?: string;
  password: string;
  phone?: string;
  roleId?: string;
  school?: IResponseUniversity;
  phoneVerificationToken?: string;
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
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = t('authorisation.error_password_min');
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
    name?: boolean;
    password?: boolean;
  }>({});

  const [step, setStep] = useState<AuthStep>(STEP.FORM);
  const [schoolKeyword, setSchoolKeyword] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<
    string | undefined
  >();
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | undefined
  >();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [agreed, setAgreed] = useState(false);
  const [carrier, setCarrier] = useState<string>(DEFAULT_CARRIER);
  const [universities, setUniversities] = useState<IResponseUniversity[]>([]);

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
      screen: Selection,
      selectedId: carrier,
      title: t('register_flow.choose_carrier'),
    });
  };

  const onRegisterChange =
    (field: keyof RegisterFormFields) => (value: string) => {
      formData.current[field] = value;
      // formData.current = { ...formData.current, [field]: value };
      setErrors(previous => ({ ...previous, [field]: true }));
    };

  const onInfoChange = (field: keyof InputInfoValues, value: string) => {
    formData.current[field] = value;
    // formData.current = { ...formData.current, [field]: value };
  };

  const goToStep = (step: string) => {
    if (Object.values(STEP).includes(step as AuthStep)) {
      setStep(step as AuthStep);
    }
  };

  // const chooseOptions = useMemo(() => {
  //   const options: Partial<
  //     Record<AuthStep, typeof MEMBERSHIP_OPTIONS | typeof ROLE_OPTIONS>
  //   > = {
  //     [STEP.CHOOSE_MEMBERSHIP]: MEMBERSHIP_OPTIONS,
  //     [STEP.CHOOSE_ROLE]: ROLE_OPTIONS,
  //   };
  //   return options[step] ?? [];
  // }, [step]);

  const { visibleRegisterErrors, isRegisterValid } = useMemo(() => {
    if (step != STEP.FORM) {
      return {};
    }
    const registerFormState = computeFormAuthErrors(
      // eslint-disable-next-line react-hooks/refs
      formData.current,
      { email: errors.email, name: errors.name, password: errors.password },
      validateRegister,
      t,
    );
    return {
      visibleRegisterErrors: registerFormState.visible,
      isRegisterValid: registerFormState.valid,
    };
  }, [errors, step, t]);

  const onGetUniversities = () => {
    dispatch(
      getUniversitiesRequest({
        onSuccess: data => {
          setUniversities(data);
        },
        onFailure: () => setUniversities([] as IResponseUniversity),
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
        password: formData.current.password,
        onSuccess: () => {
          setStep(STEP.REGISTER_INPUT);
          onGetUniversities();
        },
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
      }),
    );
    // setStep(STEP.INFO);
  };

  const onSubmitRegisterInfo = () => {
    dispatch(
      verifyOTPRequest({
        email: formData.current.email,
        otp: formData.current.otp,
        phone: formData.current.phone,
        phoneVerificationToken: formData.current.phoneVerificationToken,
        identityNumber: `${formData.current.birthday}-${formData.current.indentify}`,
        termsAgreed: true,
        onSuccess: (response: IResponseRegisterVerifyOtp) => {
          formData.current.signupToken = response.signupToken;
          setStep(STEP.CHOOSE_MEMBERSHIP);
        },
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
      }),
    );
  };

  const onCompletedRegister = () => {
    dispatch(
      completeRegisterRequest({
        email: formData.current.email,
        universityId: formData.current?.school?.id,
        universityName: formData.current?.school?.name,
        signupToken: formData.current?.signupToken,
        membershipType: formData.current?.membershipId,
        onSuccess: () => {
          setStep(STEP.REGISTER_COMPLETED);
        },
      }),
    );
  };

  const submitSchool = () => {
    if (formData.current?.membershipId != MEMBERSHIP_TYPE.NON_MEMBER) {
      setStep(STEP.BANK_INFORMATION);
    } else {
      onCompletedRegister();
    }
  };

  const onSelectMembership = (id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  };

  const onSubmitFormRegister = () => {
    if (formData.current?.membershipId != MEMBERSHIP_TYPE.NON_MEMBER) {
      AppNavigator.showDialog({
        screen: Information,
        desc: '조합원 가입을 위해 최초 1회 출자금 납부가 필요합니다. 계속 진행할까요?',
        cancelTitle: '취소',
        confirmTitle: '확인',
        onConfirm: () => {
          setStep(STEP.CHOOSE_SCHOOL);
        },
      });
    } else {
      setStep(STEP.CHOOSE_SCHOOL);
    }
  };

  const onSelectRole = (id: string) => {
    formData.current = { ...formData.current, roleId: id };
  };

  const filteredSchools = useMemo(() => {
    const query = schoolKeyword.trim().toLowerCase();
    if (query.length === 0) return universities;
    return universities?.filter(school =>
      school.name.toLowerCase().includes(query),
    );
  }, [schoolKeyword, universities]);

  const selectedSchool = useMemo(
    () => universities?.find(school => school.id === selectedSchoolId),
    [selectedSchoolId, universities],
  );

  const onSchoolKeywordChange = (value: string) => {
    setSchoolKeyword(value);
  };

  const onSelectSchool = (school: IResponseUniversity) => {
    setSelectedSchoolId(school.id);
    formData.current = { ...formData.current, school };
  };

  const handleSubmit = () => {
    switch (step) {
      case STEP.CHOOSE_MEMBERSHIP: {
        onSubmitFormRegister();
        break;
      }
      case STEP.CHOOSE_SCHOOL: {
        submitSchool();
        break;
      }
      case STEP.REGISTER_INPUT: {
        onSubmitRegisterInfo();
        break;
      }
      case STEP.BANK_INFORMATION: {
        onCompletedRegister();
        break;
      }
      case STEP.REGISTER_COMPLETED: {
        navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
        break;
      }
      default: {
        break;
      }
    }
  };

  const onPressRequestOtp = (onSuccess: (isSuccess: boolean) => void) => {
    // alert(ValidateUtils.isPhoneNumber(formData.current.phone));
    // if (!ValidateUtils.isPhoneNumber(formData.current.phone as string)) {
    //   AppNavigator.showSnackBar({
    //     message: t('authorisation.error_phone_invalid'),
    //     type: 'failed',
    //   });
    //   return;
    // }
    dispatch(
      sendOTPRequest({
        email: formData.current.email,
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
      }),
    );
  };

  return {
    agreed,
    carrier,
    chooseOptions: MEMBERSHIP_OPTIONS,
    filteredSchools,
    formData,
    goToStep,
    handleSubmit,
    isRegisterValid,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectMembership,
    onGetUniversities,
    onSelectRole,
    onSelectSchool,
    onToggleAgreement,
    registerErrors: visibleRegisterErrors,
    schoolKeyword,
    selectedMembershipId,
    selectedSchool,
    selectedSchoolId,
    step,
    onGoRegisterForm,
  };
};
