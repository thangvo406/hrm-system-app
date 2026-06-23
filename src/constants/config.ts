import type { AuthStep } from '@hooks/useRegister';

export const initialLoginForm = {
  email: '',
  password: '',
};

export const PASSWORD_MIN_LENGTH = 6;

export const NEED_INFO_LOGIN_CODE = {
  MEMBERSHIP_INCOMPLETE: 'AUTH_002',
  PHONE_NOT_VERIFIED: 'AUTH_001',
};

export const STEP = {
  CHOOSE_MEMBERSHIP: 'choose_membership' as AuthStep,
  CHOOSE_ROLE: 'choose_role' as AuthStep,
  CHOOSE_SCHOOL: 'choose_school' as AuthStep,
  FORM: 'form' as AuthStep,
  REGISTER_INPUT: 'register_input' as AuthStep,
  REGISTER_COMPLETED: 'register_completed' as AuthStep,
  BANK_INFORMATION: 'bank_information' as AuthStep,
} as const;

export const MEMBER_ID = 'member';

export const MEMBERSHIP_TYPE = {
  TEACHER: 'TEACHER',
  NON_MEMBER: 'NON_MEMBER',
  STAFF: 'EMPLOYEE',
  STUDENT: 'STUDENT',
} as const;

export const HISLOP_BUTTON = { top: 10, bottom: 10, left: 10, right: 10 };

export const MEMBERSHIP_OPTIONS = [
  {
    id: MEMBERSHIP_TYPE.STUDENT,
    label: 'choose_membership.join_as_student',
  },
  {
    id: MEMBERSHIP_TYPE.TEACHER,
    label: 'choose_membership.join_as_employee',
  },
  {
    id: MEMBERSHIP_TYPE.STAFF,
    label: 'choose_membership.join_as_staff',
  },
  {
    id: MEMBERSHIP_TYPE.NON_MEMBER,
    label: 'choose_membership.join_as_non_member',
  },
] as const;

export const SURVEY_TYPE = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  SHORT_ANSWER: 'SHORT_ANSWER',
} as const;

export const ROLE_OPTIONS = [
  { id: 'employee', label: 'Employee' },
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
] as const;

export const CARRIER_ITEMS = [
  { id: 'SKT', label: 'SKT' },
  { id: 'KT', label: 'KT' },
  { id: 'LGU+', label: 'LGU+' },
] as const;

export const DEFAULT_CARRIER = 'SKT';
export const APP_LANGUAGE_KEY = 'APP_LANGUAGE_KEY' as const;
