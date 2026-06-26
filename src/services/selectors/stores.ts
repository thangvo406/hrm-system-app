import type { StoreItem } from '@type/store';
import type { RootState } from '@services/common/store';

const getStoreOrderRecent = (state: RootState): StoreItem | undefined =>
  state.stores.storeOrderRecent;

export const StoresSelector = {
  getStoreOrderRecent,
};
