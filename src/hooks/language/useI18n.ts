import i18next from 'i18next';

import { SupportedLanguages } from './schema';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';

// Order the toggle cycles through, starting from the app default.
const LANGUAGE_CYCLE: SupportedLanguages[] = [
  SupportedLanguages.VI_VN,
  SupportedLanguages.EN_EN,
  SupportedLanguages.KO_KR,
];

const changeLanguage = (lang: SupportedLanguages) => {
  void i18next.changeLanguage(lang);
  AppStorage.set(AppConstants.APP_LANGUAGE_KEY, lang);
};

const isEn = () => {
  return i18next.language?.includes('en');
};

const getCurrentLanguage = () =>
  LANGUAGE_CYCLE.find(lang => lang === i18next.language) ??
  SupportedLanguages.VI_VN;

/** Steps to the next language in `LANGUAGE_CYCLE`, wrapping around. */
const toggleLanguage = () => {
  const currentIndex = LANGUAGE_CYCLE.indexOf(getCurrentLanguage());
  const nextLanguage =
    LANGUAGE_CYCLE[(currentIndex + 1) % LANGUAGE_CYCLE.length];
  if (nextLanguage) {
    changeLanguage(nextLanguage);
  }
};

export const useI18n = () => {
  return {
    changeLanguage,
    currentLanguage: getCurrentLanguage(),
    isEn: isEn(),
    toggleLanguage,
  };
};
