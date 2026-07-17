import type { IStoreItem } from '@type/store';
import type { RootState } from '@services/common/store';

const getStoreOrderRecent = (state: RootState): IStoreItem | undefined =>
  state.stores.storeOrderRecent;

export const StoresSelector = {
  getStoreOrderRecent,
};
