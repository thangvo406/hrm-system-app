import isNumber from 'lodash/isNumber';

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

export function getErrorMessageApi(error: any) {
  return error?.response?.data?.message || error?.message || 'unknown error';
}

export const NOOP = () => undefined;

export const upperCaseFirstChar = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};
