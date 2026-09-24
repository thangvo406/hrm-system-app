import type { Profile } from '@services/request/account';
import type { RootState } from '@services/common/store';
import { IOffice } from '@type';

const getProfile = (state: RootState): Profile | undefined =>
  state.account.profile;

const getOffices = (state: RootState): IOffice[] | undefined =>
  state.account.offices;

export const AccountSelector = {
  getProfile,
  getOffices,
};
