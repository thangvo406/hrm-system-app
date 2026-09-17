import 'intl-pluralrules';

import type { Language } from '@hooks/language/schema';
import type { Resource } from 'i18next';

import { languageSchema, SupportedLanguages } from '@hooks/language/schema';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en-EN.json';
import ko from './ko-KR.json';
import vi from './vi-VN.json';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';

export const defaultNS = 'myapp';

export const resources = {
  'en-EN': en,
  'ko-KR': ko,
  'vi-VN': vi,
} as const satisfies Record<Language, unknown>;

const savedLanguage =
  AppStorage.getString(AppConstants.APP_LANGUAGE_KEY) ||
  SupportedLanguages.VI_VN;

void i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    fallbackLng: SupportedLanguages.VI_VN,
    lng: savedLanguage,
    resources,
  })
  .then(() => {
    // add capitalization formatter
    i18n.services.formatter?.add(
      'capitalize',
      (value: string) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    );
  });

export const executeLanguageFallback = (
  lng: string,
  translations: Resource,
) => {
  // Parsing through the schema keeps this working for every supported
  // language without a branch per locale.
  const parsed = languageSchema.safeParse(lng);
  if (parsed.success) {
    i18n.addResourceBundle(parsed.data, defaultNS, translations);
  }
};

export const reloadResource = (lang: string) => {
  void i18n.reloadResources(lang);
};

export { default } from 'i18next';
