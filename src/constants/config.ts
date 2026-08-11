import { RegisterMembershipStep, AuthStep, PointTagStyle } from '@type';

export const initialLoginForm = {
  email: '',
  password: '',
};

export const PASSWORD_MIN_LENGTH = 6;

export const NEED_INFO_LOGIN_CODE = {
  MEMBERSHIP_INCOMPLETE: 'AUTH_002',
  PHONE_NOT_VERIFIED: 'AUTH_001',
  VERIFY_UNIVERSITY_EMAIL: 'AUTH_003',
  VERIFY_NEW_LOGIN: 'AUTH_005',
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
export const EMPTY_VALUE = '-';

export const COLORS_POINT_AMOUNT: Record<string, string | undefined> = {
  POINT_EXPIRE: '#D9534F',
  POINT_USE: '#1A1A1A',
  POINT_EARN: '#2DB34A',
  REFUND: '#2DB34A',
};

export const POINT_TAG_STYLE: Record<string, PointTagStyle | undefined> = {
  POINT_EXPIRE: {
    background: '#FBE0E0',
    color: '#D9534F',
    title: 'pay_point.tags.point_expired',
  },
  REFUND: {
    background: '#DFF3E1',
    color: '#2DB34A',
    title: 'pay_point.tags.point_accrue',
  },
  POINT_USE: {
    background: '#ECECEC',
    color: '#6B6B6B',
    title: 'pay_point.tags.point_use',
  },
  POINT_EARN: {
    background: '#DFF3E1',
    color: '#2DB34A',
    title: 'pay_point.tags.point_accrue',
  },
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
  BANK_INFORMATION: 'bank_information' as RegisterMembershipStep,
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

export const GRADE_MEMBERSHIP_TYPE = {
  GENERAL: 'GENERAL',
  UNIVERSITY: 'UNIVERSITY',
  COOP: 'COOPERATIVE',
};
export const MEMBERSHIP_TYPE = {
  TEACHER: 'TEACHER',
  NON_MEMBER: 'NON_MEMBER',
  UNIVERSITY_STAFF: 'EMPLOYEE',
  COOP_STAFF: 'COOP_EMPLOYEE',
  OTHER: 'OTHER',
  STUDENT: 'STUDENT',
} as const;

export const HISLOP_BUTTON = { top: 10, bottom: 10, left: 10, right: 10 };

export const MEMBER_SHIP_TYPE_HOME = {
  [GRADE_MEMBERSHIP_TYPE.COOP]: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  [GRADE_MEMBERSHIP_TYPE.UNIVERSITY]: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
  },
  [GRADE_MEMBERSHIP_TYPE.GENERAL]: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
  },
};
enum TransactionType {
  PAY_MONEY_CHARGE = 'PAY_MONEY_CHARGE',
  SMART_ORDER_PAYMENT = 'SMART_ORDER_PAYMENT',
  POS_PAYMENT = 'POS_PAYMENT',
  REFUND = 'REFUND',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  POINT_EARN = 'POINT_EARN',
  POINT_USE = 'POINT_USE',
  CONTRIBUTION_EARN = 'CONTRIBUTION_EARN',
  CONTRIBUTION_DECREASE = 'CONTRIBUTION_DECREASE',
  CONTRIBUTION_PAYMENT = 'CONTRIBUTION_PAYMENT',
  DIVIDEND_EARN = 'DIVIDEND_EARN',
  CONTRIBUTION_DIVIDEND_EARN = 'CONTRIBUTION_DIVIDEND_EARN',
  USAGE_DIVIDEND_EARN = 'USAGE_DIVIDEND_EARN',
  POINT_EXPIRE = 'POINT_EXPIRE',
  PAY_MONEY_WITHDRAWAL = 'PAY_MONEY_WITHDRAWAL',
  PAY_MONEY_CHARGE_BONUS = 'PAY_MONEY_CHARGE_BONUS',
}

export enum HEADLINE_ACTIONS {
  CHARGE = 'CHARGE',
  CHARGE_BONUS_POINT = 'CHARGE_BONUS_POINT',
  POINT_EARN = 'POINT_EARN',
  PAYMENT = 'PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  POINT_GRANT = 'POINT_GRANT',
  POINT_USE = 'POINT_USE',
  POINT_EXPIRE = 'POINT_EXPIRE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

export const SUMMARY_TRANSACTION_DETAIL_DISPLAY: Record<
  HEADLINE_ACTIONS,
  string
> = {
  [HEADLINE_ACTIONS.CHARGE]:
    'account_management.transaction_detail_texts.charge',

  [HEADLINE_ACTIONS.CHARGE_BONUS_POINT]:
    'account_management.transaction_detail_texts.charge_bonus_point',

  [HEADLINE_ACTIONS.PAYMENT]:
    'account_management.transaction_detail_texts.payment',

  [HEADLINE_ACTIONS.WITHDRAWAL]:
    'account_management.transaction_detail_texts.withdrawal',

  [HEADLINE_ACTIONS.POINT_EARN]:
    'account_management.transaction_detail_texts.point_earn',

  [HEADLINE_ACTIONS.POINT_GRANT]:
    'account_management.transaction_detail_texts.point_grant',

  [HEADLINE_ACTIONS.POINT_USE]:
    'account_management.transaction_detail_texts.point_use',

  [HEADLINE_ACTIONS.POINT_EXPIRE]:
    'account_management.transaction_detail_texts.point_expire',

  [HEADLINE_ACTIONS.REFUND]:
    'account_management.transaction_detail_texts.refund',

  [HEADLINE_ACTIONS.ADJUSTMENT]:
    'account_management.transaction_detail_texts.adjustment',
};

export const TRANSACTION_DETAIL_DISPLAY: Record<TransactionType, string> = {
  [TransactionType.PAY_MONEY_CHARGE]:
    'pay_point.transaction_detail_texts.pay_money_charge',

  [TransactionType.SMART_ORDER_PAYMENT]:
    'pay_point.transaction_detail_texts.smart_order_payment',

  [TransactionType.POS_PAYMENT]:
    'pay_point.transaction_detail_texts.pos_payment',

  [TransactionType.REFUND]: 'pay_point.transaction_detail_texts.refund',

  [TransactionType.MANUAL_ADJUSTMENT]:
    'pay_point.transaction_detail_texts.manual_adjustment',

  [TransactionType.POINT_EARN]: 'pay_point.transaction_detail_texts.point_earn',

  [TransactionType.POINT_USE]: 'pay_point.transaction_detail_texts.point_use',

  [TransactionType.CONTRIBUTION_EARN]:
    'pay_point.transaction_detail_texts.contribution_earn',

  [TransactionType.CONTRIBUTION_DECREASE]:
    'pay_point.transaction_detail_texts.contribution_decrease',

  [TransactionType.CONTRIBUTION_PAYMENT]:
    'pay_point.transaction_detail_texts.contribution_payment',

  [TransactionType.DIVIDEND_EARN]:
    'pay_point.transaction_detail_texts.dividend_earn',

  [TransactionType.CONTRIBUTION_DIVIDEND_EARN]:
    'pay_point.transaction_detail_texts.contribution_dividend_earn',

  [TransactionType.USAGE_DIVIDEND_EARN]:
    'pay_point.transaction_detail_texts.usage_dividend_earn',

  [TransactionType.POINT_EXPIRE]:
    'pay_point.transaction_detail_texts.point_expire',

  [TransactionType.PAY_MONEY_WITHDRAWAL]:
    'pay_point.transaction_detail_texts.pay_money_withdrawal',

  [TransactionType.PAY_MONEY_CHARGE_BONUS]:
    'pay_point.transaction_detail_texts.pay_money_charge_bonus',
};

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
