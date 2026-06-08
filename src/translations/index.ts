import 'intl-pluralrules';

import type { Language } from '@hooks/language/schema';
import type { Resource } from 'i18next';

import { SupportedLanguages } from '@hooks/language/schema';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { createMMKV } from 'react-native-mmkv';

import en from './en-EN.json';
import fr from './fr-FR.json';

export const APP_LANGUAGE_KEY = 'appLanguage';

const storage = createMMKV();

export const defaultNS = 'myapp';

export const resources = {
  'en-EN': en,
  'fr-FR': fr,
} as const satisfies Record<Language, unknown>;

const savedLanguage =
  storage.getString(APP_LANGUAGE_KEY) ?? SupportedLanguages.EN_EN;

void i18n
  .use(initReactI18next)
  .init({
    defaultNS,
    fallbackLng: SupportedLanguages.EN_EN,
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
  } else if (lng === (SupportedLanguages.FR_FR as string)) {
    i18n.addResourceBundle(SupportedLanguages.FR_FR, defaultNS, translations);
  }
};

export const reloadResource = (lang: string) => {
  void i18n.reloadResources(lang);
};

export { default } from 'i18next';
