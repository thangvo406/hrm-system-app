import type { AppCallback } from './common';

export type AuthStep =
  | 'verify_info_failed'
  | 'choose_membership'
  | 'input_academic_email'
  | 'academic_verification'
  | 'academic_verification_completed'
  | 'choose_role'
  | 'form'
  | 'bank_information'
  | 'verified_info'
  | 'register_input'
  | 'choose_school';

export type RegisterMembershipStep =
  | 'bank_information'
  | 'choose_school'
  | 'choose_membership'
  | 'input_academic_email'
  | 'academic_verification'
  | 'academic_verification_completed'
  | 'register_completed';

export interface ICredentials {
  accessToken: string;
  refreshToken?: string;
}

export interface IResponseRefreshToken {
  accessToken: string;
  refreshToken?: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface IResponseLogin {
  accessToken: string;
  membershipType: string;
  membershipStatus: string;
  refreshToken: string;
  archivedInformation: string;
  dormantDate: string;
  lastLoginDate: string;
  expiredInformation: string;
  universityId: string;
  accountStatus: string;
}

export interface IRequestLogin extends AppCallback<IResponseLogin> {
  username: string;
  rememberMe: boolean;
  password: string;
}

// TODO: define request fields when the reactivation API spec is available.
export type IRequestActiveAccount = Record<string, never>;
