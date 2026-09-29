import type { RootState } from '@services/common/store';
import type { TRequestType } from '@type/requests';

const getDraft =
  (type: TRequestType) =>
  (state: RootState): unknown =>
    state.requests.drafts?.[type];

const getDrafts = (state: RootState): unknown => state.requests.drafts;

export const RequestsSelector = {
  getDraft,
  getDrafts,
};
