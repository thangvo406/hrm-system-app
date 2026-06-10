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
