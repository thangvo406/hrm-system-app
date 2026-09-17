import * as z from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
  KO_KR = 'ko-KR',
  VI_VN = 'vi-VN',
}

export const ApiLanguages = {
  [SupportedLanguages.EN_EN]: 'en',
  [SupportedLanguages.KO_KR]: 'ko',
  [SupportedLanguages.VI_VN]: 'vi',
};

export const languageSchema = z.enum([
  SupportedLanguages.EN_EN,
  SupportedLanguages.KO_KR,
  SupportedLanguages.VI_VN,
]);

export type Language = z.infer<typeof languageSchema>;
