import { CommonUtils } from '@utils';

let pendingUrl: string | undefined;
// const DEEP_LINK_PREFIXES = ['coop://', 'https://app.coop.com'];

export const deepLinkGate = {
  setPending: (url: string) => {
    pendingUrl = url;
  },
  consumePending: () => {
    const url = pendingUrl;
    pendingUrl = undefined;
    return url;
  },

  getPathFromUrl: (url: string) => {
    const object = CommonUtils.queryParamsToObject(url);
    return object;
  },
};
