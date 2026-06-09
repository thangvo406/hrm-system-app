import * as z from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
  KO_KR = 'ko-KR',
}

export const languageSchema = z.enum([
  SupportedLanguages.EN_EN,
  SupportedLanguages.KO_KR,
]);

export type Language = z.infer<typeof languageSchema>;
