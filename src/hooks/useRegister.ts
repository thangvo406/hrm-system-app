import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';

import { useCallback, useMemo, useState } from 'react';
import { ValidateUtils } from '@kits/core/utils';
import { useTranslation } from 'react-i18next';

import {
  PASSWORD_MIN_LENGTH,
  // eslint-disable-next-line perfectionist/sort-named-imports
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

export type AuthStep = 'choose_school' | 'form' | 'info';

const STEP_STACK: readonly AuthStep[] = ['form', 'info', 'choose_school'];

const initialRegisterForm = {
  email: '',
  name: '',
  password: '',
};

const MOCK_SCHOOLS: readonly School[] = [
  { address: '서울시 OO구 OO동 OOO', id: '1', name: '생협대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '2', name: '쿠피대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '3', name: '그냥대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '4', name: '좋은대학교' },
];

const validateRegister = (
  values: typeof initialRegisterForm,
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
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [infoValues, setInfoValues] = useState<InputInfoValues | undefined>();
  const [errors, setErrors] = useState<{
    email?: boolean;
    name?: boolean;
    password?: boolean;
  }>({});
  const [step, setStep] = useState<AuthStep>('form');
  const [schoolKeyword, setSchoolKeyword] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<
    string | undefined
  >();

  const onRegisterChange = useCallback(
    (field: keyof typeof initialRegisterForm) => (value: string) => {
      setRegisterForm(previous => ({ ...previous, [field]: value }));
      setErrors(previous => ({ ...previous, [field]: true }));
    },
    [],
  );

  const registerFormState = computeFormErrors(
    registerForm,
    errors,
    validateRegister,
    t,
  );
  const visibleRegisterErrors = registerFormState.visible;
  const isRegisterValid = registerFormState.valid;

  const goToStep = useCallback((target: AuthStep) => {
    setStep(previous => {
      const previousIndex = STEP_STACK.indexOf(previous);
      const targetIndex = STEP_STACK.indexOf(target);
      return targetIndex !== -1 && targetIndex <= previousIndex
        ? target
        : previous;
    });
  }, []);

  const submitRegister = () => {
    setErrors({ email: true, name: true, password: true });
    if (!isRegisterValid) return;
    // dispatch(
    //   registerRequest({
    //     email: registerForm.email.trim(),
    //     name: registerForm.name.trim(),
    //     password: registerForm.password,
    //   }),
    // );
    setStep('info');
  };

  const submitInfo = (values: InputInfoValues) => {
    setInfoValues(values);
    setStep('choose_school');
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

  const onSchoolKeywordChange = useCallback((value: string) => {
    setSchoolKeyword(value);
  }, []);

  const onSelectSchool = useCallback((id: string) => {
    setSelectedSchoolId(id);
  }, []);

  return {
    filteredSchools,
    goToStep,
    infoValues,
    isRegisterValid,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectSchool,
    register: registerForm,
    registerErrors: visibleRegisterErrors,
    schoolKeyword,
    selectedSchool,
    selectedSchoolId,
    step,
    submitInfo,
    submitRegister,
  };
};
