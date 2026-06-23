import 'intl-pluralrules';

import type { Language } from '@hooks/language/schema';
import type { Resource } from 'i18next';

import { SupportedLanguages } from '@hooks/language/schema';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en-EN.json';
import ko from './ko-KR.json';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';

export const defaultNS = 'myapp';

export const resources = {
  'en-EN': en,
  'ko-KR': ko,
} as const satisfies Record<Language, unknown>;

const savedLanguage =
  AppStorage.getString(AppConstants.APP_LANGUAGE_KEY) ||
  SupportedLanguages.KO_KR;

void i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    fallbackLng: SupportedLanguages.KO_KR,
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
  if (lng === (SupportedLanguages.EN_EN as string)) {
    i18n.addResourceBundle(SupportedLanguages.EN_EN, defaultNS, translations);
  } else if (lng === (SupportedLanguages.KO_KR as string)) {
    i18n.addResourceBundle(SupportedLanguages.KO_KR, defaultNS, translations);
  }
};

export const reloadResource = (lang: string) => {
  void i18n.reloadResources(lang);
};

export { default } from 'i18next';
