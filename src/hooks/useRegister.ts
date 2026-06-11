import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@services/common/storeHooks';
import {
  completeRegisterRequest,
  registerUserRequest,
  sendOTPRequest,
  verifyOTPRequest,
} from '@services/slices/auth/authSlice';
import AppNavigator from '@navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@navigation/types';
import { Paths } from '@navigation/paths';

import { computeFormAuthErrors } from '@utils/common';
import { AppConstants } from '@constants';

const {
  MEMBERSHIP_OPTIONS,
  PASSWORD_MIN_LENGTH,
  MOCK_SCHOOLS,
  ROLE_OPTIONS,
  STEP,
} = AppConstants;
export type RegisterErrors = {
  email?: string;
  name?: string;
  password?: string;
};

export type School = {
  readonly address: string;
  readonly id: string;
  readonly name: string;
};

export type AuthStep =
  | 'choose_membership'
  | 'choose_role'
  | 'choose_school'
  | 'form'
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
  school?: School;
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

  const chooseOptions = useMemo(() => {
    const options: Partial<
      Record<AuthStep, typeof MEMBERSHIP_OPTIONS | typeof ROLE_OPTIONS>
    > = {
      [STEP.CHOOSE_MEMBERSHIP]: MEMBERSHIP_OPTIONS,
      [STEP.CHOOSE_ROLE]: ROLE_OPTIONS,
    };
    return options[step] ?? [];
  }, [step]);

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

  const submitRegister = () => {
    setErrors({ email: true, name: true, password: true });
    if (!isRegisterValid) return;
    dispatch(
      registerUserRequest({
        email: formData.current.email,
        name: formData.current.name,
        password: formData.current.password,
        onSuccess: () => {
          setStep(STEP.REGISTER_INPUT);
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
        // birthday: formData.current.birthday1 ?? '',
        identityNumber: `${formData.current.birthday}-${formData.current.indentify}`,
        // birthday: '2000-08-01',
        termsAgreed: true,
        onSuccess: () => {
          setStep(STEP.CHOOSE_SCHOOL);
        },
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
      }),
    );
  };

  const submitSchool = () => {
    // console.log('submitSchool', formData.current);
    setStep(STEP.CHOOSE_MEMBERSHIP);
  };

  const onSelectMembership = (id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  };

  const onSubmitFormRegister = () => {
    dispatch(
      completeRegisterRequest({
        email: formData.current.email,
        universityExternalId: formData.current?.school?.id,
        universityName: formData.current?.school?.name,
        membershipType: formData.current?.membershipId
          ? 'MEMBER'
          : 'NON_MEMBER',
        onSuccess: () => {
          setStep(STEP.REGISTER_COMPLETED);
        },
      }),
    );
  };

  const onSelectRole = (id: string) => {
    formData.current = { ...formData.current, roleId: id };
  };

  const filteredSchools = useMemo(() => {
    const query = schoolKeyword.trim().toLowerCase();
    if (query.length === 0) return MOCK_SCHOOLS;
    return MOCK_SCHOOLS.filter(school =>
      school.name.toLowerCase().includes(query),
    );
  }, [schoolKeyword]);

  const selectedSchool = useMemo(
    () => MOCK_SCHOOLS.find(school => school.id === selectedSchoolId),
    [selectedSchoolId],
  );

  const onSchoolKeywordChange = (value: string) => {
    setSchoolKeyword(value);
  };

  const onSelectSchool = (school: School) => {
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
      case STEP.REGISTER_COMPLETED: {
        navigation.reset({ index: 0, routes: [{ name: Paths.Home }] });
        break;
      }
      default: {
        break;
      }
    }
  };

  const onPressRequestOtp = (onSuccess: () => void) => {
    // if (!ValidateUtils.isPhoneNumber(formData.current.phone)) {
    // }
    dispatch(
      sendOTPRequest({
        email: formData.current.email,
        onFailure: (error: string) => {
          AppNavigator.showSnackBar({ message: error, type: 'failed' });
        },
        onSuccess,
        phone: formData.current.phone ?? '',
      }),
    );
  };

  return {
    chooseOptions,
    filteredSchools,
    formData,
    goToStep,
    handleSubmit,
    isRegisterValid,
    onInfoChange,
    onPressRequestOtp,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectMembership,
    onSelectRole,
    onSelectSchool,
    registerErrors: visibleRegisterErrors,
    schoolKeyword,
    selectedMembershipId,
    selectedSchool,
    selectedSchoolId,
    step,
    submitRegister,
  };
};
