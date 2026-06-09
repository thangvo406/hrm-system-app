import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import type { ChooseSchoolValues } from '@screens/Authorisation/components/RegisterFlow/ChooseSchool';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import {
  PASSWORD_MIN_LENGTH,
  computeFormErrors,
} from './authorisation/validation';

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
  | 'info';

export const STEP = {
  CHOOSE_MEMBERSHIP: 'choose_membership' as AuthStep,
  CHOOSE_ROLE: 'choose_role' as AuthStep,
  CHOOSE_SCHOOL: 'choose_school' as AuthStep,
  FORM: 'form' as AuthStep,
  INFO: 'info' as AuthStep,
} as const;

export type FormData = {
  email: string;
  info?: InputInfoValues;
  membershipId?: string;
  name: string;
  password: string;
  roleId?: string;
  schoolId?: string;
};

type RegisterFormFields = Pick<FormData, 'email' | 'name' | 'password'>;

const MOCK_SCHOOLS: readonly School[] = [
  { address: '서울시 OO구 OO동 OOO', id: '1', name: '생협대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '2', name: '쿠피대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '3', name: '그냥대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '4', name: '좋은대학교' },
];

const MEMBERSHIP_OPTIONS = [
  { id: 'member', label: 'Join as a member' },
  { id: 'non_member', label: 'Join as a non-member' },
] as const;

const ROLE_OPTIONS = [
  { id: 'employee', label: 'Employee' },
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
] as const;

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

  const onRegisterChange = useCallback(
    (field: keyof RegisterFormFields) => (value: string) => {
      formData.current = { ...formData.current, [field]: value };
      // setRegisterFields(previous => ({ ...previous, [field]: value }));
      setErrors(previous => ({ ...previous, [field]: true }));
    },
    [],
  );

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
    const registerFormState = computeFormErrors(
      // eslint-disable-next-line react-hooks/refs
      formData.current,
      errors,
      validateRegister,
      t,
    );
    return {
      visibleRegisterErrors: registerFormState.visible,
      isRegisterValid: registerFormState.valid,
    };
  }, [errors, step, t]);

  // const registerFormState = computeFormErrors(
  //   registerFields,
  //   errors,
  //   validateRegister,
  //   t,
  // );
  // const visibleRegisterErrors = registerFormState.visible;
  // const isRegisterValid = registerFormState.valid;

  const submitRegister = () => {
    setErrors({ email: true, name: true, password: true });
    if (!isRegisterValid) return;
    setStep(STEP.INFO);
  };

  const submitInfo = useCallback((values: InputInfoValues) => {
    formData.current = { ...formData.current, info: values };
    setStep(STEP.CHOOSE_SCHOOL);
  }, []);

  const submitSchool = useCallback(() => {
    setStep(STEP.CHOOSE_MEMBERSHIP);
  }, []);

  const onSelectMembership = useCallback((id: string) => {
    setSelectedMembershipId(id);
    formData.current = { ...formData.current, membershipId: id };
  }, []);

  const submitMembership = useCallback(() => {
    setStep(STEP.CHOOSE_ROLE);
  }, []);

  const onSelectRole = useCallback((id: string) => {
    formData.current = { ...formData.current, roleId: id };
  }, []);

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

  const onSchoolKeywordChange = useCallback((value: string) => {
    setSchoolKeyword(value);
  }, []);

  const onSelectSchool = useCallback((id: string) => {
    setSelectedSchoolId(id);
    formData.current = { ...formData.current, schoolId: id };
  }, []);

  const handleSubmit = useCallback(
    (values?: ChooseSchoolValues | InputInfoValues) => {
      switch (step) {
        case STEP.CHOOSE_MEMBERSHIP:
        case STEP.CHOOSE_ROLE: {
          submitMembership();
          break;
        }
        case STEP.CHOOSE_SCHOOL: {
          submitSchool();
          break;
        }
        case STEP.INFO: {
          submitInfo(values as InputInfoValues);
          break;
        }
        default: {
          break;
        }
      }
    },
    [step, submitInfo, submitMembership, submitSchool],
  );

  return {
    chooseOptions,
    filteredSchools,
    formData,
    handleSubmit,
    isRegisterValid,
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
