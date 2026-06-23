import i18next from 'i18next';

import { SupportedLanguages } from './schema';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';

const changeLanguage = (lang: SupportedLanguages) => {
  void i18next.changeLanguage(lang);
  AppStorage.set(AppConstants.APP_LANGUAGE_KEY, lang);
};

const toggleLanguage = () => {
  const lang =
    i18next.language === (SupportedLanguages.EN_EN as string)
      ? SupportedLanguages.KO_KR
      : SupportedLanguages.EN_EN;
  void i18next.changeLanguage(
    i18next.language === (SupportedLanguages.EN_EN as string)
      ? SupportedLanguages.KO_KR
      : SupportedLanguages.EN_EN,
  );
  AppStorage.set(AppConstants.APP_LANGUAGE_KEY, lang);
};

export const useI18n = () => {
  return { changeLanguage, toggleLanguage };
};
