import type { Language } from '@hooks/language/schema';

import { SupportedLanguages } from '@hooks/language/schema';
import en from '@translations/en-EN.json';
import ko from '@translations/ko-KR.json';
import vi from '@translations/vi-VN.json';

const DEFAULT_NAMESPACE = 'myapp';
const NAMESPACE_SEPARATOR = ':';
const KEY_SEPARATOR = '.';

const RESOURCES: Record<Language, unknown> = {
  [SupportedLanguages.EN_EN]: en,
  [SupportedLanguages.KO_KR]: ko,
  [SupportedLanguages.VI_VN]: vi,
};

const resolvePath = (source: unknown, path: readonly string[]): unknown => {
  let node: unknown = source;
  for (const part of path) {
    if (typeof node !== 'object' || node === undefined || node === null) {
      return undefined;
    }
    node = (node as Record<string, unknown>)[part];
  }
  return node;
};

/**
 * Check that a translation key really exists (and resolves to a string) in a
 * language resource. Accepts both `screens.profile.title` and the namespaced
 * form `myapp:screens.profile.title`.
 */
export const hasTranslationKey = (key: string): boolean => {
  if (key.trim() === '') {
    return false;
  }
  const separatorIndex = key.indexOf(NAMESPACE_SEPARATOR);
  const namespace =
    separatorIndex === -1 ? DEFAULT_NAMESPACE : key.slice(0, separatorIndex);
  const path = key.slice(separatorIndex + 1).split(KEY_SEPARATOR);
  // A key only counts as present when every supported locale translates it.
  return Object.values(RESOURCES).every(
    resource => typeof resolvePath(resource, [namespace, ...path]) === 'string',
  );
};

/** Shorthand for the Korean resource (`ko-KR.json`). */
export const hasKoTranslationKey = (key: string): boolean =>
  hasTranslationKey(key);

/** Keys that are missing (or not a string) in the given language. */
export const getMissingTranslationKeys = (keys: readonly string[]): string[] =>
  keys.filter(key => !hasTranslationKey(key));
