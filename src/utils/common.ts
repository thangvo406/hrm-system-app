import { KakaoDocument, SearchAddressItem } from '@type';
import isNumber from 'lodash/isNumber';

const PHONE_AREA_CODE_LENGTH = 3;
const PHONE_MIDDLE_LENGTH = 4;
const PHONE_LAST_LENGTH = 4;
const PHONE_MAX_DIGITS = 11;

export const computeFormAuthErrors = <
  V extends Record<string, string>,
  E extends Record<string, string | undefined>,
>(
  values: V,
  errorsState: Record<string, boolean | undefined>,
  validate: (values: V, t: (key: string) => string) => E,
  t: (key: string) => string,
): { full: E; valid: boolean; visible: E } => {
  const full = validate(values, t);
  const visible = {} as E;
  for (const key of Object.keys(full) as (keyof E)[]) {
    visible[key] = errorsState[key as string] === true ? full[key] : undefined;
  }
  return { full, valid: Object.keys(full).length === 0, visible };
};

export const removeEmptyFieldObject = (
  obj: any,
  isRemoveEmptyField = false,
): any => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => {
        const valid = v != null;
        if (valid && isRemoveEmptyField) {
          return isNumber(v) && v == 0 ? true : v != '';
        }
        return valid;
      })
      .map(([k, v]) => [
        k,
        v === Object(v) ? removeEmptyFieldObject(v, isRemoveEmptyField) : v,
      ]),
  );
};

export const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return 'n/a';
  }
  const i = Number.parseInt(
    Math.floor(Math.log(bytes) / Math.log(1e6)).toString(),
    10,
  );
  // if (i == 0) {
  //    return bytes + ' ' + sizes[i];
  // }
  return {
    value: (bytes / Math.pow(1e6, i)).toFixed(1),
    unit: sizes[i],
  };
};

export const formatPhoneNumber = (input: string): string => {
  input = input || '';
  const digits = input.replaceAll?.(/\D/g, '')?.slice(0, PHONE_MAX_DIGITS);
  const area = digits?.slice?.(0, PHONE_AREA_CODE_LENGTH);
  if (digits?.length <= PHONE_AREA_CODE_LENGTH) {
    return area;
  }
  const middle = digits?.slice(
    PHONE_AREA_CODE_LENGTH,
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH,
  );
  if (digits?.length <= PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH) {
    return `${area}-${middle}`;
  }
  const last = digits?.slice(
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH,
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH + PHONE_LAST_LENGTH,
  );
  return `${area}-${middle}-${last}`;
};

// Auth?page=0&id=2&filter=desc
export const objectToQueryParams = (o: Record<string, any> = {}) =>
  Object.entries(o)
    .map(([k, v]) => {
      const serializeArray = (arr: any[]) =>
        `[${arr
          .map(it =>
            it != null && typeof it === 'object'
              ? JSON.stringify(it)
              : String(it),
          )
          .join(',')}]`;

      let serialized: string;
      if (Array.isArray(v)) {
        serialized = serializeArray(v);
      } else if (v == null) {
        serialized = '';
      } else if (typeof v === 'object') {
        const keys = Object.keys(v);
        const isArrayLike =
          keys.length > 0 && keys.every(key => /^\d+$/.test(key));
        if (isArrayLike) {
          const ordered = keys
            .map(Number)
            .sort((a, b) => a - b)
            .map(idx => (v as any)[idx]);
          serialized = serializeArray(ordered);
        } else {
          serialized = JSON.stringify(v);
        }
      } else {
        serialized = String(v);
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(serialized)}`;
    })
    .join('&');

export const queryParamsToObject = (query: string): Record<string, unknown> => {
  if (!query) return {};
  const qIdx = query.indexOf('?');
  const slashIdx = query.indexOf('//');
  const str =
    qIdx !== -1
      ? query.slice(qIdx + 1)
      : slashIdx === -1
        ? query
        : query.slice(slashIdx + 2);
  return Object.fromEntries(
    str.split('&').flatMap(pair => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) return [];
      const key = pair.slice(0, eqIdx);
      const raw = pair.slice(eqIdx + 1);
      try {
        return [[key, JSON.parse(raw)]];
      } catch {
        return [[key, raw]];
      }
    }),
  );
};

const PASSWORD_MIN_LENGTH = 8;
const RE_HAS_LETTER = /[A-Za-z]/;
const RE_HAS_NUMBER = /\d/;
const RE_HAS_SPECIAL = /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/;
const RE_ALLOWED_CHARS = /^[\w!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+$/;

export const validatePassword = (password: string): boolean =>
  password.length >= PASSWORD_MIN_LENGTH &&
  RE_HAS_LETTER.test(password) &&
  RE_HAS_NUMBER.test(password) &&
  RE_HAS_SPECIAL.test(password) &&
  RE_ALLOWED_CHARS.test(password);

export function getErrorMessageApi(error: any) {
  return error?.response?.data?.message || error?.message || 'unknown error';
}

export const NOOP = () => undefined;

export const decodeUrlText = (text: string): string =>
  decodeURIComponent(text.replaceAll('+', ' '));

export const upperCaseFirstChar = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function mapKakaoAddress(doc: KakaoDocument): SearchAddressItem {
  return {
    id: `${doc.x}-${doc.y}`,
    roadAddress: doc.road_address?.address_name,
    landAddress: doc.address?.address_name,
    postalCode: doc.road_address?.zone_no,
    province:
      doc.road_address?.region_1depth_name ?? doc.address?.region_1depth_name,
    district:
      doc.road_address?.region_2depth_name ?? doc.address?.region_2depth_name,
    town:
      doc.road_address?.region_3depth_name ?? doc.address?.region_3depth_name,
    longitude: doc.x,
    latitude: doc.y,
    detail: doc,
  };
}
