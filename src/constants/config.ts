import { RegisterMembershipStep, AuthStep } from '@type/auth';

export const initialLoginForm = {
  email: '',
  password: '',
};

export const PASSWORD_MIN_LENGTH = 6;

export const NEED_INFO_LOGIN_CODE = {
  MEMBERSHIP_INCOMPLETE: 'AUTH_002',
  PHONE_NOT_VERIFIED: 'AUTH_001',
  VERIFY_UNIVERSITY_EMAIL: 'AUTH_003',
};

export const DayOfWeek = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

export const REQUEST_ADD_CARD_METHOD_TYPES = {
  ACCOUNT: 'PABK',
  CARD: 'PACA',
};

export enum BANK_ACC_TYPES {
  ACCOUNT = 'BANK_ACCOUNT',
  CARD = 'CARD',
}

export enum VOUCHER_TYPES {
  RATE = 'RATE',
  AMOUNT = 'AMOUNT',
}
export enum VOUCHERS_STATUSES {
  AVAILABLE = 'AVAILABLE',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
}
export enum EASY_PAY_METHODS {
  KAKAOPAY = 'KAKAOPAY',
  NAVERPAY = 'NAVERPAY',
  TOSSPAY = 'TOSSPAY',
}

export const REGISTER_MEMBER_SHIP_STEP = {
  CHOOSE_SCHOOL: 'choose_school' as RegisterMembershipStep,
  CHOOSE_MEMBERSHIP: 'choose_membership' as RegisterMembershipStep,
  INPUT_ACADEMIC_EMAIL: 'input_academic_email' as RegisterMembershipStep,
  ACADEMIC_VERIFICATION: 'academic_verification' as RegisterMembershipStep,
  ACADEMIC_VERIFICATION_COMPLETED:
    'academic_verification_completed' as RegisterMembershipStep,
  REGISTER_COMPLETED: 'register_completed' as RegisterMembershipStep,
};
export const REGISTER_FLOW_STEP = {
  CHOOSE_MEMBERSHIP: 'choose_membership' as AuthStep,
  ACADEMIC_VERIFICATION_COMPLETED:
    'academic_verification_completed' as AuthStep,
  VERIFY_INFO_FAILED: 'verify_info_failed' as AuthStep,
  INPUT_ACADEMIC_EMAIL: 'input_academic_email' as AuthStep,
  ACADEMIC_VERIFICATION: 'academic_verification' as AuthStep,
  CHOOSE_ROLE: 'choose_role' as AuthStep,
  CHOOSE_SCHOOL: 'choose_school' as AuthStep,
  FORM: 'form' as AuthStep,
  VERIFIED_INFO: 'verified_info' as AuthStep,
  REGISTER_INPUT: 'register_input' as AuthStep,
  BANK_INFORMATION: 'bank_information' as AuthStep,
} as const;

export const MEMBER_ID = 'member';

export const MEMBERSHIP_TYPE = {
  TEACHER: 'TEACHER',
  NON_MEMBER: 'NON_MEMBER',
  UNIVERSITY_STAFF: 'EMPLOYEE',
  COOP_STAFF: 'COOP_EMPLOYEE',
  OTHER: 'OTHER',
  STUDENT: 'STUDENT',
} as const;

export const HISLOP_BUTTON = { top: 10, bottom: 10, left: 10, right: 10 };

export const MEMBERSHIP_OPTIONS = [
  {
    id: MEMBERSHIP_TYPE.STUDENT,
    label: 'choose_membership.join_student_title',
    desc: 'choose_membership.join_student_desc',
  },
  {
    id: MEMBERSHIP_TYPE.TEACHER,
    label: 'choose_membership.join_teacher_title',
    desc: 'choose_membership.join_teacher_desc',
  },
  {
    id: MEMBERSHIP_TYPE.UNIVERSITY_STAFF,
    label: 'choose_membership.join_university_staff_title',
    desc: 'choose_membership.join_university_staff_desc',
  },
  {
    id: MEMBERSHIP_TYPE.COOP_STAFF,
    label: 'choose_membership.join_coop_staff_title',
    desc: 'choose_membership.join_coop_staff_desc',
    other: true,
  },

  {
    id: MEMBERSHIP_TYPE.OTHER,
    label: 'choose_membership.join_other_title',
    desc: 'choose_membership.join_other_desc',
    other: true,
  },
  // {
  //   id: MEMBERSHIP_TYPE.NON_MEMBER,
  //   label: 'choose_membership.join_non_member_title',
  //   desc: 'choose_membership.join_non_member_desc',
  // },
] as const;

export const MEMBER_STATUS = {
  HIBERNATION: 'HIBERNATION',
} as const;

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
export const UPDATE_ADDRESS_CART_KEY = 'UPDATE_ADDRESS_CART_KEY' as const;
export const NEED_CONTRIBUTION_KEY = 'NEED_CONTRIBUTION_KEY' as const;
export const INIT_SCREEN_START_UP_KEY = 'INIT_SCREEN_START_UP_KEY' as const;

export enum PaymentTypes {
  BALANCE = 'BALANCE',
  CARD_DIRECT = 'CARD_DIRECT',
  SAVED_METHOD = 'SAVED_METHOD',
  CARD_SAVE = 'CARD_SAVE',
  EASY_PAY = 'EASY_PAY',
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
}

export const AttributeType = {
  SINGLE: 'SINGLE',
  MULTIPLE_ONCE: 'MULTIPLE',
  MULTIPLE_CHOICE: 'QUANTITY',
};
