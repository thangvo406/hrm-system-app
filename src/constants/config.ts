import type { AuthStep, School } from '@hooks/useRegister';

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
  INFO: 'info' as AuthStep,
  REGISTER_COMPLETED: 'register_completed' as AuthStep,
} as const;

export const MEMBER_ID = 'member';

export const MOCK_SCHOOLS: readonly School[] = [
  { address: '서울시 OO구 OO동 OOO', id: '1', name: '생협대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '2', name: '쿠피대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '3', name: '그냥대학교' },
  { address: '서울시 OO구 OO동 OOO', id: '4', name: '좋은대학교' },
];

export const MEMBERSHIP_OPTIONS = [
  { id: MEMBER_ID, label: 'Join as a member' },
  { id: 'non_member', label: 'Join as a non-member' },
] as const;

export const ROLE_OPTIONS = [
  { id: 'employee', label: 'Employee' },
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
] as const;
